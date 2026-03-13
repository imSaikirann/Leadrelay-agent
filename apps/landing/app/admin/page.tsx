"use client";

import { getAdminStats, adminUsers, adminLeads } from "@/lib/admin-data";

export default function AdminOverviewPage() {
  const stats = getAdminStats();

  const kpis = [
    { label: "Total Users", value: stats.totalUsers, sub: stats.activeUsers + " active", color: "text-white" },
    { label: "MRR", value: "$" + stats.mrr, sub: "monthly recurring", color: "text-[#D4622A]" },
    { label: "Total Leads", value: stats.totalLeads, sub: stats.hotLeads + " hot", color: "text-white" },
    { label: "Pro Users", value: stats.proUsers, sub: "$29/mo each", color: "text-amber-400" },
    { label: "Business", value: stats.businessUsers, sub: "$79/mo each", color: "text-green-400" },
    { label: "Free Users", value: stats.freeUsers, sub: "not paying", color: "text-[#555]" },
  ];

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-white leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Admin Overview
        </h1>
        <p className="text-sm text-[#555] mt-1">
          Everything happening across LeadIQ.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-[#111] border border-[#1e1e1e] rounded-2xl px-4 py-4">
            <p className="text-[10px] font-mono text-[#555] mb-1">{k.label}</p>
            <p className={"text-2xl font-mono font-medium " + k.color}>{k.value}</p>
            <p className="text-[10px] font-mono text-[#444] mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Plan breakdown bar */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 mb-4">
        <p className="text-xs font-mono text-[#555] uppercase tracking-widest mb-4">
          Plan distribution
        </p>
        <div className="flex h-3 rounded-full overflow-hidden mb-3">
          <div
            className="bg-[#D4622A] transition-all"
            style={{ width: (stats.businessUsers / stats.totalUsers * 100) + "%" }}
          />
          <div
            className="bg-amber-400 transition-all"
            style={{ width: (stats.proUsers / stats.totalUsers * 100) + "%" }}
          />
          <div
            className="bg-[#2a2a2a] transition-all flex-1"
          />
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: "Business", color: "bg-[#D4622A]", count: stats.businessUsers },
            { label: "Pro", color: "bg-amber-400", count: stats.proUsers },
            { label: "Free", color: "bg-[#2a2a2a]", count: stats.freeUsers },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-1.5">
              <span className={"w-2 h-2 rounded-full " + p.color} />
              <span className="text-xs font-mono text-[#555]">{p.label} ({p.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Recent users */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
          <p className="text-xs font-mono text-[#555] uppercase tracking-widest mb-4">
            Recent signups
          </p>
          <div className="flex flex-col gap-3">
            {adminUsers.slice(0, 4).map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1e1e1e] flex items-center justify-center text-xs font-medium text-white shrink-0">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="text-xs text-white">{u.name}</p>
                    <p className="text-[10px] font-mono text-[#555]">{u.company}</p>
                  </div>
                </div>
                <PlanBadge plan={u.plan} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent leads */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
          <p className="text-xs font-mono text-[#555] uppercase tracking-widest mb-4">
            Recent leads
          </p>
          <div className="flex flex-col gap-3">
            {adminLeads.slice(0, 4).map((l) => (
              <div key={l.id} className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white">{l.leadName}</p>
                  <p className="text-[10px] font-mono text-[#555]">{l.company}</p>
                </div>
                <ScoreBadge score={l.score} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const config = {
    free: "bg-[#1e1e1e] text-[#555] border-[#2a2a2a]",
    pro: "bg-amber-950 text-amber-400 border-amber-900",
    business: "bg-orange-950 text-[#D4622A] border-orange-900",
  };
  return (
    <span className={"text-[10px] font-mono border rounded-full px-2 py-0.5 " + config[plan as keyof typeof config]}>
      {plan}
    </span>
  );
}

function ScoreBadge({ score }: { score: string }) {
  const config = {
    Hot: "bg-red-950 text-red-400 border-red-900",
    Warm: "bg-amber-950 text-amber-400 border-amber-900",
    Cold: "bg-blue-950 text-blue-400 border-blue-900",
  };
  return (
    <span className={"text-[10px] font-mono border rounded-full px-2 py-0.5 " + config[score as keyof typeof config]}>
      {score}
    </span>
  );
}