import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { canManageWorkspace, MEMBER_ROLE, resolveAccess, TEAM_KIND } from "@/lib/access";

export async function GET() {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canManageWorkspace(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teams = await prisma.team.findMany({
    where: { companyId: access.company.id },
    include: {
      teamLead: {
        select: { id: true, name: true, email: true, role: true, status: true },
      },
      memberships: {
        include: {
          member: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              seniority: true,
              specialty: true,
              status: true,
              activeLeads: true,
              leads: true,
              converted: true,
              avgResponseTime: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    teams.map((team) => ({
      id: team.id,
      name: team.name,
      kind: team.kind,
      description: team.description ?? "",
      color: team.color,
      teamLeadId: team.teamLeadId ?? null,
      teamLead: team.teamLead ?? null,
      memberIds: team.memberships.map((membership) => membership.teamMemberId),
      members: team.memberships.map((membership) => membership.member),
      createdAt: team.createdAt,
    }))
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canManageWorkspace(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, color, kind, teamLeadId, memberIds = [] } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 });
  }

  const existingTeamsCount = await prisma.team.count({
    where: { companyId: access.company.id },
  });

  const subscription = await prisma.subscription.findUnique({
    where: { companyId: access.company.id },
    select: { status: true },
  });

  if (subscription?.status === "trial" && existingTeamsCount >= 1) {
    return NextResponse.json(
      { error: "Free trial allows only one workspace. Upgrade your plan to create another workspace." },
      { status: 403 }
    );
  }

  const teamKind = [TEAM_KIND.SALES, TEAM_KIND.LEAD_GEN, TEAM_KIND.REPS, TEAM_KIND.SUPPORT, TEAM_KIND.OPERATIONS].includes(kind)
    ? kind
    : TEAM_KIND.SALES;

  if (memberIds.length > 0) {
    const valid = await prisma.teamMember.count({
      where: { id: { in: memberIds }, companyId: access.company.id },
    });

    if (valid !== memberIds.length) {
      return NextResponse.json({ error: "One or more members not found" }, { status: 400 });
    }
  }

  if (teamLeadId) {
    const lead = await prisma.teamMember.findFirst({
      where: { id: teamLeadId, companyId: access.company.id },
    });

    if (!lead) {
      return NextResponse.json({ error: "Team lead not found" }, { status: 400 });
    }

    if (lead.role === MEMBER_ROLE.SALES_REP) {
      await prisma.teamMember.update({
        where: { id: teamLeadId },
        data: { role: MEMBER_ROLE.SALES_LEAD },
      });
    }
  }

  const uniqueIds = [...new Set([...memberIds, ...(teamLeadId ? [teamLeadId] : [])])];

  if (uniqueIds.length > 0) {
    await prisma.teamMembership.deleteMany({
      where: {
        team: { companyId: access.company.id },
        teamMemberId: { in: uniqueIds },
      },
    });
  }

  const team = await prisma.team.create({
    data: {
      companyId: access.company.id,
      name: name.trim(),
      kind: teamKind,
      description: description?.trim() ?? null,
      color: color ?? "#D4622A",
      teamLeadId: teamLeadId ?? null,
      memberships: {
        create: uniqueIds.map((memberId: string) => ({ teamMemberId: memberId })),
      },
    },
    include: {
      teamLead: { select: { id: true, name: true, email: true, role: true } },
      memberships: { select: { teamMemberId: true } },
    },
  });

  return NextResponse.json(
    {
      id: team.id,
      name: team.name,
      kind: team.kind,
      description: team.description ?? "",
      color: team.color,
      teamLeadId: team.teamLeadId ?? null,
      teamLead: team.teamLead ?? null,
      memberIds: team.memberships.map((membership) => membership.teamMemberId),
      createdAt: team.createdAt,
    },
    { status: 201 }
  );
}
