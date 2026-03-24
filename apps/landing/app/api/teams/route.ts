// app/api/teams/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// ── Helpers ────────────────────────────────────────────────────────────────

async function getCompanyId(email: string): Promise<string | null> {
  const company = await prisma.company.findFirst({
    where: { user: { email } },
    select: { id: true },
  });
  return company?.id ?? null;
}

// ── GET /api/teams ─────────────────────────────────────────────────────────
// Returns all teams for the caller's workspace.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const companyId = await getCompanyId(session.user.email);
  if (!companyId)
    return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const teams = await prisma.team.findMany({
    where: { companyId },
    include: {
      teamLead: {
        select: { id: true, name: true, email: true, role: true, status: true },
      },
      memberships: {
        include: {
          member: {
            select: {
              id: true, name: true, email: true, role: true, seniority: true,
              status: true, activeLeads: true, leads: true, converted: true,
              avgResponseTime: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    teams.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description ?? "",
      color: t.color,
      teamLeadId: t.teamLeadId ?? null,
      teamLead: t.teamLead ?? null,
      memberIds: t.memberships.map((m) => m.teamMemberId),
      members: t.memberships.map((m) => m.member),
      createdAt: t.createdAt,
    }))
  );
}

// ── POST /api/teams ────────────────────────────────────────────────────────
// Body: { name, description?, color?, teamLeadId?, memberIds: string[] }
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const companyId = await getCompanyId(session.user.email);
  if (!companyId)
    return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const { name, description, color, teamLeadId, memberIds = [] } = await req.json();

  if (!name?.trim())
    return NextResponse.json({ error: "Team name is required" }, { status: 400 });

  // Validate all memberIds belong to this company
  if (memberIds.length > 0) {
    const valid = await prisma.teamMember.count({
      where: { id: { in: memberIds }, companyId },
    });
    if (valid !== memberIds.length)
      return NextResponse.json({ error: "One or more members not found" }, { status: 400 });
  }

  // Validate + promote teamLead
  if (teamLeadId) {
    const lead = await prisma.teamMember.findFirst({
      where: { id: teamLeadId, companyId },
    });
    if (!lead)
      return NextResponse.json({ error: "Team lead not found" }, { status: 400 });

    if (lead.role === "sales_rep") {
      await prisma.teamMember.update({
        where: { id: teamLeadId },
        data: { role: "sales_lead" },
      });
    }
  }

  // Always include teamLead in memberships
  const uniqueIds: string[] = [...new Set([...memberIds, ...(teamLeadId ? [teamLeadId] : [])])];

  const team = await prisma.team.create({
    data: {
      companyId,
      name: name.trim(),
      description: description?.trim() ?? null,
      color: color ?? "#D4622A",
      teamLeadId: teamLeadId ?? null,
      memberships: {
        create: uniqueIds.map((mid) => ({ teamMemberId: mid })),
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
      description: team.description ?? "",
      color: team.color,
      teamLeadId: team.teamLeadId ?? null,
      teamLead: team.teamLead ?? null,
      memberIds: team.memberships.map((m) => m.teamMemberId),
      createdAt: team.createdAt,
    },
    { status: 201 }
  );
}