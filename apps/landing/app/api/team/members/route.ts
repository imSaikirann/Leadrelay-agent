// app/api/team/members/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.isMember)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { company: true },
  });
  if (!user?.company) return NextResponse.json({ members: [] });

  const members = await prisma.teamMember.findMany({
    where: { companyId: user.company.id, status: "active" },
    select: { id: true, name: true, role: true, activeLeads: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ members });
}