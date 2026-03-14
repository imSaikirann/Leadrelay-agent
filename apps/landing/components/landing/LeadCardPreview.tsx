"use client";

import { useState, useEffect } from "react";

const leads = [
  {
    name: "Priya Sharma",
    initials: "PS",
    email: "priya@techstartup.io",
    course: "Full-Stack Bootcamp",
    context:
      "Looking to switch careers in 30 days. Company is sponsoring fees. Need to enroll ASAP.",
    score: "Hot",
    rep: "Arjun",
    time: "2s ago",
    scoreColor: "bg-red-50 border-red-200 text-red-700",
    avatarColor: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    reason: "Urgency + budget confirmed + 30-day timeline",
  },
  {
    name: "Rahul Mehta",
    initials: "RM",
    email: "rahul@gmail.com",
    course: "Data Science",
    context: "Exploring options, comparing a few programs. Not in a rush.",
    score: "Warm",
    rep: null,
    time: "1m ago",
    scoreColor: "bg-amber-50 border-amber-200 text-amber-700",
    avatarColor: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
    reason: "Interested but no urgency signals detected",
  },
];

export default function LeadCardPreview() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 px-6">
      <div className="flex items-center gap-3 mb-6">
        <p className="font-mono text-xs text-[#C4B9A8] uppercase tracking-widest">
          Live preview
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          scoring live
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {leads.map((lead, i) => (
          <div
            key={lead.name}
            className="flex-1 bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-sm transition-all duration-500"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transitionDelay: i * 120 + "ms",
            }}
          >
            {/* Score bar on top */}
            <div
              className={`h-1 w-full ${
                lead.score === "Hot" ? "bg-red-400" : "bg-amber-300"
              }`}
            />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${lead.avatarColor}`}
                  >
                    {lead.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1714] leading-tight">
                      {lead.name}
                    </p>
                    <p className="text-[11px] text-[#C4B9A8] font-mono mt-0.5">
                      {lead.course}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 border text-[11px] font-medium rounded-full px-2.5 py-1 shrink-0 ${lead.scoreColor}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${lead.dot} animate-pulse`} />
                  {lead.score}
                </span>
              </div>

              {/* Context quote */}
              <div className="bg-[#F7F5F2] border border-[#EDE9E2] rounded-xl px-4 py-3 mb-3 relative">
                <span className="absolute -top-2 left-3 text-[#D4622A] text-lg font-serif leading-none">
    
                </span>
                <p className="text-xs text-[#9B8E7E] leading-relaxed pt-1">
                  {lead.context}
                </p>
              </div>

              {/* AI reason */}
              <div className="flex items-start gap-2 mb-4">
                <span className="font-mono text-[10px] text-[#C4B9A8] uppercase tracking-wide shrink-0 pt-0.5">
                  AI
                </span>
                <p className="text-[11px] text-[#9B8E7E] leading-relaxed">
                  {lead.reason}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-[#F0EDE6] pt-3 flex items-center justify-between">
                {lead.rep ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#1A1714] flex items-center justify-center text-[9px] text-white font-medium">
                      {lead.rep[0]}
                    </div>
                    <p className="text-[11px] text-[#9B8E7E]">
                      Routed to{" "}
                      <span className="text-[#1A1714] font-medium">
                        {lead.rep}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#C4B9A8]">
                    Waiting for follow-up
                  </p>
                )}
                <span className="text-[11px] font-mono text-[#D4622A]">
                  {lead.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}