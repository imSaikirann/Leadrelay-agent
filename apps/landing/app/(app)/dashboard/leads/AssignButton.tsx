"use client";

import { useState, useEffect, useRef } from "react";

type Member = { id: string; name: string; role: string; activeLeads: number };

export default function AssignButton({
  submissionId,
  assignedTo,
  onAssigned,
}: {
  submissionId: string;
  assignedTo?: string | null;
  onAssigned?: () => void;
}) {
  const [open, setOpen]         = useState(false);
  const [members, setMembers]   = useState<Member[]>([]);
  const [assigned, setAssigned] = useState(assignedTo ?? null);
  const [saving, setSaving]     = useState(false);
  const [loaded, setLoaded]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch members once on first open
  useEffect(() => {
    if (!open || loaded) return;
    fetch("/api/team/members")
      .then((r) => r.json())
      .then((d) => { setMembers(d.members ?? []); setLoaded(true); })
      .catch(console.error);
  }, [open, loaded]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function assign(memberId: string) {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/leads/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, memberId }),
      });
      const json = await res.json();
      if (res.ok) {
        setAssigned(memberId);
        onAssigned?.();
      } else {
        console.error("assign error:", json.error);
      }
    } catch (err) {
      console.error("assign failed:", err);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  }

  const assignedMember = members.find((m) => m.id === assigned);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all shadow-sm
          ${assigned
            ? "bg-[#FAF9F6] border-[#E8E2D9] text-[#9B8E7E]"
            : "bg-white border-[#E8E2D9] text-[#9B8E7E] hover:text-[#1A1714] hover:border-[#C4B9A8]"
          }`}
      >
        <PersonIcon />
        {assignedMember?.name ?? (assigned ? "Assigned" : "Assign to rep")}
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mt-1 z-20 bg-white border border-[#E8E2D9] rounded-xl shadow-lg w-56 overflow-hidden">
          {!loaded && (
            <div className="px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-[#D4622A] border-t-transparent animate-spin" />
              <p className="text-xs font-mono text-[#C4B9A8]">Loading…</p>
            </div>
          )}
          {loaded && members.length === 0 && (
            <p className="px-4 py-3 text-xs font-mono text-[#C4B9A8]">No active team members.</p>
          )}
          {loaded && members.map((m) => (
            <button
              key={m.id}
              onClick={() => assign(m.id)}
              disabled={saving}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-[#FAF9F6]
                ${assigned === m.id ? "bg-[#FAF9F6]" : ""}`}
            >
              <div>
                <p className="text-xs font-medium text-[#1A1714]">{m.name}</p>
                <p className="text-[10px] font-mono text-[#9B8E7E]">{m.role} · {m.activeLeads} active</p>
              </div>
              {assigned === m.id && <span className="text-[#D4622A] text-xs font-mono">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}