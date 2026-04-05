import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { dodo } from "@/lib/dodo";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = (await req.json().catch(() => ({}))) as { planId?: string };

  const company = await prisma.company.findFirst({
    where: { user: { email: session.user.email } },
    include: {
      subscription: { include: { plan: true } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const selectedPlanId = planId ?? company.subscription?.planId ?? null;
  if (!selectedPlanId) {
    return NextResponse.json({ error: "Please select a plan first" }, { status: 400 });
  }

  const selectedPlan = await prisma.plan.findFirst({
    where: { id: selectedPlanId, isActive: true },
  });

  if (!selectedPlan) {
    return NextResponse.json({ error: "Selected plan is not available" }, { status: 400 });
  }

  let dodoCustomerId = company.dodoCustomerId;

  if (!dodoCustomerId) {
    const customer = await dodo.customers.create({
      email: company.user.email!,
      name: company.user.name ?? company.name,
    });

    dodoCustomerId = customer.customer_id;

    await prisma.company.update({
      where: { id: company.id },
      data: { dodoCustomerId },
    });
  }

  const dodoProductId = selectedPlan.dodoPlanId;

  if (!dodoProductId) {
    return NextResponse.json(
      { error: "This plan is missing a Dodo product id. Ask the super admin to configure it." },
      { status: 400 }
    );
  }

  const checkoutSession = await dodo.checkoutSessions.create({
    product_cart: [
      {
        product_id: dodoProductId,
        quantity: 1,
      },
    ],
    customer: { customer_id: dodoCustomerId },
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
    metadata: {
      companyId: company.id,
      planId: selectedPlan.id,
    },
  });

  if (!checkoutSession.checkout_url) {
    return NextResponse.json({ error: "Failed to get checkout URL" }, { status: 500 });
  }

  if (company.subscription) {
    await prisma.subscription.update({
      where: { companyId: company.id },
      data: {
        dodoSubscriptionId: checkoutSession.session_id,
        planId: selectedPlan.id,
      },
    });
  }

  return NextResponse.json({ url: checkoutSession.checkout_url });
}
