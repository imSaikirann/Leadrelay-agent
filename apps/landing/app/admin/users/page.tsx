"use client";

import { useState } from "react";
import { adminUsers, AdminUser } from "@/lib/admin-data";
import { Search } from "lucide-react";

type StatusFilter = "all" | "active" | "inactive" | "suspended";

const statusConfig = {
  active: "bg-green-950 text-green-400 border-green-900",
  inactive: "bg-[#1e1e1e] text-[#555] border-[#2a2a2a]",
  suspended: "bg-red-950 text-red-400 border-red-900",
};

const planConfig = {
  free: "bg-[#1e1e1e] text-[#555] border-[#2a2a2a]",
  pro: "bg-amber-950 text-amber-400 border-amber-900",
  business: "bg-orange-950 text-[#D4622A] border-orange-900",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [users, setUsers] = useState(adminUsers);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSuspend = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "suspended" ? "active" : "suspended" }
          : u
      )
    );
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      <div className="mb-6">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-white leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Users
        </h1>
        <p className="text-sm text-[#555] mt-1">{users.length} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono placeholder:text-[#444] outline-none focus:border-[#D4622A] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive", "suspended"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={"px-3 py-1.5 rounded-full text-xs font-mono border transition-all " + (statusFilter === s ? "bg-[#D4622A] text-white border-[#D4622A]" : "bg-[#111] text-[#555] border-[#1e1e1e] hover:border-[#333] hover:text-white")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {["User", "Company", "Plan", "Status", "Usage", "Joined", "Last Active", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-mono text-[#444] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-[#1e1e1e] last:border-0 hover:bg-[#161616] transition-colors">

                {/* User */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1e1e1e] flex items-center justify-center text-xs font-medium text-white shrink-0">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="text-xs text-white whitespace-nowrap">{user.name}</p>
                      <p className="text-[10px] font-mono text-[#555]">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* Company */}
                <td className="px-4 py-3.5 text-xs text-[#666] font-mono whitespace-nowrap">
                  {user.company}
                </td>

                {/* Plan */}
                <td className="px-4 py-3.5">
                  <span className={"text-[10px] font-mono border rounded-full px-2 py-0.5 " + planConfig[user.plan]}>
                    {user.plan}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <span className={"text-[10px] font-mono border rounded-full px-2 py-0.5 " + statusConfig[user.status]}>
                    {user.status}
                  </span>
                </td>

                {/* Usage bar */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: (user.usedLeads / user.leads * 100) + "%",
                          background: user.usedLeads / user.leads > 0.9 ? "#ef4444" : "#D4622A",
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#555] whitespace-nowrap">
                      {user.usedLeads}/{user.leads}
                    </span>
                  </div>
                </td>

                {/* Joined */}
                <td className="px-4 py-3.5 text-[10px] font-mono text-[#555] whitespace-nowrap">
                  {user.joinedAt}
                </td>

                {/* Last active */}
                <td className="px-4 py-3.5 text-[10px] font-mono text-[#555] whitespace-nowrap">
                  {user.lastActive}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button className="text-[10px] font-mono text-[#555] hover:text-white border border-[#1e1e1e] hover:border-[#333] rounded-lg px-2 py-1 transition-colors whitespace-nowrap">
                      View
                    </button>
                    <button
                      onClick={() => toggleSuspend(user.id)}
                      className={"text-[10px] font-mono border rounded-lg px-2 py-1 transition-colors whitespace-nowrap " + (user.status === "suspended" ? "text-green-400 border-green-900 hover:bg-green-950" : "text-red-400 border-red-900 hover:bg-red-950")}
                    >
                      {user.status === "suspended" ? "Unsuspend" : "Suspend"}
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-sm text-[#555] py-12 text-center font-mono">
            No users found.
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filtered.map((user) => (
          <div key={user.id} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center text-sm font-medium text-white">
                  {user.name[0]}
                </div>
                <div>
                  <p className="text-sm text-white">{user.name}</p>
                  <p className="text-[10px] font-mono text-[#555]">{user.email}</p>
                </div>
              </div>
              <span className={"text-[10px] font-mono border rounded-full px-2 py-0.5 " + planConfig[user.plan]}>
                {user.plan}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4622A] rounded-full"
                  style={{ width: (user.usedLeads / user.leads * 100) + "%" }}
                />
              </div>
              <span className="text-[10px] font-mono text-[#555]">
                {user.usedLeads}/{user.leads} leads
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={"text-[10px] font-mono border rounded-full px-2 py-0.5 " + statusConfig[user.status]}>
                {user.status}
              </span>
              <button
                onClick={() => toggleSuspend(user.id)}
                className={"text-[10px] font-mono border rounded-lg px-2.5 py-1 transition-colors " + (user.status === "suspended" ? "text-green-400 border-green-900" : "text-red-400 border-red-900")}
              >
                {user.status === "suspended" ? "Unsuspend" : "Suspend"}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}