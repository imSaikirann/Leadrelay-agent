"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Building2,
  CreditCard,
  Headset,
  ShieldCheck,
  Users,
} from "lucide-react";
import LeadCard from "@/components/dashboard/leads/LeadCard";
import { useAppStore } from "@/store/useAppStore";
import { ALL_WORKSPACES_ID, FOUNDER_WORKSPACE_ID } from "@/lib/workspace";

type DashboardData = {
  stats: {
    total: number;
    hot: number;
    warm: number;
    cold: number;
    conversionRate: number;
  };
  recentLeads: any[];
};

type SubscriptionData = {
  status: string;
  trialEnd?: string;
  currentPeriodEnd?: string;
  daysLeftInTrial?: number | null;
  plan?: {
    name: string;
    priceMonthly: number;
    trialDays: number;
    maxLeads?: number | null;
    maxMembers?: number | null;
  };
};

type TeamMember = {
  id: string;
  role: string;
  status: string;
};

type Team = {
  id: string;
  name: string;
  kind: string;
  memberIds: string[];
};

const workspaceGroups = [
  {
    label: "Sales team",
    description: "Qualify, assign, and close inbound leads quickly.",
    kinds: ["sales", "reps"],
  },
  {
    label: "Marketing team",
    description: "Own forms, campaigns, and lead source quality.",
    kinds: ["lead_gen", "marketing"],
  },
  {
    label: "Support and ops",
    description: "Handle escalations, follow-up, and internal workflows.",
    kinds: ["support", "ops", "operations"],
  },
];

export default function DashboardPage() {
  const activeWorkspace = useAppStore((s) => s.activeWorkspace);
  const [data, setData] = useState<DashboardData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const workspaceQuery =
          activeWorkspace === ALL_WORKSPACES_ID || activeWorkspace === FOUNDER_WORKSPACE_ID
            ? ""
            : `?workspaceId=${encodeURIComponent(activeWorkspace)}`;

        const [dashboardRes, subscriptionRes, membersRes, teamsRes] = await Promise.all([
          fetch(`/api/dashboard${workspaceQuery}`),
          fetch("/api/subscription"),
          fetch("/api/team"),
          fetch("/api/teams"),
        ]);

        const dashboardJson = await dashboardRes.json();
        if (!dashboardRes.ok) {
          throw new Error(dashboardJson.error || "Failed to load dashboard");
        }

        const subscriptionJson = subscriptionRes.ok ? await subscriptionRes.json() : null;
        const membersJson = membersRes.ok ? await membersRes.json() : [];
        const teamsJson = teamsRes.ok ? await teamsRes.json() : [];

        if (!active) return;

        setData(dashboardJson);
        setSubscription(subscriptionJson);
        setMembers(Array.isArray(membersJson) ? membersJson : []);
        setTeams(Array.isArray(teamsJson) ? teamsJson : []);
      } catch (err: any) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [activeWorkspace]);

  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-8">
        <p className="text-sm font-mono text-[#9B8E7E] dark:text-[#A99C8B]">Loading workspace dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 py-8 sm:px-8">
        <p className="text-sm font-mono text-red-500">{error || "Unable to load dashboard"}</p>
      </div>
    );
  }

  const stats = [
    { label: "Total leads", value: data.stats.total, color: "text-[#1A1714]" },
    { label: "Hot leads", value: data.stats.hot, color: "text-[#D4622A]" },
    { label: "Warm leads", value: data.stats.warm, color: "text-amber-600" },
    { label: "Cold leads", value: data.stats.cold, color: "text-blue-600" },
    { label: "Lead quality", value: `${data.stats.conversionRate}%`, color: "text-green-600" },
  ];

  const currentPlan = subscription?.plan?.name ?? "Trial";
  const maxLeads = subscription?.plan?.maxLeads ?? 1500;
  const usedLeads = data.stats.total;
  const usagePct = Math.min(100, maxLeads > 0 ? Math.round((usedLeads / maxLeads) * 100) : 0);
  const activeMembers = members.filter((member) => member.status === "active").length;
  const adminMembers = members.filter((member) => member.role === "admin" || member.role === "sales_lead").length;
  const groupedTeams = workspaceGroups.map((group) => ({
    ...group,
    count: teams.filter((team) => group.kinds.includes(team.kind)).length,
  }));
  const selectedWorkspaceName =
    activeWorkspace === "all"
      ? "All workspaces"
      : activeWorkspace === "founder"
      ? "Founder view"
      : teams.find((team) => team.id === activeWorkspace)?.name ?? "Selected workspace";

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-8 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <section className="overflow-hidden rounded-[28px] border border-[#E8E2D9] bg-[linear-gradient(135deg,#1d1915_0%,#342922_48%,#d4622a_120%)] p-6 text-white shadow-[0_28px_80px_-52px_rgba(26,23,20,0.9)] sm:p-8">
          <p className="text-[11px] font-mono uppercase tracking-[0.26em] text-white/65">Founder dashboard</p>
          <p className="mt-3 inline-flex w-fit rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-white/75">
            {selectedWorkspaceName}
          </p>
          <h1
            className="mt-4 text-[clamp(1.9rem,5vw,3.2rem)] leading-[1.02]"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Run every workspace from one calm control center.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
            See lead volume, team activity, billing, and support-ready context in one place for
            founders, admins, sales, and marketing leaders.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/60">Workspaces</p>
              <p className="mt-2 text-3xl font-mono">{Math.max(1, teams.length || 1)}</p>
              <p className="mt-1 text-xs text-white/70">Sales, marketing, ops, and support access</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/60">People</p>
              <p className="mt-2 text-3xl font-mono">{members.length || 1}</p>
              <p className="mt-1 text-xs text-white/70">{activeMembers} active now across the workspace</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/60">Support</p>
              <p className="mt-2 text-3xl font-mono">24/7</p>
              <p className="mt-1 text-xs text-white/70">Use the help block below for common questions</p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#E8E2D9] bg-white p-6 shadow-[0_28px_80px_-60px_rgba(26,23,20,0.55)] dark:border-white/10 dark:bg-[#171717] dark:shadow-[0_28px_80px_-60px_rgba(0,0,0,0.8)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E] dark:text-[#A99C8B]">Plan and billing</p>
              <h2
                className="mt-2 text-[1.8rem] leading-none text-[#1A1714] dark:text-[#F5F1EB]"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                {currentPlan}
              </h2>
            </div>
            <span className="rounded-full border border-[#E8E2D9] bg-[#F7F1E9] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-[#7D7264] dark:border-white/10 dark:bg-[#222222] dark:text-[#D4C7B8]">
              {subscription?.status ?? "trial"}
            </span>
          </div>

          <div className="mt-5 rounded-2xl bg-[#F8F3EC] p-4 dark:bg-[#22201d]">
            <div className="flex items-center justify-between text-xs font-mono text-[#7D7264] dark:text-[#C5B8A8]">
              <span>Leads this month</span>
              <span>
                {usedLeads} / {maxLeads}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8E2D9] dark:bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#D4622A,#F5C27A)]"
                style={{ width: `${Math.max(6, usagePct)}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-6 text-[#6E6253] dark:text-[#B8ADA0]">
              Paid workspaces include up to 1500 leads per month. Additional workspaces can be
              added for a monthly amount when you need more than one brand or team space.
            </p>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[#6E6253] dark:text-[#B8ADA0]">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-4 w-4 text-[#D4622A]" />
              <p>
                Free trial runs for <span className="font-medium text-[#1A1714] dark:text-[#F5F1EB]">7 days</span> with
                all core features included.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-4 w-4 text-[#D4622A]" />
              <p>
                Need more than one workspace? Upgrade your billing plan to add them monthly without
                leaving this dashboard.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/profile"
              className="rounded-xl bg-[#1A1714] px-4 py-2.5 text-xs font-mono text-[#FAF9F6] transition-colors hover:bg-[#2C2825] dark:bg-[#F5F1EB] dark:text-[#111111] dark:hover:bg-white"
            >
              Open billing
            </Link>
            <Link
              href="/dashboard/settings"
              className="rounded-xl border border-[#E8E2D9] bg-[#FAF9F6] px-4 py-2.5 text-xs font-mono text-[#6E6253] transition-colors hover:border-[#C4B9A8] dark:border-white/10 dark:bg-[#111111] dark:text-[#D4C7B8] dark:hover:border-white/20"
            >
              Open settings
            </Link>
          </div>
        </section>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#E8E2D9] bg-white px-4 py-4 dark:border-white/10 dark:bg-[#171717]">
            <p className="text-xs font-mono text-[#9B8E7E] dark:text-[#A99C8B]">{stat.label}</p>
            <p className={`mt-2 text-3xl font-mono font-medium ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <section className="rounded-[26px] border border-[#E8E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#171717]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E] dark:text-[#A99C8B]">Workplace access</p>
              <h2
                className="mt-2 text-[1.8rem] text-[#1A1714] dark:text-[#F5F1EB]"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                Founder access by team
              </h2>
            </div>
            <Link href="/dashboard/team" className="text-xs font-mono text-[#D4622A] hover:underline">
              Manage teams
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {groupedTeams.map((group) => (
              <div key={group.label} className="rounded-2xl border border-[#EFE7DD] bg-[#FBF8F4] p-4 dark:border-white/10 dark:bg-[#1F1F1F]">
                <p className="text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">{group.label}</p>
                <p className="mt-2 text-xs leading-6 text-[#6E6253] dark:text-[#B8ADA0]">{group.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full border border-[#E8E2D9] bg-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[#7D7264] dark:border-white/10 dark:bg-[#171717] dark:text-[#D4C7B8]">
                    {group.count} configured
                  </span>
                  <span className="text-[10px] font-mono text-[#C4B9A8] dark:text-[#8E8377]">one dashboard</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#E8E2D9] p-4 dark:border-white/10 dark:bg-[#1A1A1A]">
              <Users className="h-4 w-4 text-[#D4622A]" />
              <p className="mt-3 text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">Team members</p>
              <p className="mt-1 text-2xl font-mono text-[#1A1714] dark:text-[#F5F1EB]">{members.length}</p>
            </div>
            <div className="rounded-2xl border border-[#E8E2D9] p-4 dark:border-white/10 dark:bg-[#1A1A1A]">
              <ShieldCheck className="h-4 w-4 text-[#D4622A]" />
              <p className="mt-3 text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">Admins and leads</p>
              <p className="mt-1 text-2xl font-mono text-[#1A1714] dark:text-[#F5F1EB]">{adminMembers}</p>
            </div>
            <div className="rounded-2xl border border-[#E8E2D9] p-4 dark:border-white/10 dark:bg-[#1A1A1A]">
              <BarChart3 className="h-4 w-4 text-[#D4622A]" />
              <p className="mt-3 text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">Live workspaces</p>
              <p className="mt-1 text-2xl font-mono text-[#1A1714] dark:text-[#F5F1EB]">{Math.max(1, teams.length || 1)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[26px] border border-[#E8E2D9] bg-white p-5 dark:border-white/10 dark:bg-[#171717]">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E] dark:text-[#A99C8B]">Support questions</p>
          <h2
            className="mt-2 text-[1.8rem] text-[#1A1714] dark:text-[#F5F1EB]"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Quick help for common asks
          </h2>

          <div className="mt-5 space-y-3">
            {[
              "How do I add a sales team and a marketing team under one founder dashboard?",
              "What happens when I need more than one workspace?",
              "How many leads are included in the paid plan each month?",
              "Does the free trial unlock all features before billing starts?",
            ].map((question) => (
              <div key={question} className="rounded-2xl border border-[#EFE7DD] bg-[#FBF8F4] px-4 py-3 dark:border-white/10 dark:bg-[#1F1F1F]">
                <div className="flex items-start gap-3">
                  <Headset className="mt-0.5 h-4 w-4 text-[#D4622A]" />
                  <p className="text-sm leading-6 text-[#1A1714] dark:text-[#F5F1EB]">{question}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FFF8F2] p-4 dark:border-white/10 dark:bg-[#221b16]">
            <p className="text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">Default answer</p>
            <p className="mt-2 text-xs leading-6 text-[#6E6253] dark:text-[#B8ADA0]">
              Yes. Your 7-day trial includes the full workspace flow. Paid plans support 1500 leads
              each month, and extra workspaces are added as a monthly upgrade.
            </p>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E] dark:text-[#A99C8B]">Lead queue</p>
            <h2
              className="mt-2 text-[1.8rem] text-[#1A1714] dark:text-[#F5F1EB]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Recent leads
            </h2>
          </div>
          <Link href="/dashboard/leads" className="text-xs font-mono text-[#D4622A] hover:underline">
            View all
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {data.recentLeads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E8E2D9] bg-white py-10 text-center text-sm font-mono text-[#9B8E7E] dark:border-white/10 dark:bg-[#171717] dark:text-[#A99C8B]">
              No leads yet
            </div>
          ) : (
            data.recentLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </div>
      </section>
    </div>
  );
}
