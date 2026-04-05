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
  const {
    name,
    dodoPlanId,
    priceMonthly,
    trialDays,
    maxLeads,
    maxMembers,
    features,
    isActive,
  } = body;

  const updated = await prisma.plan.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(dodoPlanId !== undefined && { dodoPlanId: dodoPlanId?.trim() || null }),
      ...(priceMonthly !== undefined && { priceMonthly }),
      ...(trialDays !== undefined && { trialDays }),
      ...(maxLeads !== undefined && { maxLeads }),
      ...(maxMembers !== undefined && { maxMembers }),
      ...(features !== undefined && { features }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await requireSuperAdminAccess();
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.plan.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
