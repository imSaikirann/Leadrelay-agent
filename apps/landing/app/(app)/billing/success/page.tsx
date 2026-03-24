// app/billing/success/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import BillingSuccessClient from "./Billingsuccessclient";

type Props = {
  searchParams: Promise<{
    subscription_id?: string;
    status?: string;
    email: string;
  }>;
};

export default async function BillingSuccessPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const { subscription_id, status, email } = await searchParams;


  if (subscription_id && status === "active") {
    const company = await prisma.company.findFirst({
      where: { user: { email: session.user.email } },
      select: { id: true, subscription: { select: { id: true, planId: true } } },
    });

    if (company?.subscription) {
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await prisma.subscription.update({
        where: { companyId: company.id },
        data: {
          status: "active",
          dodoSubscriptionId: subscription_id,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      });

      // Log payment record (amount will be corrected by webhook)
      const plan = await prisma.plan.findUnique({
        where: { id: company.subscription.planId },
        select: { priceMonthly: true },
      });

      await prisma.payment.create({
        data: {
          subscriptionId: company.subscription.id,
          amount: plan?.priceMonthly ?? 0,
          currency: "INR",
          status: "success",
          gateway: "dodo",
          gatewayOrderId: subscription_id,
          paidAt: now,
        },
      });
    }
  }

  return (
    <BillingSuccessClient
      subscriptionId={subscription_id ?? null}
      status={status ?? null}
      email={email ?? null}
    />
  );
}