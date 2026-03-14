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
    timeColor: "text-[#D4622A]",
    bar: "bg-red-400",
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
    timeColor: "text-[#D4622A]",
    bar: "bg-amber-300",
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
    dot: "bg-blue-400",
    timeColor: "text-[#C4B9A8]",
    bar: "bg-blue-300",
  },
];

export default function HeroPreview() {
  const [visible, setVisible] = useState<boolean[]>([false, false, false]);
  const [barWidth, setBarWidth] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    leads.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setTimeout(() => {
          setBarWidth((prev) => {
            const next = [...prev];
            next[i] = i === 0 ? 85 : i === 1 ? 52 : 20;
            return next;
          });
        }, 300);
      }, 400 + i * 350);
    });
  }, []);

  return (
    <div className="relative">

      {/* Card stack */}
      <div className="absolute inset-x-4 top-3 h-full bg-[#E8E2D9] rounded-2xl -z-10" />
      <div className="absolute inset-x-2 top-1.5 h-full bg-[#F0EDE6] rounded-2xl -z-10" />

      {/* Main card */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-sm">

        {/* Topbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0EDE6] bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium text-[#1A1714]">
              inb<span className="text-[#D4622A]">oq</span>
            </span>
            <span className="font-mono text-[10px] text-[#C4B9A8]">/ leads</span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            live
          </span>
        </div>

        {/* Lead rows */}
        <div className="divide-y divide-[#F0EDE6]">
          {leads.map((lead, i) => (
            <div
              key={lead.name}
              className="px-4 py-3.5 transition-all duration-500"
              style={{
                opacity: visible[i] ? 1 : 0,
                transform: visible[i] ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={"w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 " + lead.avatar}
                  >
                    {lead.initials}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1A1714]">{lead.name}</p>
                    <p className="text-[10px] text-[#C4B9A8] font-mono">{lead.course}</p>
                  </div>
                </div>
                <span
                  className={"inline-flex items-center gap-1 text-[10px] font-medium border rounded-full px-2 py-0.5 shrink-0 " + lead.badge}
                >
                  <span className={"w-1.5 h-1.5 rounded-full " + lead.dot} />
                  {lead.score}
                </span>
              </div>

              {/* Quote */}
              <div className="bg-[#F7F5F2] rounded-lg px-3 py-2 mb-2.5">
                <p className="text-[10px] text-[#9B8E7E] italic leading-relaxed">
                  "{lead.quote}"
                </p>
              </div>

              {/* Intent bar */}
              <div className="mb-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono text-[#C4B9A8] uppercase tracking-widest">
                    intent
                  </span>
                  <span className="text-[9px] font-mono text-[#C4B9A8]">
                    {barWidth[i]}%
                  </span>
                </div>
                <div className="h-1 bg-[#F0EDE6] rounded-full overflow-hidden">
                  <div
                    className={"h-full rounded-full transition-all duration-700 ease-out " + lead.bar}
                    style={{ width: barWidth[i] + "%" }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                {lead.routedTo ? (
                  <p className="text-[10px] text-[#C4B9A8]">
                    Routed to{" "}
                    <span className="text-[#1A1714] font-medium">{lead.routedTo}</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-[#C4B9A8]">
                    {lead.score === "Warm" ? "In CRM — awaiting follow-up" : "Nurture sequence"}
                  </p>
                )}
                <span className={"text-[10px] font-mono " + lead.timeColor}>
                  {lead.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="px-4 py-3 border-t border-[#F0EDE6] bg-[#FAF9F6] flex items-center justify-between">
          <p className="text-[10px] font-mono text-[#C4B9A8]">3 leads today</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-red-500">1 hot</span>
            <span className="text-[10px] font-mono text-amber-500">1 warm</span>
            <span className="text-[10px] font-mono text-blue-400">1 cold</span>
          </div>
        </div>

      </div>
    </div>
  );
}