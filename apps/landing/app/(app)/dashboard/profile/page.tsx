// app/(dashboard)/settings/company/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CompanyProfileForm from "./CompanyProfileForm";

export default async function CompanyProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
    include: {
      subscription: {
        include: {
          plan: true,
          payments: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!company) redirect("/onboarding");

  // Compute trial days left server-side
  const now = new Date();
  const sub = company.subscription;
  const daysLeftInTrial =
    sub?.status === "trial" && sub.trialEnd
      ? Math.max(0, Math.ceil((new Date(sub.trialEnd).getTime() - now.getTime()) / 86400000))
      : null;

  return (
    <CompanyProfileForm
      company={{
        id: company.id,
        name: company.name,
        email: company.email,
        website: company.website,
        industry: company.industry,
        size: company.size,
      }}
      subscription={
        sub
          ? {
              status: sub.status,
              trialEnd: sub.trialEnd?.toISOString() ?? null,
              currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
              daysLeftInTrial,
              plan: sub.plan
                ? {
                    name: sub.plan.name,
                    priceMonthly: sub.plan.priceMonthly,
                    trialDays: sub.plan.trialDays,
                    features: sub.plan.features as string[],
                  }
                : null,
              lastPayment: sub.payments[0]
                ? {
                    amount: sub.payments[0].amount,
                    status: sub.payments[0].status,
                    paidAt: sub.payments[0].paidAt?.toISOString() ?? null,
                  }
                : null,
            }
          : null
      }
    />
  );
}