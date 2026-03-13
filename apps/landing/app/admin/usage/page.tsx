"use client";

import { adminUsers } from "@/lib/admin-data";

export default function AdminUsagePage() {
  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      <div className="mb-8">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-white leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Usage
        </h1>
        <p className="text-sm text-[#555] mt-1">
          Lead usage per user this month.
        </p>
      </div>

      {/* Usage table */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {["User", "Plan", "Used", "Limit", "Usage %", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-mono text-[#444] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((user) => {
              const pct = Math.round((user.usedLeads / user.leads) * 100);
              const isNearLimit = pct >= 90;
              const isOverLimit = pct >= 100;

              return (
                <tr key={user.id} className="border-b border-[#1e1e1e] last:border-0 hover:bg-[#161616] transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-white">{user.name}</p>
                    <p className="text-[10px] font-mono text-[#555]">{user.company}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[10px] font-mono text-[#555] capitalize">{user.plan}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono text-white">{user.usedLeads}</td>
                  <td className="px-4 py-3.5 text-xs font-mono text-[#555]">{user.leads}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: pct + "%",
                            background: isOverLimit ? "#ef4444" : isNearLimit ? "#f59e0b" : "#D4622A",
                          }}
                        />
                      </div>
                      <span className={"text-xs font-mono " + (isOverLimit ? "text-red-400" : isNearLimit ? "text-amber-400" : "text-[#555]")}>
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {isOverLimit ? (
                      <span className="text-[10px] font-mono bg-red-950 text-red-400 border border-red-900 rounded-full px-2 py-0.5">
                        over limit
                      </span>
                    ) : isNearLimit ? (
                      <span className="text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-900 rounded-full px-2 py-0.5">
                        near limit
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-[#1e1e1e] text-[#555] border border-[#2a2a2a] rounded-full px-2 py-0.5">
                        ok
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Usage breakdown bars */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
        <p className="text-xs font-mono text-[#555] uppercase tracking-widest mb-6">
          Usage by user
        </p>
        <div className="flex flex-col gap-4">
          {adminUsers.map((user) => {
            const pct = Math.round((user.usedLeads / user.leads) * 100);
            return (
              <div key={user.id} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <p className="text-xs text-white truncate">{user.name.split(" ")[0]}</p>
                  <p className="text-[10px] font-mono text-[#555] capitalize">{user.plan}</p>
                </div>
                <div className="flex-1 h-2 bg-[#1e1e1e] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: pct + "%",
                      background: pct >= 90 ? "#ef4444" : "#D4622A",
                    }}
                  />
                </div>
                <div className="w-20 text-right shrink-0">
                  <span className="text-xs font-mono text-[#555]">
                    {user.usedLeads}/{user.leads}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}