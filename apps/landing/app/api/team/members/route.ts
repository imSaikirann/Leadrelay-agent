// app/api/team/members/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canAssignLeads, MEMBER_ROLE, resolveAccess } from "@/lib/access";

export async function GET() {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canAssignLeads(access))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let allowedMemberIds: string[] | undefined;

  if (access.role === MEMBER_ROLE.SALES_LEAD && access.member) {
    const teams = await prisma.team.findMany({
      where: {
        companyId: access.company.id,
        teamLeadId: access.member.id,
      },
      include: { memberships: { select: { teamMemberId: true } } },
    });

    allowedMemberIds = teams.flatMap((team) => team.memberships.map((membership) => membership.teamMemberId));
  }

  const members = await prisma.teamMember.findMany({
    where: {
      companyId: access.company.id,
      status: "active",
      role: MEMBER_ROLE.SALES_REP,
      ...(allowedMemberIds ? { id: { in: allowedMemberIds } } : {}),
    },
    select: { id: true, name: true, role: true, activeLeads: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ members });
}
