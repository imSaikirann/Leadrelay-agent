"use client";

import { adminUsers, getAdminStats } from "@/lib/admin-data";

const planConfig = {
  free: { label: "Free", price: 0, color: "text-[#555]", badge: "bg-[#1e1e1e] text-[#555] border-[#2a2a2a]" },
  pro: { label: "Pro", price: 29, color: "text-amber-400", badge: "bg-amber-950 text-amber-400 border-amber-900" },
  business: { label: "Business", price: 79, color: "text-[#D4622A]", badge: "bg-orange-950 text-[#D4622A] border-orange-900" },
};

export default function AdminBillingPage() {
  const stats = getAdminStats();

  const payingUsers = adminUsers.filter((u) => u.plan !== "free");

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      <div className="mb-8">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-white leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Billing
        </h1>
        <p className="text-sm text-[#555] mt-1">
          Revenue and plan management.
        </p>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "MRR", value: "$" + stats.mrr, sub: "monthly recurring", color: "text-[#D4622A]" },
          { label: "ARR", value: "$" + stats.mrr * 12, sub: "annualized", color: "text-white" },
          { label: "Paying users", value: payingUsers.length, sub: "of " + stats.totalUsers + " total", color: "text-white" },
          { label: "Avg Revenue", value: "$" + (payingUsers.length ? Math.round(stats.mrr / payingUsers.length) : 0), sub: "per paying user", color: "text-amber-400" },
        ].map((k) => (
          <div key={k.label} className="bg-[#111] border border-[#1e1e1e] rounded-2xl px-4 py-4">
            <p className="text-[10px] font-mono text-[#555] mb-1">{k.label}</p>
            <p className={"text-2xl font-mono font-medium " + k.color}>{k.value}</p>
            <p className="text-[10px] font-mono text-[#444] mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Paying users table */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-[#1e1e1e]">
          <p className="text-xs font-mono text-[#555] uppercase tracking-widest">
            Paying customers
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {["User", "Plan", "Monthly Revenue", "Status", "Action"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-mono text-[#444]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payingUsers.map((user) => {
              const plan = planConfig[user.plan];
              return (
                <tr key={user.id} className="border-b border-[#1e1e1e] last:border-0 hover:bg-[#161616] transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-white">{user.name}</p>
                    <p className="text-[10px] font-mono text-[#555]">{user.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={"text-[10px] font-mono border rounded-full px-2 py-0.5 " + plan.badge}>
                      {plan.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={"text-sm font-mono font-medium " + plan.color}>
                      ${plan.price}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[10px] font-mono text-green-400 bg-green-950 border border-green-900 rounded-full px-2 py-0.5">
                      active
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="text-[10px] font-mono text-[#555] hover:text-white border border-[#1e1e1e] hover:border-[#333] rounded-lg px-2 py-1 transition-colors">
                      Manage
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Plan pricing reference */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { plan: "Free", price: "$0", leads: "50 leads/mo", members: "1 member", color: "border-[#1e1e1e]" },
          { plan: "Pro", price: "$29/mo", leads: "500 leads/mo", members: "5 members", color: "border-amber-900" },
          { plan: "Business", price: "$79/mo", leads: "Unlimited", members: "Unlimited", color: "border-orange-900" },
        ].map((p) => (
          <div key={p.plan} className={"bg-[#111] border rounded-2xl p-5 " + p.color}>
            <p className="text-xs font-mono text-[#555] mb-1">{p.plan}</p>
            <p className="text-2xl font-mono font-medium text-white mb-3">{p.price}</p>
            <p className="text-[10px] font-mono text-[#555]">{p.leads}</p>
            <p className="text-[10px] font-mono text-[#555]">{p.members}</p>
          </div>
        ))}
      </div>

    </div>
  );
}