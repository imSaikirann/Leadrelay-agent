import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canManageForms, MEMBER_ROLE, resolveAccess, TEAM_KIND } from "@/lib/access";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canManageForms(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = req.nextUrl.searchParams.get("workspaceId");

  const forms = await prisma.leadForm.findMany({
    where: {
      companyId: access.company.id,
      ...(workspaceId && workspaceId !== "all" && workspaceId !== "founder"
        ? { teamId: workspaceId }
        : {}),
      ...(access.role === MEMBER_ROLE.LEAD_GEN && access.member
        ? { createdByMemberId: access.member.id }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { submissions: true } },
      createdBy: { select: { id: true, name: true, email: true } },
      team: { select: { id: true, name: true, kind: true } },
    },
  });

  return NextResponse.json(forms);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canManageForms(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, fields, teamId } = await req.json();
  const normalizedName = name?.trim() || "Untitled Form";

  const slugBase = normalizedName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const existing = await prisma.leadForm.count({
    where: { companyId: access.company.id, slug: slugBase },
  });

  let resolvedTeamId: string | null = teamId ?? null;

  if (access.role === MEMBER_ROLE.LEAD_GEN && access.member) {
    const ownedLeadGenTeam = await prisma.team.findFirst({
      where: {
        companyId: access.company.id,
        kind: TEAM_KIND.LEAD_GEN,
        memberships: { some: { teamMemberId: access.member.id } },
      },
      select: { id: true },
    });

    resolvedTeamId = teamId ?? ownedLeadGenTeam?.id ?? null;
  } else if (teamId) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, companyId: access.company.id },
      select: { id: true },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 400 });
    }
  }

  const form = await prisma.leadForm.create({
    data: {
      companyId: access.company.id,
      name: normalizedName,
      slug: existing > 0 ? `${slugBase}-${Date.now()}` : slugBase,
      fields: fields ?? [],
      createdByMemberId: access.member?.id ?? null,
      teamId: resolvedTeamId,
    },
    include: {
      _count: { select: { submissions: true } },
      createdBy: { select: { id: true, name: true, email: true } },
      team: { select: { id: true, name: true, kind: true } },
    },
  });

  return NextResponse.json(form, { status: 201 });
}
