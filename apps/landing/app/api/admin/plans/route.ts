import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdminAccess } from "@/lib/admin-auth";

export async function GET() {
  const access = await requireSuperAdminAccess();
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const plans = await prisma.plan.findMany({
    orderBy: { priceMonthly: "asc" },
  });

  return NextResponse.json(
    plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      dodoPlanId: plan.dodoPlanId,
      priceMonthly: plan.priceMonthly,
      trialDays: plan.trialDays,
      maxLeads: plan.maxLeads,
      maxMembers: plan.maxMembers,
      isActive: plan.isActive,
      features: Array.isArray(plan.features) ? plan.features : [],
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
    }))
  );
}
