import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSuperAdminAccess } from "@/lib/admin-auth";

export async function GET() {
  const access = await requireSuperAdminAccess();
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    companies,
    plans,
    totalCompanies,
    totalMembers,
    totalTeams,
    totalForms,
    totalSubmissions,
    totalRankedSubmissions,
    subscriptions,
    payments,
  ] = await Promise.all([
    prisma.company.findMany({
      include: {
        user: true,
        subscription: { include: { plan: true } },
        leadForm: {
          include: {
            _count: { select: { submissions: true } },
          },
        },
        teamMembers: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plan.findMany({
      orderBy: { priceMonthly: "asc" },
    }),
    prisma.company.count(),
    prisma.teamMember.count(),
    prisma.team.count(),
    prisma.leadForm.count(),
    prisma.formSubmission.count(),
    prisma.formSubmission.count({
      where: { rankedAt: { not: null } },
    }),
    prisma.subscription.findMany({
      include: { plan: true },
    }),
    prisma.payment.findMany(),
  ]);

  let dbStats: {
    dataSize?: number;
    storageSize?: number;
    totalSize?: number;
    fsUsedSize?: number;
    fsTotalSize?: number;
  } | null = null;

  const configuredQuotaMb = Number(process.env.MONGO_STORAGE_QUOTA_MB ?? "512");
  const quotaBytes =
    Number.isFinite(configuredQuotaMb) && configuredQuotaMb > 0
      ? configuredQuotaMb * 1024 * 1024
      : 512 * 1024 * 1024;

  try {
    const stats = await prisma.$runCommandRaw({ dbStats: 1, scale: 1 });
    dbStats = (stats as unknown as NonNullable<typeof dbStats>) ?? null;
  } catch {
    dbStats = null;
  }

  const items = companies.map((company) => {
    const usedLeads = company.leadForm.reduce((sum, form) => sum + form._count.submissions, 0);
    const leadLimit = company.subscription?.plan?.maxLeads ?? 0;
    const usagePct = leadLimit > 0 ? Math.round((usedLeads / leadLimit) * 100) : 0;
    const lastActivity = [
      company.updatedAt,
      ...company.leadForm.map((form) => form.updatedAt),
      ...company.teamMembers.map((member) => member.updatedAt),
    ].sort((a, b) => b.getTime() - a.getTime())[0];

    return {
      id: company.id,
      company: company.name,
      ownerName: company.user.name ?? company.name,
      ownerEmail: company.user.email ?? company.email,
      industry: company.industry,
      website: company.website ?? "",
      members: company.teamMembers.length,
      forms: company.leadForm.length,
      usedLeads,
      leadLimit,
      usagePct,
      createdAt: company.createdAt.toISOString(),
      lastActive: lastActivity.toISOString(),
      subscription: company.subscription
        ? {
            id: company.subscription.id,
            status: company.subscription.status,
            trialEnd: company.subscription.trialEnd.toISOString(),
            currentPeriodEnd: company.subscription.currentPeriodEnd?.toISOString() ?? null,
            planId: company.subscription.planId,
            planName: company.subscription.plan?.name ?? "Unknown",
          }
        : null,
    };
  });

  return NextResponse.json({
    companies: items,
    plans: plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      priceMonthly: plan.priceMonthly,
      trialDays: plan.trialDays,
      maxLeads: plan.maxLeads,
      maxMembers: plan.maxMembers,
      isActive: plan.isActive,
      features: Array.isArray(plan.features) ? plan.features : [],
    })),
    metrics: {
      ai: {
        provider: "Groq",
        model: "llama-3.3-70b-versatile",
        configured: Boolean(process.env.GROQ_API_KEY),
        processedLeads: totalRankedSubmissions,
        trackingAvailable: false,
        note: "Historical token and cost usage were not stored before instrumentation.",
      },
      billing: {
        activeSubscriptions: subscriptions.filter((subscription) => subscription.status === "active").length,
        trialSubscriptions: subscriptions.filter((subscription) => subscription.status === "trial").length,
        pastDueSubscriptions: subscriptions.filter((subscription) => subscription.status === "past_due").length,
        monthlyRecurringRevenue: subscriptions
          .filter((subscription) => subscription.status === "active")
          .reduce((sum, subscription) => sum + (subscription.plan.priceMonthly ?? 0), 0),
        totalPaymentsReceived: payments
          .filter((payment) => payment.status === "paid")
          .reduce((sum, payment) => sum + payment.amount, 0),
        paidPaymentsCount: payments.filter((payment) => payment.status === "paid").length,
      },
      database: {
        companies: totalCompanies,
        teamMembers: totalMembers,
        teams: totalTeams,
        forms: totalForms,
        submissions: totalSubmissions,
        totalRecords: totalCompanies + totalMembers + totalTeams + totalForms + totalSubmissions,
        storageQuotaBytes: quotaBytes,
        storageUsedBytes:
          dbStats?.totalSize ??
          dbStats?.storageSize ??
          dbStats?.dataSize ??
          null,
        storageFreeBytes:
          typeof dbStats?.fsTotalSize === "number" && typeof dbStats?.fsUsedSize === "number"
            ? Math.max(0, dbStats.fsTotalSize - dbStats.fsUsedSize)
            : typeof (dbStats?.totalSize ?? dbStats?.storageSize ?? dbStats?.dataSize) === "number"
              ? Math.max(
                  0,
                  quotaBytes - Number(dbStats?.totalSize ?? dbStats?.storageSize ?? dbStats?.dataSize ?? 0)
                )
            : null,
        note:
          dbStats
            ? "Showing live Mongo database stats from dbStats with a 512 MB quota fallback."
            : "Database storage stats are not exposed by the current Mongo connection.",
      },
    },
  });
}
