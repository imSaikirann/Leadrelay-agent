import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdminAccess } from "@/lib/admin-auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await requireSuperAdminAccess();
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { planId, status } = body as { planId?: string; status?: string };

  const company = await prisma.company.findUnique({
    where: { id },
    include: { subscription: true },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  if (!company.subscription) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  const data: { planId?: string; status?: string; currentPeriodStart?: Date } = {};

  if (planId) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    data.planId = planId;
  }

  if (status) {
    data.status = status;
    if (status === "active" && !company.subscription.currentPeriodStart) {
      data.currentPeriodStart = new Date();
    }
  }

  const updated = await prisma.subscription.update({
    where: { id: company.subscription.id },
    data,
    include: { plan: true },
  });

  return NextResponse.json({
    id: company.id,
    subscription: {
      id: updated.id,
      status: updated.status,
      planId: updated.planId,
      planName: updated.plan.name,
      trialEnd: updated.trialEnd.toISOString(),
      currentPeriodEnd: updated.currentPeriodEnd?.toISOString() ?? null,
    },
  });
}
