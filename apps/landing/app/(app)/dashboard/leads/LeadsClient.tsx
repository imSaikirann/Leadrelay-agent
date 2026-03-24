"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import LeadsImportButton from "./LeadsImportButton";
import LeadsExportButton from "./LeadsExportButton";
import AssignButton from "./AssignButton";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

type Submission = {
  id: string;
  data: any;
  rank: string | null;
  rankReason: string | null;
  assignedTo: string | null;   // ← added
  status: string | null;       // ← added
  createdAt: Date;
  form: { name: string } | null;
};

const rankConfig = {
  hot:     { label: "Hot",      bg: "bg-red-50",  border: "border-red-200",   text: "text-red-600",   dot: "bg-red-500"   },
  warm:    { label: "Warm",     bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", dot: "bg-amber-400" },
  cold:    { label: "Cold",     bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-600",  dot: "bg-blue-400"  },
  pending: { label: "Ranking…", bg: "bg-gray-50",  border: "border-gray-200",  text: "text-gray-500",  dot: "bg-gray-300"  },
};

const filters = ["all", "hot", "warm", "cold", "pending"] as const;
type Filter = typeof filters[number];
const PAGE_SIZE = 20;

async function fetchSubmissions(page: number, rank: Filter) {
  const params = new URLSearchParams({ page: String(page) });
  if (rank !== "all") params.set("rank", rank);
  const res = await fetch(`/api/leads/submissions?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json() as Promise<{ submissions: Submission[]; total: number; page: number }>;
}

export default function LeadsClient({ formId }: { formId: string }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [filter, setFilter]           = useState<Filter>("all");
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [loading, setLoading]         = useState(true);
  const pollRef                       = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasPending = submissions.some((s) => !s.rank);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const load = useCallback(async (p: number, f: Filter) => {
    try {
      const data = await fetchSubmissions(p, f);
      setSubmissions(data.submissions);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { setLoading(true); load(page, filter); }, [page, filter, load]);

  useEffect(() => {
    if (!hasPending) { if (pollRef.current) clearTimeout(pollRef.current); return; }
    pollRef.current = setTimeout(() => load(page, filter), 4000);
    return () => { if (pollRef.current) clearTimeout(pollRef.current); };
  }, [hasPending, submissions, page, filter, load]);

  function changeFilter(f: Filter) { setFilter(f); setPage(1); setExpanded(null); }

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            Lead Queue
          </h1>
          <p className="text-sm text-[#9B8E7E] mt-1 flex items-center gap-2">
            Incoming leads ranked by AI.
            {hasPending && (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                ranking in progress
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <LeadsImportButton formId={formId} onImported={() => load(1, filter)} />
          <LeadsExportButton submissions={submissions} />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl p-1 mb-6 w-fit">
        {filters.map((f) => (
          <button key={f} onClick={() => changeFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-mono capitalize transition-all ${
              filter === f ? "bg-white text-[#1A1714] shadow-sm border border-[#E8E2D9]" : "text-[#9B8E7E] hover:text-[#1A1714]"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-[#D4622A] border-t-transparent animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && submissions.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[#E8E2D9] rounded-2xl">
          <p className="text-sm text-[#9B8E7E] font-mono">No leads yet.</p>
        </div>
      )}

      {/* Lead list */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {submissions.map((s) => {
            const rank = (s.rank ?? "pending") as keyof typeof rankConfig;
            const c = rankConfig[rank];
            const isOpen = expanded === s.id;
            const dataEntries = Object.entries(s.data as Record<string, string>);
            const emailEntry = dataEntries.find(([k]) => k.includes("email"));
            const nameEntry  = dataEntries.find(([k]) => k.includes("name"));

            return (
              <div key={s.id} className={`bg-white border ${c.border} rounded-2xl overflow-hidden`}>
                <button onClick={() => setExpanded(isOpen ? null : s.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAF9F6] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#E8E2D9] flex items-center justify-center text-sm font-medium text-[#1A1714] shrink-0">
                      {nameEntry ? String(nameEntry[1])[0]?.toUpperCase() : "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1714]">{nameEntry ? String(nameEntry[1]) : "Unknown"}</p>
                      <p className="text-xs text-[#9B8E7E] font-mono">{emailEntry ? String(emailEntry[1]) : "—"} · {s.form?.name ?? "imported"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Assigned indicator in row */}
                    {s.assignedTo && (
                      <span className="text-xs font-mono text-[#C4B9A8] border border-[#E8E2D9] rounded-full px-2 py-0.5">
                        assigned
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-mono border rounded-full px-2.5 py-1 ${c.bg} ${c.border} ${c.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${rank === "pending" ? "animate-pulse" : ""}`} />
                      {c.label}
                    </span>
                    <span className="text-xs text-[#C4B9A8] font-mono">{new Date(s.createdAt).toLocaleDateString()}</span>
                    <span className="text-[#C4B9A8] text-xs">{isOpen ? <ArrowUp className="size-3"/> : <ArrowDown className="size-3"/>}</span>
                  </div>
                </button>

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

                    {s.rankReason && (
                      <div className={`mt-3 rounded-xl px-4 py-3 ${c.bg} border ${c.border}`}>
                        <p className={`text-xs font-mono ${c.text}`}>AI ranking: {s.rankReason}</p>
                      </div>
                    )}

                    {rank === "pending" && (
                      <div className="mt-3 rounded-xl px-4 py-3 bg-gray-50 border border-gray-200">
                        <p className="text-xs font-mono text-gray-500 animate-pulse">AI is ranking this lead...</p>
                      </div>
                    )}

                    {/* Assign — bottom of expanded, full width row */}
                    <div className="mt-4 flex items-center justify-between">
                      <AssignButton
                        submissionId={s.id}
                        assignedTo={s.assignedTo}
                        onAssigned={() => load(page, filter)}
                      />
                      {s.status && s.status !== "new" && (
                        <span className="text-xs font-mono text-[#9B8E7E] capitalize">
                          Status: {s.status}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
   {totalPages > 1 && (
  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E8E2D9]">

    {/* Left: Range */}
    <p className="text-xs font-mono text-[#9B8E7E]">
      {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
    </p>

    {/* Right: Controls */}
    <div className="flex items-center gap-1">

      {/* Prev */}
      <button
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-[#9B8E7E] hover:text-[#1A1714] disabled:opacity-40 transition"
      >
        <ArrowLeft className="size-3.5" />
      </button>

      {/* Pages */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | "...")[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="px-2 text-xs text-[#C4B9A8]"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`min-w-[28px] h-7 rounded-md text-xs font-mono transition ${
                  page === p
                    ? "bg-[#1A1714] text-white"
                    : "text-[#9B8E7E] hover:bg-[#F0EDE6] hover:text-[#1A1714]"
                }`}
              >
                {p}
              </button>
            )
          )}
      </div>

      {/* Next */}
      <button
        onClick={() => setPage((p) => p + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-[#9B8E7E] hover:text-[#1A1714] disabled:opacity-40 transition"
      >
        <ArrowRight className="size-3.5" />
      </button>
    </div>
  </div>
)}
    </div>
  );
}