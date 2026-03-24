// app/api/subscription/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

// GET — returns subscription + plan for the current company
// Used in billing page + middleware access checks
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = await prisma.company.findFirst({
    where: { user: { email: session.user.email } },
    select: { id: true },
  });
  if (!company)
    return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const sub = await prisma.subscription.findUnique({
    where: { companyId: company.id },
    include: {
      plan: true,
      payments: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!sub)
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });

  const now = new Date();

  // Auto-expire trial if past trialEnd and still on trial
  if (sub.status === "trial" && now > sub.trialEnd) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "expired" },
    });
    sub.status = "expired";
  }

  const daysLeftInTrial =
    sub.status === "trial"
      ? Math.max(0, Math.ceil((sub.trialEnd.getTime() - now.getTime()) / 86400000))
      : null;

  return NextResponse.json({
    id: sub.id,
    status: sub.status,
    plan: sub.plan,
    trialEnd: sub.trialEnd,
    daysLeftInTrial,
    currentPeriodEnd: sub.currentPeriodEnd,
    payments: sub.payments,
  });
}