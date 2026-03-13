"use client";

import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Bell } from "lucide-react";

const pageTitles: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Dashboard", sub: "Overview of your leads today" },
  "/dashboard/leads": { title: "Leads", sub: "All inbound leads scored by AI" },
  "/dashboard/analytics": { title: "Analytics", sub: "Lead quality and team performance" },
  "/dashboard/team": { title: "Team", sub: "Manage reps and assignments" },
  "/dashboard/form": { title: "Embed Form", sub: "Drop your lead form anywhere" },
  "/dashboard/settings": { title: "Settings", sub: "Manage your workspace" },
};

export default function Header() {
  const pathname = usePathname();
  const company = useAppStore((s) => s.company);

  const page = pageTitles[pathname] ?? { title: "LeadIQ", sub: "" };

  const initials = company?.name
    ? company.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "LQ";

  return (
    <header className="sticky top-0 z-10 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-[#E8E2D9] px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between gap-4">

        {/* Page title */}
        <div>
          <h2
            className="text-base sm:text-lg font-medium text-[#1A1714] leading-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            {page.title}
          </h2>
          <p className="text-xs text-[#9B8E7E] hidden sm:block mt-0.5">
            {page.sub}
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Notification bell */}
          <button className="relative w-8 h-8 flex items-center justify-center rounded-xl border border-[#E8E2D9] bg-white hover:border-[#C4B9A8] transition-colors">
            <Bell className="w-4 h-4 text-[#9B8E7E]" />
            {/* Red dot */}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D4622A]" />
          </button>

          {/* Company avatar + name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1A1714] flex items-center justify-center shrink-0">
              <span className="text-xs font-mono font-medium text-[#FAF9F6]">
                {initials}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-[#1A1714] leading-tight">
                {company?.name ?? "Your Company"}
              </p>
              <p className="text-[10px] text-[#9B8E7E] font-mono capitalize">
                {company?.industry ?? "—"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}