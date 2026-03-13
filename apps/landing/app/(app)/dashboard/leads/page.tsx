"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getLeadsByIndustry, Lead } from "@/lib/industry-data";

type Filter = "All" | "Hot" | "Warm" | "Cold";

const scoreConfig = {
  Hot: {
    badge: "bg-red-50 border-red-200 text-red-700",
    dot: "bg-red-500",
  },
  Warm: {
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-400",
  },
  Cold: {
    badge: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-400",
  },
};

const outcomeConfig = {
  pending: { label: "Pending", style: "bg-gray-50 border-gray-200 text-gray-500" },
  called: { label: "Called ✅", style: "bg-green-50 border-green-200 text-green-700" },
  no_answer: { label: "No Answer 🔄", style: "bg-amber-50 border-amber-200 text-amber-700" },
  meeting: { label: "Meeting 🔥", style: "bg-orange-50 border-orange-200 text-orange-700" },
  lost: { label: "Lost ❌", style: "bg-red-50 border-red-200 text-red-700" },
};

type Outcome = keyof typeof outcomeConfig;

export default function LeadsPage() {
  const company = useAppStore((s) => s.company);
  const rawLeads = getLeadsByIndustry(company?.industry ?? "edtech");

  const [filter, setFilter] = useState<Filter>("All");
  const [outcomes, setOutcomes] = useState<Record<string, Outcome>>(
    Object.fromEntries(rawLeads.map((l) => [l.id, "pending"]))
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    filter === "All" ? rawLeads : rawLeads.filter((l) => l.score === filter);

  const filters: Filter[] = ["All", "Hot", "Warm", "Cold"];

  const setOutcome = (id: string, outcome: Outcome) => {
    setOutcomes((prev) => ({ ...prev, [id]: outcome }));
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          All Leads
        </h1>
        <p className="text-sm text-[#9B8E7E] mt-1">
          {rawLeads.length} leads total · scored by AI
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: rawLeads.length, color: "text-[#1A1714]" },
          { label: "Hot 🔥", value: rawLeads.filter((l) => l.score === "Hot").length, color: "text-red-600" },
          { label: "Warm 🟡", value: rawLeads.filter((l) => l.score === "Warm").length, color: "text-amber-600" },
          { label: "Cold 🔵", value: rawLeads.filter((l) => l.score === "Cold").length, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-3">
            <p className="text-xs text-[#9B8E7E] font-mono mb-1">{s.label}</p>
            <p className={`text-2xl font-mono font-medium ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-150 border ${
              filter === f
                ? "bg-[#1A1714] text-[#FAF9F6] border-[#1A1714]"
                : "bg-white text-[#9B8E7E] border-[#E8E2D9] hover:border-[#C4B9A8]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
              {[
                "Lead",
                "Interest",
                "Score",
                "AI Reason",
                "Assigned To",
                "Response Timer",
                "Outcome",
                "Time",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-mono text-[#9B8E7E] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => {
              const score = scoreConfig[lead.score];
              const outcome = outcomeConfig[outcomes[lead.id]];
              const isExpanded = expandedId === lead.id;

              return (
                <>
                  <tr
                    key={lead.id}
                    className="border-b border-[#E8E2D9] last:border-0 hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                  >
                    {/* Lead */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-[#1A1714] whitespace-nowrap">
                        {lead.name}
                      </p>
                      <p className="text-[10px] text-[#9B8E7E] font-mono">
                        {lead.email}
                      </p>
                    </td>

                    {/* Interest */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2.5 py-1 text-[#9B8E7E] font-mono whitespace-nowrap">
                        {lead.interest}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 ${score.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${score.dot} animate-pulse`} />
                        {lead.score}
                      </span>
                    </td>

                    {/* AI Reason */}
                    <td className="px-4 py-3.5 max-w-[180px]">
                      <p className="text-[10px] font-mono text-[#9B8E7E] leading-relaxed truncate">
                        {lead.reason}
                      </p>
                    </td>

                    {/* Assigned To */}
                    <td className="px-4 py-3.5">
                      {lead.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#E8E2D9] flex items-center justify-center text-[10px] font-medium text-[#1A1714] shrink-0">
                            {lead.assignedTo[0]}
                          </div>
                          <span className="text-xs text-[#1A1714] whitespace-nowrap">
                            {lead.assignedTo}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#C4B9A8] font-mono">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Response Timer */}
                    <td className="px-4 py-3.5">
                      <ResponseTimer
                        score={lead.score}
                        outcome={outcomes[lead.id]}
                      />
                    </td>

                    {/* Outcome */}
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={outcomes[lead.id]}
                        onChange={(e) =>
                          setOutcome(lead.id, e.target.value as Outcome)
                        }
                        className={`text-xs font-mono border rounded-full px-2.5 py-1 outline-none cursor-pointer ${outcome.style}`}
                      >
                        {Object.entries(outcomeConfig).map(([key, val]) => (
                          <option key={key} value={key}>
                            {val.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Time */}
                    <td className="px-4 py-3.5 text-xs font-mono text-[#D4622A] whitespace-nowrap">
                      {lead.time}
                    </td>
                  </tr>

                  {/* Expanded context row */}
                  {isExpanded && (
                    <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
                      <td colSpan={8} className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <span className="text-[10px] font-mono text-[#C4B9A8] uppercase tracking-widest shrink-0 pt-0.5">
                            Context
                          </span>
                          <p className="text-xs text-[#9B8E7E] italic leading-relaxed">
                            "{lead.context}"
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-sm text-[#9B8E7E] py-12 text-center">
            No {filter.toLowerCase()} leads yet.
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {filtered.length > 0 ? (
          filtered.map((lead) => {
            const score = scoreConfig[lead.score];
            const outcome = outcomeConfig[outcomes[lead.id]];

            return (
              <div
                key={lead.id}
                className="bg-white border border-[#E8E2D9] rounded-2xl p-4"
              >
                {/* Top */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-[#1A1714]">{lead.name}</p>
                    <p className="text-xs text-[#9B8E7E] font-mono">{lead.email}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 ${score.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${score.dot} animate-pulse`} />
                    {lead.score}
                  </span>
                </div>

                {/* Context */}
                <div className="bg-[#F0EDE6] rounded-lg px-3 py-2 mb-3">
                  <p className="text-xs text-[#9B8E7E] italic leading-relaxed">
                    "{lead.context}"
                  </p>
                </div>

                {/* AI reason */}
                <p className="text-[10px] font-mono text-[#9B8E7E] mb-3">
                  AI: {lead.reason}
                </p>

                {/* Timer */}
                <div className="mb-3">
                  <ResponseTimer score={lead.score} outcome={outcomes[lead.id]} />
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D9]">
                  <p className="text-xs text-[#C4B9A8]">
                    {lead.assignedTo ? (
                      <>→ <span className="text-[#1A1714] font-medium">{lead.assignedTo}</span></>
                    ) : (
                      "Unassigned"
                    )}
                  </p>
                  <select
                    value={outcomes[lead.id]}
                    onChange={(e) => setOutcome(lead.id, e.target.value as Outcome)}
                    className={`text-xs font-mono border rounded-full px-2.5 py-1 outline-none ${outcome.style}`}
                  >
                    {Object.entries(outcomeConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-[#9B8E7E] py-12 text-center">
            No {filter.toLowerCase()} leads yet.
          </p>
        )}
      </div>

    </div>
  );
}

// ─── Response Timer component ─────────────────────────────────────────────────

function ResponseTimer({
  score,
  outcome,
}: {
  score: string;
  outcome: Outcome;
}) {
  const isDone = outcome !== "pending";

  if (isDone) {
    return (
      <span className="text-xs font-mono text-green-600">Responded ✓</span>
    );
  }

  const isHot = score === "Hot";

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          isHot ? "bg-red-500" : "bg-amber-400"
        }`}
      />
      <span
        className={`text-xs font-mono ${
          isHot ? "text-red-600" : "text-amber-600"
        }`}
      >
        {isHot ? "Awaiting — urgent" : "Awaiting"}
      </span>
    </div>
  );
}