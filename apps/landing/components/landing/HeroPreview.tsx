"use client";

import { useEffect, useState } from "react";

const leads = [
  {
    initials: "PS",
    name: "Priya Sharma",
    course: "Full-Stack Bootcamp",
    quote: "Need to enroll ASAP, company is sponsoring fees, 30-day deadline.",
    score: "Hot",
    routedTo: "Arjun",
    time: "2s ago",
    avatar: "bg-red-100 text-red-700",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500 animate-pulse",
    topBar: "bg-red-400",
    timeColor: "text-[#D4622A]",
  },
  {
    initials: "RM",
    name: "Rahul Mehta",
    course: "Data Science",
    quote: "Exploring options, comparing a few programs. Not in a rush.",
    score: "Warm",
    routedTo: null,
    time: "1m ago",
    avatar: "bg-amber-100 text-amber-700",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    topBar: "bg-amber-300",
    timeColor: "text-amber-500",
  },
  {
    initials: "AK",
    name: "Amit Kumar",
    course: "UI/UX Design",
    quote: "Just browsing, no real timeline in mind right now.",
    score: "Cold",
    routedTo: null,
    time: "5m ago",
    avatar: "bg-blue-100 text-blue-700",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-300",
    topBar: "bg-blue-200",
    timeColor: "text-[#C4B9A8]",
  },
];

export default function HeroPreview() {
  const [visible, setVisible] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    leads.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + i * 250);
    });
  }, []);

  return (
    <div className="relative">

      {/* Card stack depth */}
      <div className="absolute inset-x-3 top-2 h-full bg-[#EDE9E2] rounded-2xl -z-10" />

      {/* Main card */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">

        {/* Topbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0EDE6] bg-[#FAFAF8]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#1A1714]">
              Found<span className="text-[#D4622A]">hub</span>
            </span>
            <span className="font-mono text-[10px] text-[#C4B9A8]">/ leads</span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            scoring live
          </span>
        </div>

        {/* Lead rows */}
        <div className="divide-y divide-[#F7F5F2]">
          {leads.map((lead, i) => (
            <div
              key={lead.name}
              className="relative transition-all duration-500 ease-out"
              style={{
                opacity: visible[i] ? 1 : 0,
                transform: visible[i] ? "translateX(0)" : "translateX(-8px)",
              }}
            >
              {/* Left score accent */}
              <div className={"absolute left-0 top-0 bottom-0 w-[3px] " + lead.topBar} />

              <div className="px-4 pl-5 py-3">
                {/* Name + badge */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={"w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 " + lead.avatar}>
                      {lead.initials}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#1A1714] leading-tight">{lead.name}</p>
                      <p className="text-[10px] text-[#C4B9A8] font-mono">{lead.course}</p>
                    </div>
                  </div>
                  <span className={"inline-flex items-center gap-1 text-[10px] font-medium border rounded-full px-2 py-0.5 shrink-0 " + lead.badge}>
                    <span className={"w-1.5 h-1.5 rounded-full " + lead.dot} />
                    {lead.score}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-[10px] text-[#9B8E7E] italic leading-relaxed mb-2 pl-8">
                  "{lead.quote}"
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pl-8">
                  {lead.routedTo ? (
                    <p className="text-[10px] text-[#C4B9A8]">
                      Routed to{" "}
                      <span className="text-[#1A1714] font-medium">{lead.routedTo}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-[#C4B9A8]">
                      {lead.score === "Warm" ? "Awaiting follow-up" : "Nurture sequence"}
                    </p>
                  )}
                  <span className={"text-[10px] font-mono " + lead.timeColor}>
                    {lead.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="px-4 py-2.5 border-t border-[#F0EDE6] bg-[#FAFAF8] flex items-center justify-between">
          <p className="text-[10px] font-mono text-[#C4B9A8]">3 leads scored today</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] font-mono text-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />1 hot
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-amber-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />1 warm
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />1 cold
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
