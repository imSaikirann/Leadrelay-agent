// app/api/plans/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// Only superadmin can POST. Anyone authenticated can GET (to show pricing page).
export async function GET() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { priceMonthly: "asc" },
  });
  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only superadmin TeamMember can create/modify plans
  const caller = await prisma.teamMember.findFirst({
    where: { email: session.user.email, role: "superadmin" },
  });
  if (!caller)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, priceMonthly, trialDays, maxLeads, maxMembers, features } = await req.json();

  if (!name || priceMonthly === undefined)
    return NextResponse.json({ error: "name and priceMonthly are required" }, { status: 400 });

  const plan = await prisma.plan.create({
    data: {
      name,
      priceMonthly,
      trialDays: trialDays ?? 7,
      maxLeads: maxLeads ?? null,
      maxMembers: maxMembers ?? null,
      features: features ?? [],
    },
  });

  return NextResponse.json(plan, { status: 201 });
}