"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { getLeadsByIndustry, getTeam } from "@/lib/industry-data";
import { ArrowLeft, Phone, Mail, Clock, Brain } from "lucide-react";

const scoreConfig = {
  Hot: { badge: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500", glow: "shadow-red-100" },
  Warm: { badge: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-400", glow: "shadow-amber-100" },
  Cold: { badge: "bg-blue-50 border-blue-200 text-blue-700", dot: "bg-blue-400", glow: "shadow-blue-100" },
};

const outcomeOptions = [
  { value: "pending", label: "Pending" },
  { value: "called", label: "Called ✅" },
  { value: "no_answer", label: "No Answer 🔄" },
  { value: "meeting", label: "Meeting Booked 🔥" },
  { value: "lost", label: "Lost ❌" },
];

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const company = useAppStore((s) => s.company);

  const leads = getLeadsByIndustry(company?.industry ?? "edtech");
  const team = getTeam();
  const lead = leads.find((l) => l.id === id);

  const [outcome, setOutcome] = useState("pending");
  const [assignedTo, setAssignedTo] = useState(lead?.assignedTo ?? "");
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  if (!lead) {
    return (
      <div className="px-4 sm:px-8 py-6 sm:py-8">
        <p className="text-sm text-[#9B8E7E]">Lead not found.</p>
      </div>
    );
  }

  const score = scoreConfig[lead.score];

  const handleSaveNote = () => {
    if (!note) return;
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-3xl">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs font-mono text-[#9B8E7E] hover:text-[#1A1714] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to leads
      </button>

      {/* Lead header card */}
      <div className={"bg-white border border-[#E8E2D9] rounded-2xl p-6 mb-4 shadow-lg " + score.glow}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8E2D9] flex items-center justify-center text-lg font-medium text-[#1A1714] shrink-0">
              {lead.name[0]}
            </div>
            <div>
              <h1
                className="text-xl text-[#1A1714] leading-tight"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                {lead.name}
              </h1>
              <p className="text-xs text-[#9B8E7E] font-mono mt-0.5">{lead.interest}</p>
            </div>
          </div>
          <span
            className={"inline-flex items-center gap-1.5 border text-sm font-medium rounded-full px-3 py-1.5 self-start " + score.badge}
          >
            <span className={"w-2 h-2 rounded-full animate-pulse " + score.dot} />
            {lead.score} Lead
          </span>
        </div>

        {/* Contact info */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={"mailto:" + lead.email}
            className="flex items-center gap-2 text-xs font-mono text-[#9B8E7E] hover:text-[#D4622A] transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            {lead.email}
          </a>
          <a
            href={"tel:" + lead.phone}
            className="flex items-center gap-2 text-xs font-mono text-[#9B8E7E] hover:text-[#D4622A] transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            {lead.phone}
          </a>
          <span className="flex items-center gap-2 text-xs font-mono text-[#C4B9A8]">
            <Clock className="w-3.5 h-3.5" />
            {lead.time}
          </span>
        </div>
      </div>

      {/* Context */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 mb-4">
        <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-4">
          What they said
        </p>
        <p
          className="text-base text-[#1A1714] leading-relaxed italic"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          "{lead.context}"
        </p>
      </div>

      {/* AI Scoring */}
      <div className="bg-[#1A1714] rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-[#F5C27A]" />
          <p className="text-xs font-mono text-[#F5C27A] uppercase tracking-widest">
            AI Reasoning
          </p>
        </div>
        <p className="text-sm text-[#FAF9F6] leading-relaxed font-mono">
          {lead.reason}
        </p>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#2C2825]">
          <span
            className={"inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 " + score.badge}
          >
            <span className={"w-1.5 h-1.5 rounded-full " + score.dot} />
            Scored as {lead.score}
          </span>
          <span className="text-[10px] font-mono text-[#9B8E7E]">· 1.8s scoring time</span>
        </div>
      </div>

      {/* Actions row */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">

        {/* Assign rep */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5">
          <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-4">
            Assigned rep
          </p>
          <div className="relative">
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none appearance-none cursor-pointer focus:border-[#D4622A] transition-colors"
            >
              <option value="">Unassigned</option>
              {team.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} — {m.role}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4B9A8] pointer-events-none text-xs">
              ↓
            </span>
          </div>
        </div>

        {/* Outcome */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5">
          <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-4">
            Outcome
          </p>
          <div className="relative">
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none appearance-none cursor-pointer focus:border-[#D4622A] transition-colors"
            >
              {outcomeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4B9A8] pointer-events-none text-xs">
              ↓
            </span>
          </div>
        </div>

      </div>

      {/* Rep notes */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 mb-4">
        <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-4">
          Rep notes
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about this lead — what did they say on the call?"
          className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono placeholder:text-[#C4B9A8] outline-none focus:border-[#D4622A] focus:ring-2 focus:ring-[#D4622A]/10 transition-all resize-none h-24"
        />
        <button
          onClick={handleSaveNote}
          className="mt-3 text-xs font-mono bg-[#1A1714] text-[#FAF9F6] rounded-xl px-4 py-2 hover:bg-[#2C2825] transition-colors"
        >
          {noteSaved ? "Saved ✓" : "Save note"}
        </button>
      </div>

      {/* Quick actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={"tel:" + lead.phone}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1A1714] text-[#FAF9F6] text-sm font-mono py-3 rounded-xl hover:bg-[#2C2825] transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call now
        </a>
        <a
          href={"mailto:" + lead.email}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#E8E2D9] text-[#1A1714] text-sm font-mono py-3 rounded-xl hover:border-[#C4B9A8] transition-colors"
        >
          <Mail className="w-4 h-4" />
          Send email
        </a>
      </div>

    </div>
  );
}