import { prisma } from "@/lib/prisma";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  plan: string;
  status: "active" | "inactive";
  leads: number;
  usedLeads: number;
  joinedAt: string;
  lastActive: string;
};

export type AdminLead = {
  id: string;
  userId: string;
  userName: string;
  company: string;
  leadName: string;
  email: string;
  score: "Hot" | "Warm" | "Cold" | "Pending";
  industry: string;
  createdAt: string;
};

export type AdminSupportSignal = {
  id: string;
  company: string;
  owner: string;
  plan: string;
  reason: string;
  priority: "high" | "medium" | "low";
};

export async function getAdminUsers(): Promise<AdminUser[]> {
  const companies = await prisma.company.findMany({
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
  });

  return companies.map((company) => {
    const usedLeads = company.leadForm.reduce((sum, form) => sum + form._count.submissions, 0);
    const maxLeads = company.subscription?.plan?.maxLeads ?? usedLeads;
    const lastActivity = [
      company.updatedAt,
      ...company.leadForm.map((form) => form.updatedAt),
      ...company.teamMembers.map((member) => member.updatedAt),
    ].sort((a, b) => b.getTime() - a.getTime())[0];

    return {
      id: company.id,
      name: company.user.name ?? company.name,
      email: company.user.email ?? company.email,
      company: company.name,
      industry: company.industry,
      plan: company.subscription?.plan?.name?.toLowerCase() ?? "trial",
      status: company.subscription?.status === "cancelled" ? "inactive" : "active",
      leads: maxLeads,
      usedLeads,
      joinedAt: company.createdAt.toLocaleDateString(),
      lastActive: lastActivity.toLocaleDateString(),
    };
  });
}

export async function getAdminLeads(limit?: number): Promise<AdminLead[]> {
  const leads = await prisma.formSubmission.findMany({
    include: {
      form: {
        include: {
          company: {
            include: { user: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });

  return leads.map((lead) => {
    const payload = lead.data as Record<string, string>;
    const name =
      Object.entries(payload).find(([key]) => key.toLowerCase().includes("name"))?.[1] ?? "Unknown";
    const email =
      Object.entries(payload).find(([key]) => key.toLowerCase().includes("email"))?.[1] ?? "Unknown";

    return {
      id: lead.id,
      userId: lead.form?.company.id ?? "",
      userName: lead.form?.company.user.name ?? lead.form?.company.name ?? "Unknown",
      company: lead.form?.company.name ?? "Unknown",
      leadName: String(name),
      email: String(email),
      score:
        lead.rank === "hot" ? "Hot" : lead.rank === "warm" ? "Warm" : lead.rank === "cold" ? "Cold" : "Pending",
      industry: lead.form?.company.industry ?? "Unknown",
      createdAt: lead.createdAt.toLocaleString(),
    };
  });
}

export async function getAdminStats() {
  const [users, leads, subscriptions] = await Promise.all([
    getAdminUsers(),
    getAdminLeads(),
    prisma.subscription.findMany({
      include: { plan: true },
      where: { status: { not: "cancelled" } },
    }),
  ]);

  const mrr = subscriptions.reduce((sum, subscription) => sum + (subscription.plan.priceMonthly ?? 0), 0);

  return {
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.status === "active").length,
    totalLeads: leads.length,
    hotLeads: leads.filter((lead) => lead.score === "Hot").length,
    mrr,
    proUsers: users.filter((user) => user.plan === "pro").length,
    businessUsers: users.filter((user) => user.plan === "business").length,
    freeUsers: users.filter((user) => user.plan === "free" || user.plan === "trial").length,
  };
}

export async function getAdminSupportSignals(): Promise<AdminSupportSignal[]> {
  const companies = await prisma.company.findMany({
    include: {
      user: true,
      subscription: { include: { plan: true } },
      leadForm: {
        include: {
          _count: { select: { submissions: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const now = new Date();

  return companies
    .map((company) => {
      const usedLeads = company.leadForm.reduce((sum, form) => sum + form._count.submissions, 0);
      const limit = company.subscription?.plan?.maxLeads ?? 1500;
      const usagePct = limit > 0 ? Math.round((usedLeads / limit) * 100) : 0;
      const daysLeftInTrial = company.subscription?.trialEnd
        ? Math.ceil((company.subscription.trialEnd.getTime() - now.getTime()) / 86400000)
        : null;

      if (company.subscription?.status === "trial" && daysLeftInTrial !== null && daysLeftInTrial <= 2) {
        return {
          id: `${company.id}-trial`,
          company: company.name,
          owner: company.user.name ?? company.user.email ?? company.email,
          plan: company.subscription.plan?.name ?? "Trial",
          reason: `Trial ends in ${Math.max(0, daysLeftInTrial)} day(s)`,
          priority: "high" as const,
        };
      }

      if (usagePct >= 90) {
        return {
          id: `${company.id}-usage`,
          company: company.name,
          owner: company.user.name ?? company.user.email ?? company.email,
          plan: company.subscription?.plan?.name ?? "Trial",
          reason: `Using ${usagePct}% of monthly lead allowance`,
          priority: "medium" as const,
        };
      }

      if (company.subscription?.status === "past_due" || company.subscription?.status === "expired") {
        return {
          id: `${company.id}-billing`,
          company: company.name,
          owner: company.user.name ?? company.user.email ?? company.email,
          plan: company.subscription.plan?.name ?? "Trial",
          reason: `Billing status is ${company.subscription.status}`,
          priority: "high" as const,
        };
      }

      return {
        id: `${company.id}-checkin`,
        company: company.name,
        owner: company.user.name ?? company.user.email ?? company.email,
        plan: company.subscription?.plan?.name ?? "Trial",
        reason: "Low-risk account, monitor for growth and support questions",
        priority: "low" as const,
      };
    })
    .slice(0, 8);
}
