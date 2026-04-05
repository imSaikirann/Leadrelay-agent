"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

type Submission = {
  id: string;
  data: any;
  rank: string | null;
  rankReason: string | null;
  assignedAt: string;
  calledAt: string | null;
  callNote: string | null;
  status: string;
  form: { name: string } | null;
};

type Member = {
  name: string;
  role: string;
  leads: number;
  converted: number;
  activeLeads: number;
  avgResponseTime: string;
};

const rankConfig = {
  hot:     { bg: "bg-red-50",  border: "border-red-200",   text: "text-red-600",   dot: "bg-red-500",  label: "Hot"  },
  warm:    { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", dot: "bg-amber-400",label: "Warm" },
  cold:    { bg: "bg-blue-50",  border: "border-blue-200",  text: "text-blue-600",  dot: "bg-blue-400", label: "Cold" },
  pending: { bg: "bg-gray-50",  border: "border-gray-200",  text: "text-gray-500",  dot: "bg-gray-300", label: "—"   },
};

const statusConfig = {
  new:       { label: "New",       cls: "bg-[#F0EDE6] text-[#9B8E7E] border-[#E8E2D9]" },
  called:    { label: "Called",    cls: "bg-blue-50 text-blue-600 border-blue-200"       },
  converted: { label: "Converted", cls: "bg-green-50 text-green-600 border-green-200"   },
  lost:      { label: "Lost",      cls: "bg-gray-50 text-gray-400 border-gray-200"       },
};

const filters = ["all", "new", "called", "converted", "lost"] as const;
type Filter = typeof filters[number];
const PAGE_SIZE = 20;

export default function page() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [member, setMember]           = useState<Member | null>(null);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [filter, setFilter]           = useState<Filter>("all");
  const [expanded, setExpanded]       = useState<string | null>(null);
  const [loading, setLoading]         = useState(true);
  const [callModal, setCallModal]     = useState<Submission | null>(null);

  const load = useCallback(async (p: number, f: Filter) => {
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (f !== "all") params.set("status", f);
      const res = await fetch(`/api/rep/leads?${params}`, { cache: "no-store" });
      const data = await res.json();
      setSubmissions(data.submissions);
      setTotal(data.total);
      setMember(data.member);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { setLoading(true); load(page, filter); }, [page, filter, load]);

  function changeFilter(f: Filter) { setFilter(f); setPage(1); setExpanded(null); }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Navbar */}
      <div className="border-b border-[#E8E2D9] bg-white px-6 py-3 flex items-center justify-between">
        <p className="font-mono text-xs text-[#C4B9A8] uppercase tracking-widest">Foundhub</p>
        <div className="flex items-center gap-3">
          <p className="text-xs font-mono text-[#9B8E7E]">{session?.user?.name}</p>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs font-mono text-[#C4B9A8] hover:text-[#1A1714] transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-2 py-6 sm:py-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            My Leads
          </h1>
          <p className="text-sm text-[#9B8E7E] mt-1">Your assigned leads. Call them, log the outcome.</p>
        </div>

        {/* Stats */}
        {member && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Active",    value: member.activeLeads,    color: "text-[#D4622A]" },
              { label: "Total",     value: member.leads,          color: "text-[#1A1714]" },
              { label: "Converted", value: member.converted,      color: "text-green-600" },
              { label: "Avg. Response", value: member.avgResponseTime, color: "text-[#1A1714]" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4">
                <p className="text-xs font-mono text-[#9B8E7E] mb-1">{s.label}</p>
                <p className={`text-2xl font-mono font-medium ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

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
        {loading && <div className="flex justify-center py-16"><div className="w-6 h-6 rounded-full border-2 border-[#D4622A] border-t-transparent animate-spin" /></div>}

        {/* Empty */}
        {!loading && submissions.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[#E8E2D9] rounded-2xl">
            <p className="text-sm text-[#9B8E7E] font-mono">No leads here yet.</p>
          </div>
        )}

        {/* Lead list */}
        {!loading && (
          <div className="flex flex-col gap-3">
            {submissions.map((s) => {
              const rank   = (s.rank ?? "pending") as keyof typeof rankConfig;
              const rc     = rankConfig[rank];
              const sc     = statusConfig[s.status as keyof typeof statusConfig] ?? statusConfig.new;
              const isOpen = expanded === s.id;
              const entries = Object.entries(s.data as Record<string, string>);
              const name  = entries.find(([k]) => k.includes("name"))?.[1];
              const email = entries.find(([k]) => k.includes("email"))?.[1];
              const phone = entries.find(([k]) => k.includes("phone"))?.[1];
              const msg   = entries.find(([k]) => k === "message")?.[1];

              return (
                <div key={s.id} className={`bg-white border ${rc.border} rounded-2xl overflow-hidden`}>
                  {/* Row */}
                  <button onClick={() => setExpanded(isOpen ? null : s.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAF9F6] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-[#E8E2D9] flex items-center justify-center text-sm font-medium text-[#1A1714] shrink-0">
                        {name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1714]">{name ?? "Unknown"}</p>
                        <p className="text-xs text-[#9B8E7E] font-mono">{email ?? "—"} · {s.form?.name ?? "imported"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-mono border rounded-full px-2.5 py-1 ${sc.cls}`}>{sc.label}</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-mono border rounded-full px-2.5 py-1 ${rc.bg} ${rc.border} ${rc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />{rc.label}
                      </span>
                      <span className="text-[#C4B9A8] text-xs">{isOpen ? "↑" : "↓"}</span>
                    </div>
                  </button>

                  {/* Expanded */}
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-[#E8E2D9]">
                      {/* Message */}
                      {msg && (
                        <div className="mt-4 bg-[#FAF9F6] rounded-xl px-4 py-3 border border-[#E8E2D9]">
                          <p className="text-[10px] font-mono text-[#9B8E7E] mb-1">MESSAGE</p>
                          <p className="text-sm text-[#1A1714]">{msg}</p>
                        </div>
                      )}

                      {/* Other fields */}
                      <div className="mt-3 grid sm:grid-cols-2 gap-3">
                        {entries.filter(([k]) => k !== "message").map(([label, value]) => (
                          <div key={label} className="bg-[#FAF9F6] rounded-xl px-4 py-3">
                            <p className="text-[10px] text-[#9B8E7E] font-mono mb-0.5">{label}</p>
                            <p className="text-sm text-[#1A1714]">{String(value) || "—"}</p>
                          </div>
                        ))}
                      </div>

                      {/* AI reason */}
                      {s.rankReason && (
                        <div className={`mt-3 rounded-xl px-4 py-3 ${rc.bg} border ${rc.border}`}>
                          <p className={`text-xs font-mono ${rc.text}`}>AI: {s.rankReason}</p>
                        </div>
                      )}

                      {/* Call note */}
                      {s.callNote && (
                        <div className="mt-3 rounded-xl px-4 py-3 bg-blue-50 border border-blue-200">
                          <p className="text-[10px] font-mono text-blue-400 mb-0.5">CALL NOTE · {s.calledAt ? new Date(s.calledAt).toLocaleDateString() : ""}</p>
                          <p className="text-sm text-blue-800">{s.callNote}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {phone && (
                          <a href={`tel:${phone}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-mono
                              bg-[#D4622A] text-white hover:bg-[#B8501F] transition-colors">
                            <PhoneIcon /> Call {phone}
                          </a>
                        )}
                        {s.status !== "converted" && s.status !== "lost" && (
                          <button onClick={() => setCallModal(s)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-mono
                              bg-white border border-[#E8E2D9] text-[#9B8E7E] hover:text-[#1A1714] hover:border-[#C4B9A8] transition-all">
                            <LogIcon /> Log outcome
                          </button>
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
            <p className="text-xs font-mono text-[#9B8E7E]">
              {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[#E8E2D9] text-[#9B8E7E] hover:text-[#1A1714] disabled:opacity-40 transition-all">
                ← Prev
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[#E8E2D9] text-[#9B8E7E] hover:text-[#1A1714] disabled:opacity-40 transition-all">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Call log modal */}
      {callModal && (
        <CallLogModal
          submission={callModal}
          onClose={() => setCallModal(null)}
          onSaved={() => { setCallModal(null); load(page, filter); }}
        />
      )}
    </div>
  );
}

// ─── Call log modal ───────────────────────────────────────────────────────────

function CallLogModal({ submission, onClose, onSaved }: {
  submission: Submission;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [note, setNote]     = useState(submission.callNote ?? "");
  const [status, setStatus] = useState<"called" | "converted" | "lost">("called");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function handleSave() {
    setSaving(true); setError(null);
    try {
      const res = await fetch("/api/rep/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: submission.id, note, status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      onSaved();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  }

  const name = Object.entries(submission.data as Record<string, string>).find(([k]) => k.includes("name"))?.[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-[#E8E2D9] shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D9]">
          <h2 className="text-base text-[#1A1714]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            Log call · {name ?? "Lead"}
          </h2>
          <button onClick={onClose} className="text-[#C4B9A8] hover:text-[#1A1714]"><CloseIcon /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Outcome */}
          <div>
            <p className="text-[10px] font-mono text-[#9B8E7E] uppercase tracking-wider mb-2">Outcome</p>
            <div className="flex gap-2">
              {(["called", "converted", "lost"] as const).map((s) => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border capitalize transition-all ${
                    status === s ? "bg-[#1A1714] text-white border-[#1A1714]" : "border-[#E8E2D9] text-[#9B8E7E] hover:text-[#1A1714]"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <p className="text-[10px] font-mono text-[#9B8E7E] uppercase tracking-wider mb-2">Note</p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
              placeholder="What did you discuss?"
              className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] bg-[#FAF9F6] text-sm text-[#1A1714]
                placeholder:text-[#C4B9A8] focus:outline-none focus:border-[#D4622A] transition-colors resize-none" />
          </div>

          {error && <p className="text-xs font-mono text-red-500">{error}</p>}
        </div>

        <div className="px-6 pb-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-mono text-[#9B8E7E]">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-mono bg-[#D4622A] text-white hover:bg-[#B8501F] disabled:opacity-50 transition-colors">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PhoneIcon() {
  return <svg width={14} height={14} viewBox="0 0 16 16" fill="none"><path d="M2 2.5C2 2.5 3 1 4.5 1S6.5 2.5 7 4c.5 1.5-.5 2-1 2.5C6.5 7 9 10 9.5 10c.5 0 1-1 2.5-1S14 10.5 14 12c0 1.5-1.5 2.5-1.5 2.5S9 16 4.5 11.5 0 4 2 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
}
function LogIcon() {
  return <svg width={14} height={14} viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
function CloseIcon() {
  return <svg width={16} height={16} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
