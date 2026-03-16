"use client";

import { useState } from "react";

type Submission = {
  id: string;
  data: any;
  rank: string | null ;
  rankReason: string | null ;

  createdAt: Date;
  form: { name: string };
};

const rankConfig = {
  hot: { label: "Hot", bg: "bg-red-50", border: "border-red-200", text: "text-red-600", dot: "bg-red-500" },
  warm: { label: "Warm", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", dot: "bg-amber-400" },
  cold: { label: "Cold", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", dot: "bg-blue-400" },
  pending: { label: "Ranking...", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-500", dot: "bg-gray-300" },
};

const filters = ["all", "hot", "warm", "cold", "pending"] as const;

export default function LeadsClient({ submissions }: { submissions: Submission[] }) {
  const [filter, setFilter] = useState<typeof filters[number]>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = submissions.filter((s) => {
    if (filter === "all") return true;
    if (filter === "pending") return !s.rank;
    return s.rank === filter;
  });

  const counts = {
    all: submissions.length,
    hot: submissions.filter((s) => s.rank === "hot").length,
    warm: submissions.filter((s) => s.rank === "warm").length,
    cold: submissions.filter((s) => s.rank === "cold").length,
    pending: submissions.filter((s) => !s.rank).length,
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          Lead Queue
        </h1>
        <p className="text-sm text-[#9B8E7E] mt-1">
          Incoming leads ranked by AI as hot, warm, or cold.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["hot", "warm", "cold", "pending"] as const).map((r) => {
          const c = rankConfig[r];
          return (
            <div key={r} className={`bg-white border ${c.border} rounded-2xl px-4 py-4`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <p className={`text-xs font-mono ${c.text}`}>{c.label}</p>
              </div>
              <p className="text-2xl font-mono font-medium text-[#1A1714]">{counts[r]}</p>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl p-1 mb-6 w-fit">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-mono capitalize transition-all ${
              filter === f ? "bg-white text-[#1A1714] shadow-sm border border-[#E8E2D9]" : "text-[#9B8E7E] hover:text-[#1A1714]"
            }`}
          >
            {f} {counts[f] > 0 && <span className="ml-1 opacity-60">{counts[f]}</span>}
          </button>
        ))}
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[#E8E2D9] rounded-2xl">
          <p className="text-sm text-[#9B8E7E] font-mono">No leads yet.</p>
        </div>
      )}

      {/* Lead list */}
      <div className="flex flex-col gap-3">
        {filtered.map((s) => {
          const rank = (s.rank ?? "pending") as keyof typeof rankConfig;
          const c = rankConfig[rank];
          const isOpen = expanded === s.id;
          const dataEntries = Object.entries(s.data as Record<string, string>);
          const emailEntry = dataEntries.find(([k]) => k.toLowerCase().includes("email"));
          const nameEntry = dataEntries.find(([k]) => k.toLowerCase().includes("name"));

          return (
            <div key={s.id} className={`bg-white border ${c.border} rounded-2xl overflow-hidden transition-all`}>
              {/* Row */}
              <button
                onClick={() => setExpanded(isOpen ? null : s.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAF9F6] transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[#E8E2D9] flex items-center justify-center text-sm font-medium text-[#1A1714] shrink-0">
                    {nameEntry ? String(nameEntry[1])[0]?.toUpperCase() : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1714]">
                      {nameEntry ? String(nameEntry[1]) : "Unknown"}
                    </p>
                    <p className="text-xs text-[#9B8E7E] font-mono">
                      {emailEntry ? String(emailEntry[1]) : "—"} · {s.form.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Rank badge */}
                  <span className={`inline-flex items-center gap-1.5 text-xs font-mono border rounded-full px-2.5 py-1 ${c.bg} ${c.border} ${c.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${rank === "pending" ? "animate-pulse" : ""}`} />
                    {c.label}
                  </span>
                  <span className="text-xs text-[#C4B9A8] font-mono">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-[#C4B9A8] text-xs">{isOpen ? "↑" : "↓"}</span>
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="px-5 pb-5 border-t border-[#E8E2D9]">
                  <div className="pt-4 grid sm:grid-cols-2 gap-3">
                    {dataEntries.map(([label, value]) => (
                      <div key={label} className="bg-[#FAF9F6] rounded-xl px-4 py-3">
                        <p className="text-[10px] text-[#9B8E7E] font-mono mb-0.5">{label}</p>
                        <p className="text-sm text-[#1A1714]">{String(value) || "—"}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI reason */}
                  {s.rankReason && (
                    <div className={`mt-3 rounded-xl px-4 py-3 ${c.bg} border ${c.border}`}>
                      <p className={`text-xs font-mono ${c.text}`}>
                        AI ranking: {s.rankReason}
                      </p>
                    </div>
                  )}

                  {rank === "pending" && (
                    <div className="mt-3 rounded-xl px-4 py-3 bg-gray-50 border border-gray-200">
                      <p className="text-xs font-mono text-gray-500 animate-pulse">
                        AI is ranking this lead...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}