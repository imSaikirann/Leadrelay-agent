// app/api/plans/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdminAccess } from "@/lib/admin-auth";

// Only superadmin can POST. Anyone authenticated can GET (to show pricing page).
export async function GET() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { priceMonthly: "asc" },
  });
  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const access = await requireSuperAdminAccess();
  if (!access)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, dodoPlanId, priceMonthly, trialDays, maxLeads, maxMembers, features } = await req.json();

  if (!name || priceMonthly === undefined)
    return NextResponse.json({ error: "name and priceMonthly are required" }, { status: 400 });

  const plan = await prisma.plan.create({
    data: {
      name,
      dodoPlanId: dodoPlanId?.trim() || null,
      priceMonthly,
      trialDays: trialDays ?? 7,
      maxLeads: maxLeads ?? null,
      maxMembers: maxMembers ?? null,
      features: features ?? [],
    },
  });

  return NextResponse.json(plan, { status: 201 });
}
