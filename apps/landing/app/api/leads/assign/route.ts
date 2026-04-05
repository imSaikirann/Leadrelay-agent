import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { canAssignLeads, MEMBER_ROLE, resolveAccess } from "@/lib/access";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canAssignLeads(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const submissionId = body.submissionId ?? body.leadId;
  const memberId = body.memberId;

  if (!submissionId || !memberId) {
    return NextResponse.json({ error: "submissionId and memberId are required" }, { status: 400 });
  }

  if (access.role === MEMBER_ROLE.SALES_LEAD && access.member) {
    const teams = await prisma.team.findMany({
      where: { companyId: access.company.id, teamLeadId: access.member.id },
      include: { memberships: { select: { teamMemberId: true } } },
    });

    const allowedMemberIds = new Set(
      teams.flatMap((team) => team.memberships.map((membership) => membership.teamMemberId))
    );

    if (!allowedMemberIds.has(memberId)) {
      return NextResponse.json(
        { error: "You can only assign leads to reps in your teams" },
        { status: 403 }
      );
    }
  }

  const lead = await prisma.formSubmission.findFirst({
    where: { id: submissionId, companyId: access.company.id },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const targetMember = await prisma.teamMember.findFirst({
    where: {
      id: memberId,
      companyId: access.company.id,
      role: MEMBER_ROLE.SALES_REP,
    },
    select: { id: true },
  });

  if (!targetMember) {
    return NextResponse.json({ error: "Rep not found" }, { status: 404 });
  }

  const updates = [];

  if (lead.assignedTo && lead.assignedTo !== memberId) {
    updates.push(
      prisma.teamMember.update({
        where: { id: lead.assignedTo },
        data: { activeLeads: { decrement: 1 } },
      })
    );
  }

  updates.push(
    prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        assignedTo: memberId,
        assignedAt: new Date(),
        status: lead.status ?? "new",
      },
      select: {
        id: true,
        assignedTo: true,
        assignedAt: true,
        status: true,
        rank: true,
        data: true,
      },
    })
  );

  if (lead.assignedTo !== memberId) {
    updates.push(
      prisma.teamMember.update({
        where: { id: memberId },
        data: { activeLeads: { increment: 1 } },
      })
    );
  }

  const result = await prisma.$transaction(updates);
  const updatedLead = result.find((item) => "assignedTo" in item);

  return NextResponse.json({ success: true, lead: updatedLead });
}
