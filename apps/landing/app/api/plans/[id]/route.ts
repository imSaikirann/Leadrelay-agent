// app/api/plans/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

async function requireSuperadmin(email: string) {
  return prisma.teamMember.findFirst({
    where: { email, role: "superadmin" },
  });
}

// ─── PATCH ─────────────────────────────────────────────
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ FIX
) {
  const { id } = await params; // ✅ FIX

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await requireSuperadmin(session.user.email))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const {
    name,
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
  const { id } = await params; 

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await requireSuperadmin(session.user.email))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.plan.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}