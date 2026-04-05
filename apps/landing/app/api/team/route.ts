import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { canManageWorkspace, MEMBER_ROLE, resolveAccess } from "@/lib/access";

function generatePassword(name: string): string {
  const clean = name.split(" ")[0].toLowerCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const symbols = ["!", "@", "#", "$"];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  return `${clean}${symbol}${suffix}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);
  if (!access || !access.company || !canManageWorkspace(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await prisma.teamMember.findMany({
    where: { companyId: access.company.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true, name: true, email: true, role: true,
      seniority: true, specialty: true, status: true,
      leads: true, converted: true, activeLeads: true,
      avgResponseTime: true, createdAt: true,
      // ← never return password
    },
  });

  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);
  if (!access || !access.company || !canManageWorkspace(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, role, seniority, specialty } = await req.json();
  if (!name || !email) return NextResponse.json({ error: "Name and email required" }, { status: 400 });

  const subscription = await prisma.subscription.findUnique({
    where: { companyId: access.company.id },
    include: { plan: true },
  });

  if (subscription?.plan?.maxMembers) {
    const memberCount = await prisma.teamMember.count({
      where: { companyId: access.company.id },
    });

    if (memberCount >= subscription.plan.maxMembers) {
      return NextResponse.json(
        { error: `Your current plan allows only ${subscription.plan.maxMembers} team members.` },
        { status: 403 }
      );
    }
  }

  const normalizedRole =
    [MEMBER_ROLE.ADMIN, MEMBER_ROLE.SALES_LEAD, MEMBER_ROLE.LEAD_GEN, MEMBER_ROLE.SALES_REP].includes(role)
      ? role
      : MEMBER_ROLE.SALES_REP;

  const plainPassword = generatePassword(name);
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const member = await prisma.teamMember.create({
      data: {
        companyId: access.company.id,
        name,
        email: String(email).toLowerCase(),
        role: normalizedRole,
        seniority: seniority ?? "junior",
        specialty,
        password: hashedPassword,
      },
      select: {
        id: true, name: true, email: true, role: true,
        seniority: true, specialty: true, status: true,
        leads: true, converted: true, activeLeads: true,
        avgResponseTime: true,
      },
    });

    return NextResponse.json({ ...member, plainPassword });
  } catch {
    return NextResponse.json({ error: "Email already exists in team" }, { status: 409 });
  }
}



