"use client";

import { useState } from "react";
import { adminLeads } from "@/lib/admin-data";
import { Search } from "lucide-react";

type ScoreFilter = "All" | "Hot" | "Warm" | "Cold";

const scoreConfig = {
  Hot: "bg-red-950 text-red-400 border-red-900",
  Warm: "bg-amber-950 text-amber-400 border-amber-900",
  Cold: "bg-blue-950 text-blue-400 border-blue-900",
};

export default function AdminLeadsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ScoreFilter>("All");

  const filtered = adminLeads.filter((l) => {
    const matchSearch =
      l.leadName.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || l.score === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      <div className="mb-6">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-white leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          All Leads
        </h1>
        <p className="text-sm text-[#555] mt-1">
          {adminLeads.length} leads across all users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full bg-[#111] border border-[#1e1e1e] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono placeholder:text-[#444] outline-none focus:border-[#D4622A] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["All", "Hot", "Warm", "Cold"] as ScoreFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={"px-3 py-1.5 rounded-full text-xs font-mono border transition-all " + (filter === f ? "bg-[#D4622A] text-white border-[#D4622A]" : "bg-[#111] text-[#555] border-[#1e1e1e] hover:border-[#333] hover:text-white")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {["Lead", "Email", "Score", "Industry", "Submitted by", "Time"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-mono text-[#444] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-[#1e1e1e] last:border-0 hover:bg-[#161616] transition-colors">
                <td className="px-4 py-3.5">
                  <p className="text-xs text-white whitespace-nowrap">{lead.leadName}</p>
                </td>
                <td className="px-4 py-3.5 text-[10px] font-mono text-[#555]">{lead.email}</td>
                <td className="px-4 py-3.5">
                  <span className={"text-[10px] font-mono border rounded-full px-2 py-0.5 " + scoreConfig[lead.score]}>
                    {lead.score}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-[10px] font-mono text-[#555]">{lead.industry}</td>
                <td className="px-4 py-3.5">
                  <div>
                    <p className="text-xs text-white">{lead.userName}</p>
                    <p className="text-[10px] font-mono text-[#555]">{lead.company}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-[10px] font-mono text-[#D4622A]">{lead.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-sm text-[#555] py-12 text-center font-mono">No leads found.</p>
        )}
      </div>

    </div>
  );
}