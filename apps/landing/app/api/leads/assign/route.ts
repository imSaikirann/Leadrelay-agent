
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";



export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { submissionId, memberId, teamId } = await req.json();

  if (!submissionId || !memberId)
    return NextResponse.json({ error: "leadId and memberId are required" }, { status: 400 });


  const company = await prisma.company.findFirst({
    where: { user: { email: session.user.email } },
    select: { id: true },
  });

  let callerRole: string = "owner";
  let callerCompanyId: string;
  let callerTeamMember: { id: string; role: string; companyId: string } | null = null;

  if (company) {

    callerCompanyId = company.id;
    callerRole = "owner";
  } else {

    callerTeamMember = await prisma.teamMember.findFirst({
      where: { email: session.user.email },
      select: { id: true, role: true, companyId: true },
    });

    if (!callerTeamMember)
      return NextResponse.json({ error: "Caller not found" }, { status: 404 });

    callerRole = callerTeamMember.role;
    callerCompanyId = callerTeamMember.companyId;
  }


  if (callerRole === "sales_rep")
    return NextResponse.json({ error: "Sales reps cannot assign leads" }, { status: 403 });


  if (callerRole === "sales_lead") {
    if (!callerTeamMember)
      return NextResponse.json({ error: "Could not identify team lead" }, { status: 400 });


    const ledTeams = await prisma.team.findMany({
      where: { teamLeadId: callerTeamMember.id, companyId: callerCompanyId },
      include: { memberships: { select: { teamMemberId: true } } },
    });

    const allowedMemberIds = new Set(ledTeams.flatMap((t) => t.memberships.map((m) => m.teamMemberId)));

    if (!allowedMemberIds.has(memberId))
      return NextResponse.json(
        { error: "You can only assign leads to reps in your team" },
        { status: 403 }
      );
  }


  const lead = await prisma.formSubmission.findFirst({
    where: { id: submissionId, companyId: callerCompanyId },
  });
  if (!lead)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });


  const targetMember = await prisma.teamMember.findFirst({
    where: { id: memberId, companyId: callerCompanyId },
    select: { id: true, activeLeads: true },
  });
  if (!targetMember)
    return NextResponse.json({ error: "Member not found" }, { status: 404 });

  if (lead.assignedTo && lead.assignedTo !== memberId) {
    await prisma.teamMember.update({
      where: { id: lead.assignedTo },
      data: { activeLeads: { decrement: 1 } },
    });
  }

  // ── Assign ──
  const [updatedLead] = await prisma.$transaction([
    prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        assignedTo: memberId,
        assignedAt: new Date(),
        // Move to "called" queue if still "new"
        status: lead.status === "new" ? "new" : lead.status,
      },
      select: {
        id: true,
        assignedTo: true,
        assignedAt: true,
        status: true,
        rank: true,
        data: true,
      },
    }),
    // Only increment if this is a new assignment (not a reassignment to same rep)
    ...(lead.assignedTo !== memberId
      ? [
          prisma.teamMember.update({
            where: { id: memberId },
            data: { activeLeads: { increment: 1 } },
          }),
        ]
      : []),
  ]);

  return NextResponse.json({ success: true, lead: updatedLead });
}