import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function generatePassword(name: string): string {
  const clean = name.split(" ")[0].toLowerCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const symbols = ["!", "@", "#", "$"];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  return `${clean}${symbol}${suffix}`;
}

async function getCompany(userId: string) {
  return prisma.company.findUnique({ where: { userId } });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = await getCompany(session.user.id);
  if (!company) return NextResponse.json({ error: "No company found" }, { status: 404 });

  const members = await prisma.teamMember.findMany({
    where: { companyId: company.id },
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
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = await getCompany(session.user.id);
  if (!company) return NextResponse.json({ error: "No company found" }, { status: 404 });

  const { name, email, role, seniority, specialty } = await req.json();
  if (!name || !email) return NextResponse.json({ error: "Name and email required" }, { status: 400 });

  // Generate & hash password
  const plainPassword = generatePassword(name);
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const member = await prisma.teamMember.create({
      data: {
        companyId: company.id,
        name, email, role,
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

    // Return plain password ONCE so admin can share it
    return NextResponse.json({ ...member, plainPassword });
  } catch {
    return NextResponse.json({ error: "Email already exists in team" }, { status: 409 });
  }
}



