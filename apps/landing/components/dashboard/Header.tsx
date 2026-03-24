"use client";

import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

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

  const page = pageTitles[pathname] ?? { title: "Inboq", sub: "" };

  return (
    <header className="sticky top-0 z-10 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-[#E8E2D9] px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex flex-col">

          {/* Workspace (subtle) */}
          <p className="text-[11px] font-mono text-[#9B8E7E] mb-0.5">
            {company?.name || "Workspace"}
          </p>

          {/* Page title (primary) */}
          <h2
            className="text-lg sm:text-xl text-[#1A1714] leading-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            {page.title}
          </h2>

          {/* Subtitle */}
          <p className="text-xs text-[#9B8E7E] mt-0.5 hidden sm:block">
            {page.sub}
          </p>
        </div>

        {/* RIGHT (empty for now — keep minimal) */}
        <div />
      </div>
    </header>
  );
}