import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

// ── helper ─────────────────────────────────────────────
async function getCompanyId(email: string): Promise<string | null> {
  const c = await prisma.company.findFirst({
    where: { user: { email } },
    select: { id: true },
  });
  return c?.id ?? null;
}

// ── PATCH /api/teams/[id] ─────────────────────────────
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIX
) {
  const { id } = await context.params; // ✅ FIX

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = await getCompanyId(session.user.email);
  if (!companyId) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const existing = await prisma.team.findFirst({
    where: { id, companyId }, // ✅ FIX
    include: { memberships: { select: { teamMemberId: true } } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const { name, description, color, teamLeadId, memberIds } = await req.json();

  // ── Role management ──
  const prevLeadId = existing.teamLeadId;
  const newLeadId = teamLeadId !== undefined ? teamLeadId : prevLeadId;

  if (newLeadId !== prevLeadId) {
    if (prevLeadId) {
      const otherTeams = await prisma.team.count({
        where: { teamLeadId: prevLeadId, id: { not: id } }, // ✅ FIX
      });

      if (otherTeams === 0) {
        await prisma.teamMember.updateMany({
          where: { id: prevLeadId, role: "sales_lead" },
          data: { role: "sales_rep" },
        });
      }
    }

    if (newLeadId) {
      const newLead = await prisma.teamMember.findFirst({
        where: { id: newLeadId, companyId },
      });

      if (!newLead) {
        return NextResponse.json({ error: "New team lead not found" }, { status: 400 });
      }

      if (newLead.role === "sales_rep") {
        await prisma.teamMember.update({
          where: { id: newLeadId },
          data: { role: "sales_lead" },
        });
      }
    }
  }

  // ── Membership sync ──
  if (memberIds !== undefined) {
    if (memberIds.length > 0) {
      const valid = await prisma.teamMember.count({
        where: { id: { in: memberIds }, companyId },
      });

      if (valid !== memberIds.length) {
        return NextResponse.json({ error: "One or more members not found" }, { status: 400 });
      }
    }

    const uniqueIds: string[] = [
      ...new Set([...memberIds, ...(newLeadId ? [newLeadId] : [])]),
    ];

    const currentIds = existing.memberships.map((m) => m.teamMemberId);

    const toAdd = uniqueIds.filter((id) => !currentIds.includes(id));
    const toRemove = currentIds.filter((id) => !uniqueIds.includes(id));

    if (toRemove.length > 0) {
      await prisma.teamMembership.deleteMany({
        where: { teamId: id, teamMemberId: { in: toRemove } },
      });
    }

    if (toAdd.length > 0) {
      await prisma.teamMembership.createMany({
        data: toAdd.map((mid) => ({ teamId: id, teamMemberId: mid })),
      });
    }
  }

  const updated = await prisma.team.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
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
    description: updated.description ?? "",
    color: updated.color,
    teamLeadId: updated.teamLeadId ?? null,
    teamLead: updated.teamLead ?? null,
    memberIds: updated.memberships.map((m) => m.teamMemberId),
  });
}

// ── DELETE /api/teams/[id] ─────────────────────────────
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ FIX
) {
  const { id } = await context.params; // ✅ FIX

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companyId = await getCompanyId(session.user.email);
  if (!companyId) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const team = await prisma.team.findFirst({
    where: { id, companyId },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  if (team.teamLeadId) {
    const otherTeams = await prisma.team.count({
      where: { teamLeadId: team.teamLeadId, id: { not: id } },
    });

    if (otherTeams === 0) {
      await prisma.teamMember.updateMany({
        where: { id: team.teamLeadId, role: "sales_lead" },
        data: { role: "sales_rep" },
      });
    }
  }

  await prisma.team.delete({ where: { id } });

  return NextResponse.json({ success: true });
}