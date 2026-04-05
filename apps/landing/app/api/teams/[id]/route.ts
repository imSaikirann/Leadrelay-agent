import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { canManageWorkspace, MEMBER_ROLE, resolveAccess, TEAM_KIND } from "@/lib/access";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canManageWorkspace(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await prisma.team.findFirst({
    where: { id, companyId: access.company.id },
    include: { memberships: { select: { teamMemberId: true } } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const { name, description, color, kind, teamLeadId, memberIds } = await req.json();
  const prevLeadId = existing.teamLeadId;
  const newLeadId = teamLeadId !== undefined ? teamLeadId : prevLeadId;

  if (newLeadId !== prevLeadId) {
    if (prevLeadId) {
      const otherTeams = await prisma.team.count({
        where: { companyId: access.company.id, teamLeadId: prevLeadId, id: { not: id } },
      });

      if (otherTeams === 0) {
        await prisma.teamMember.updateMany({
          where: { id: prevLeadId, role: MEMBER_ROLE.SALES_LEAD },
          data: { role: MEMBER_ROLE.SALES_REP },
        });
      }
    }

    if (newLeadId) {
      const newLead = await prisma.teamMember.findFirst({
        where: { id: newLeadId, companyId: access.company.id },
      });

      if (!newLead) {
        return NextResponse.json({ error: "New team lead not found" }, { status: 400 });
      }

      if (newLead.role === MEMBER_ROLE.SALES_REP) {
        await prisma.teamMember.update({
          where: { id: newLeadId },
          data: { role: MEMBER_ROLE.SALES_LEAD },
        });
      }
    }
  }

  if (memberIds !== undefined) {
    if (memberIds.length > 0) {
      const valid = await prisma.teamMember.count({
        where: { id: { in: memberIds }, companyId: access.company.id },
      });

      if (valid !== memberIds.length) {
        return NextResponse.json({ error: "One or more members not found" }, { status: 400 });
      }
    }

    const uniqueIds = [...new Set([...memberIds, ...(newLeadId ? [newLeadId] : [])])];
    const currentIds = existing.memberships.map((membership) => membership.teamMemberId);
    const toAdd = uniqueIds.filter((memberId: string) => !currentIds.includes(memberId));
    const toRemove = currentIds.filter((memberId) => !uniqueIds.includes(memberId));

    if (toAdd.length > 0) {
      await prisma.teamMembership.deleteMany({
        where: {
          team: { companyId: access.company.id },
          teamId: { not: id },
          teamMemberId: { in: toAdd },
        },
      });
    }

    if (toRemove.length > 0) {
      await prisma.teamMembership.deleteMany({
        where: { teamId: id, teamMemberId: { in: toRemove } },
      });
    }

    if (toAdd.length > 0) {
      await prisma.teamMembership.createMany({
        data: toAdd.map((memberId: string) => ({ teamId: id, teamMemberId: memberId })),
      });
    }
  }

  const nextKind = [TEAM_KIND.SALES, TEAM_KIND.LEAD_GEN, TEAM_KIND.REPS, TEAM_KIND.SUPPORT, TEAM_KIND.OPERATIONS].includes(kind)
    ? kind
    : existing.kind;

  const updated = await prisma.team.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(kind !== undefined && { kind: nextKind }),
      ...(description !== undefined && { description: description.trim() || null }),
      ...(color !== undefined && { color }),
      ...(teamLeadId !== undefined && { teamLeadId: teamLeadId || null }),
    },
    include: {
      teamLead: { select: { id: true, name: true, email: true, role: true } },
      memberships: { select: { teamMemberId: true } },
    },
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    kind: updated.kind,
    description: updated.description ?? "",
    color: updated.color,
    teamLeadId: updated.teamLeadId ?? null,
    teamLead: updated.teamLead ?? null,
    memberIds: updated.memberships.map((membership) => membership.teamMemberId),
  });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canManageWorkspace(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const team = await prisma.team.findFirst({
    where: { id, companyId: access.company.id },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  if (team.teamLeadId) {
    const otherTeams = await prisma.team.count({
      where: { companyId: access.company.id, teamLeadId: team.teamLeadId, id: { not: id } },
    });

    if (otherTeams === 0) {
      await prisma.teamMember.updateMany({
        where: { id: team.teamLeadId, role: MEMBER_ROLE.SALES_LEAD },
        data: { role: MEMBER_ROLE.SALES_REP },
      });
    }
  }

  await prisma.team.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
