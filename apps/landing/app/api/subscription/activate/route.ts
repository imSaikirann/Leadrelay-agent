// app/api/subscription/activate/route.ts
// Call this from your Razorpay webhook or after verifying payment on frontend.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { addMonths } from "date-fns";
import { authOptions } from "../../auth/[...nextauth]/route";

// POST body: { gatewayOrderId, gatewayPaymentId, amount }
export async function POST(req: Request) {
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
    include: { plan: true },
  });
  if (!sub)
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

  const { gatewayOrderId, gatewayPaymentId, amount } = await req.json();

  const now = new Date();
  const periodEnd = addMonths(now, 1);

  // Record payment + activate in a transaction
  const [payment, updatedSub] = await prisma.$transaction([
    prisma.payment.create({
      data: {
        subscriptionId: sub.id,
        amount: amount ?? sub.plan.priceMonthly,
        currency: "INR",
        status: "success",
        gateway: "razorpay",
        gatewayOrderId: gatewayOrderId ?? null,
        gatewayPaymentId: gatewayPaymentId ?? null,
        paidAt: now,
      },
    }),
    prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    }),
  ]);

  return NextResponse.json({ success: true, payment, subscription: updatedSub });
}