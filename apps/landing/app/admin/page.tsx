import { getAdminLeads, getAdminStats, getAdminSupportSignals, getAdminUsers } from "@/lib/admin-data";

export default async function AdminOverviewPage() {
  const [stats, users, leads, supportSignals] = await Promise.all([
    getAdminStats(),
    getAdminUsers(),
    getAdminLeads(5),
    getAdminSupportSignals(),
  ]);

  const kpis = [
    { label: "Total Users", value: stats.totalUsers, sub: `${stats.activeUsers} active`, color: "text-white" },
    { label: "MRR", value: `Rs ${stats.mrr}`, sub: "monthly recurring", color: "text-[#D4622A]" },
    { label: "Total Leads", value: stats.totalLeads, sub: `${stats.hotLeads} hot`, color: "text-white" },
    { label: "Pro Users", value: stats.proUsers, sub: "paid seats", color: "text-amber-400" },
    { label: "Business", value: stats.businessUsers, sub: "paid seats", color: "text-green-400" },
    { label: "Trial / Free", value: stats.freeUsers, sub: "non-paying", color: "text-[#777]" },
  ];

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-8">
        <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] leading-tight">Admin Overview</h1>
        <p className="text-sm text-[#666] mt-1">Live platform health across companies, leads, and billing.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-[#111] border border-[#1e1e1e] rounded-2xl px-4 py-4">
            <p className="text-[10px] font-mono text-[#555] mb-1">{kpi.label}</p>
            <p className={`text-2xl font-mono font-medium ${kpi.color}`}>{kpi.value}</p>
            <p className="text-[10px] font-mono text-[#444] mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
          <p className="text-xs font-mono text-[#555] uppercase tracking-widest mb-4">Recent companies</p>
          <div className="flex flex-col gap-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white">{user.company}</p>
                  <p className="text-[10px] font-mono text-[#555]">{user.email}</p>
                </div>
                <span className="text-[10px] font-mono border border-[#2a2a2a] rounded-full px-2 py-0.5 text-[#999] capitalize">
                  {user.plan}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
          <p className="text-xs font-mono text-[#555] uppercase tracking-widest mb-4">Recent leads</p>
          <div className="flex flex-col gap-3">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white">{lead.leadName}</p>
                  <p className="text-[10px] font-mono text-[#555]">{lead.company}</p>
                </div>
                <span className="text-[10px] font-mono border border-[#2a2a2a] rounded-full px-2 py-0.5 text-[#D4622A]">
                  {lead.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
        <p className="text-xs font-mono text-[#555] uppercase tracking-widest mb-4">Support watchlist</p>
        <div className="grid gap-3 md:grid-cols-2">
          {supportSignals.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white">{item.company}</p>
                  <p className="text-[10px] font-mono text-[#666]">{item.owner}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-mono uppercase ${
                  item.priority === "high"
                    ? "bg-red-500/10 text-red-300"
                    : item.priority === "medium"
                    ? "bg-amber-500/10 text-amber-300"
                    : "bg-emerald-500/10 text-emerald-300"
                }`}>
                  {item.priority}
                </span>
              </div>
              <p className="mt-3 text-xs text-[#A3A3A3]">{item.reason}</p>
              <p className="mt-2 text-[10px] font-mono text-[#666]">{item.plan}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
