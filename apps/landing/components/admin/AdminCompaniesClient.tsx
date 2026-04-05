"use client";

import { useEffect, useMemo, useState } from "react";

type AdminPlan = {
  id: string;
  name: string;
  priceMonthly: number;
  trialDays: number;
  maxLeads: number | null;
  maxMembers: number | null;
  isActive: boolean;
  features: string[];
};

type AdminCompany = {
  id: string;
  company: string;
  ownerName: string;
  ownerEmail: string;
  industry: string;
  website: string;
  members: number;
  forms: number;
  usedLeads: number;
  leadLimit: number;
  usagePct: number;
  createdAt: string;
  lastActive: string;
  subscription: {
    id: string;
    status: string;
    trialEnd: string;
    currentPeriodEnd: string | null;
    planId: string;
    planName: string;
  } | null;
};

type AdminMetrics = {
  ai: {
    provider: string;
    model: string;
    configured: boolean;
    processedLeads: number;
    trackingAvailable: boolean;
    note: string;
  };
  billing: {
    activeSubscriptions: number;
    trialSubscriptions: number;
    pastDueSubscriptions: number;
    monthlyRecurringRevenue: number;
    totalPaymentsReceived: number;
    paidPaymentsCount: number;
  };
  database: {
    companies: number;
    teamMembers: number;
    teams: number;
    forms: number;
    submissions: number;
    totalRecords: number;
    storageQuotaBytes: number | null;
    storageUsedBytes: number | null;
    storageFreeBytes: number | null;
    note: string;
  };
};

type Props = {
  mode: "users" | "billing" | "usage";
};

const STATUS_OPTIONS = ["trial", "active", "past_due", "expired", "cancelled"];

function formatBytes(value: number | null) {
  if (value == null || Number.isNaN(value)) return "Unavailable";

  if (value < 1024) return `${value} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let size = value;
  let unitIndex = -1;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatStorageLeft(value: number | null) {
  if (value == null || Number.isNaN(value)) return "Not exposed by Mongo";

  return formatBytes(value);
}

export default function AdminCompaniesClient({ mode }: Props) {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/companies")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(Array.isArray(data?.companies) ? data.companies : []);
        setPlans(Array.isArray(data?.plans) ? data.plans : []);
        setMetrics(data?.metrics ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return companies;

    return companies.filter((company) =>
      [company.company, company.ownerName, company.ownerEmail, company.industry]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [companies, search]);

  async function updateCompany(id: string, payload: { planId?: string; status?: string }) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update company");

      const updated = await res.json();
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === id
            ? {
                ...company,
                subscription: company.subscription
                  ? {
                      ...company.subscription,
                      ...updated.subscription,
                    }
                  : updated.subscription,
              }
            : company
        )
      );
    } finally {
      setSavingId(null);
    }
  }

  const title =
    mode === "users"
      ? "Customers"
      : mode === "billing"
      ? "Billing Control"
      : "Usage Monitor";

  const description =
    mode === "users"
      ? "Search accounts, inspect ownership, and change plan or subscription state."
      : mode === "billing"
      ? "Adjust plans and billing states for every customer from one place."
      : "Track lead usage and spot accounts close to their cap, plus platform AI and database load.";

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] leading-tight">{title}</h1>
          <p className="mt-1 text-sm text-[#666]">{description}</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company, owner, email..."
          className="w-full rounded-2xl border border-[#262626] bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none placeholder:text-[#555] lg:max-w-sm"
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#1e1e1e] bg-[#111] px-5 py-8 text-sm text-[#777]">Loading companies...</div>
      ) : (
        <>
          {metrics && (mode === "billing" || mode === "usage") && (
            <div className="mb-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#1e1e1e] bg-[#111] p-5">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#666]">AI usage</p>
                <h2 className="mt-2 text-xl text-white">{metrics.ai.provider}</h2>
                <p className="mt-1 text-xs font-mono text-[#D4622A]">{metrics.ai.model}</p>
                <div className="mt-4 space-y-2 text-sm text-[#aaa]">
                  <p>Status: <span className="text-white">{metrics.ai.configured ? "Connected" : "Missing API key"}</span></p>
                  <p>Processed leads: <span className="text-white">{metrics.ai.processedLeads}</span></p>
                  <p>Tracking: <span className="text-white">{metrics.ai.trackingAvailable ? "Available" : "Not instrumented"}</span></p>
                </div>
                <p className="mt-4 text-xs text-[#666]">{metrics.ai.note}</p>
              </div>

              <div className="rounded-2xl border border-[#1e1e1e] bg-[#111] p-5">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#666]">Billing</p>
                <h2 className="mt-2 text-xl text-white">Rs {metrics.billing.monthlyRecurringRevenue}</h2>
                <p className="mt-1 text-xs font-mono text-[#D4622A]">Current MRR</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#aaa]">
                  <p>Active: <span className="text-white">{metrics.billing.activeSubscriptions}</span></p>
                  <p>Trial: <span className="text-white">{metrics.billing.trialSubscriptions}</span></p>
                  <p>Past due: <span className="text-white">{metrics.billing.pastDueSubscriptions}</span></p>
                  <p>Paid txns: <span className="text-white">{metrics.billing.paidPaymentsCount}</span></p>
                </div>
                <p className="mt-4 text-xs text-[#666]">
                  Total paid so far: <span className="text-white">Rs {metrics.billing.totalPaymentsReceived}</span>
                </p>
              </div>

              <div className="rounded-2xl border border-[#1e1e1e] bg-[#111] p-5">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#666]">Database</p>
                <h2 className="mt-2 text-xl text-white">{formatBytes(metrics.database.storageUsedBytes)}</h2>
                <p className="mt-1 text-xs font-mono text-[#D4622A]">Storage used</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#aaa]">
                  <p>Quota: <span className="text-white">{formatBytes(metrics.database.storageQuotaBytes)}</span></p>
                  <p>Storage left: <span className="text-white">{formatStorageLeft(metrics.database.storageFreeBytes)}</span></p>
                  <p>Total records: <span className="text-white">{metrics.database.totalRecords}</span></p>
                  <p>Companies: <span className="text-white">{metrics.database.companies}</span></p>
                  <p>Members: <span className="text-white">{metrics.database.teamMembers}</span></p>
                  <p>Teams: <span className="text-white">{metrics.database.teams}</span></p>
                  <p>Forms: <span className="text-white">{metrics.database.forms}</span></p>
                  <p className="col-span-2">Submissions: <span className="text-white">{metrics.database.submissions}</span></p>
                </div>
                <p className="mt-4 text-xs text-[#666]">{metrics.database.note}</p>
              </div>
            </div>
          )}

          <div className="hidden overflow-hidden rounded-2xl border border-[#1e1e1e] bg-[#111] xl:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e1e]">
                  {["Company", "Owner", "Plan", "Status", "Usage", "Team", "Actions"].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-mono text-[#444]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => {
                  const subscription = company.subscription;
                  const usageLimit = company.leadLimit || company.usedLeads || 0;
                  return (
                    <tr key={company.id} className="border-b border-[#1e1e1e] align-top last:border-0">
                      <td className="px-4 py-4">
                        <p className="text-sm text-white">{company.company}</p>
                        <p className="mt-1 text-[10px] font-mono text-[#666]">{company.industry}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs text-white">{company.ownerName}</p>
                        <p className="mt-1 text-[10px] font-mono text-[#666]">{company.ownerEmail}</p>
                      </td>
                      <td className="px-4 py-4 text-[10px] font-mono text-[#D4622A]">
                        {subscription?.planName ?? "No subscription"}
                      </td>
                      <td className="px-4 py-4 text-[10px] font-mono text-[#999] capitalize">
                        {subscription?.status ?? "missing"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-[#1e1e1e]">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(company.usagePct, 100)}%`,
                                background: company.usagePct >= 90 ? "#ef4444" : "#D4622A",
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-[#888]">
                            {company.usedLeads}/{usageLimit || company.usedLeads}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[10px] font-mono text-[#888]">
                        {company.members} members
                        <div className="mt-1">{company.forms} forms</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex min-w-[240px] flex-col gap-2">
                          <select
                            value={subscription?.planId ?? ""}
                            disabled={!subscription || savingId === company.id}
                            onChange={(e) => updateCompany(company.id, { planId: e.target.value })}
                            className="rounded-xl border border-[#262626] bg-[#0f0f0f] px-3 py-2 text-xs font-mono text-white outline-none"
                          >
                            <option value="">Select plan</option>
                            {plans.map((plan) => (
                              <option key={plan.id} value={plan.id}>
                                {plan.name} - Rs {plan.priceMonthly}
                              </option>
                            ))}
                          </select>
                          <select
                            value={subscription?.status ?? ""}
                            disabled={!subscription || savingId === company.id}
                            onChange={(e) => updateCompany(company.id, { status: e.target.value })}
                            className="rounded-xl border border-[#262626] bg-[#0f0f0f] px-3 py-2 text-xs font-mono text-white outline-none"
                          >
                            <option value="">Select status</option>
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 xl:hidden">
            {filteredCompanies.map((company) => {
              const subscription = company.subscription;
              const usageLimit = company.leadLimit || company.usedLeads || 0;
              return (
                <div key={company.id} className="rounded-2xl border border-[#1e1e1e] bg-[#111] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-white">{company.company}</p>
                      <p className="mt-1 text-[10px] font-mono text-[#666]">{company.ownerEmail}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#D4622A]">
                      {subscription?.planName ?? "No subscription"}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 text-[10px] font-mono text-[#888]">
                    <p>Status: <span className="capitalize">{subscription?.status ?? "missing"}</span></p>
                    <p>Industry: {company.industry}</p>
                    <p>Usage: {company.usedLeads}/{usageLimit || company.usedLeads}</p>
                    <p>Members: {company.members}</p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <select
                      value={subscription?.planId ?? ""}
                      disabled={!subscription || savingId === company.id}
                      onChange={(e) => updateCompany(company.id, { planId: e.target.value })}
                      className="rounded-xl border border-[#262626] bg-[#0f0f0f] px-3 py-2 text-xs font-mono text-white outline-none"
                    >
                      <option value="">Select plan</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - Rs {plan.priceMonthly}
                        </option>
                      ))}
                    </select>
                    <select
                      value={subscription?.status ?? ""}
                      disabled={!subscription || savingId === company.id}
                      onChange={(e) => updateCompany(company.id, { status: e.target.value })}
                      className="rounded-xl border border-[#262626] bg-[#0f0f0f] px-3 py-2 text-xs font-mono text-white outline-none"
                    >
                      <option value="">Select status</option>
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
