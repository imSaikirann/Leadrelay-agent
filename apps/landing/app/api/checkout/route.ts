
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { dodo } from "@/lib/dodo";
import { compose } from "@/lib/compose";
import { withAuth } from "@/lib/middlewares/auth.middleware";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { withCompany } from "@/lib/middlewares/company.middleware";


const use = compose(withAuth, withRateLimit("authenticated"), withCompany);

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = await prisma.company.findFirst({
    where: { user: { email: session.user.email } },
    include: {
      subscription: { include: { plan: true } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!company)
    return NextResponse.json({ error: "Company not found" }, { status: 404 });

  if (company.subscription?.status === "active")
    return NextResponse.json({ error: "Already on an active plan" }, { status: 400 });

  // ── Get or create Dodo customer ──────────────────────────────────────────
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

  // ── Create hosted checkout session ────────────────────────────────────────
  // checkoutSessions.create → returns checkout_url (hosted Dodo checkout page)
  // Do NOT use dodo.subscriptions.create — that's direct API, no hosted page.
  const checkoutSession = await dodo.checkoutSessions.create({
    product_cart: [
      {
        product_id: "pdt_0NWgnI9j9j9beVwuX4qhY",
        quantity: 1,
      },
    ],
    customer: { customer_id: dodoCustomerId },
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
    metadata: {
      companyId: company.id,
    },
  });

  if (!checkoutSession.checkout_url)
    return NextResponse.json({ error: "Failed to get checkout URL" }, { status: 500 });

  // Store session_id temporarily (webhook will update with real subscription_id)
  if (company.subscription) {
    await prisma.subscription.update({
      where: { companyId: company.id },
      data: { dodoSubscriptionId: checkoutSession.session_id },
    });
  }

  return NextResponse.json({ url: checkoutSession.checkout_url });
}