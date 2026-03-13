"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getLeadsByIndustry } from "@/lib/industry-data";
import LeadCard from "@/components/dashboard/leads/LeadCard";

type Filter = "All" | "Hot" | "Warm" | "Cold";

export default function LeadsPage() {
  const company = useAppStore((s) => s.company);
  const leads = getLeadsByIndustry(company?.industry ?? "edtech");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered =
    filter === "All" ? leads : leads.filter((l) => l.score === filter);

  const filters: Filter[] = ["All", "Hot", "Warm", "Cold"];

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      <div className="mb-6 sm:mb-8">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          All Leads
        </h1>
        <p className="text-sm text-[#9B8E7E] mt-1">
          {leads.length} leads total · scored by AI
        </p>
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

      <div className="flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        ) : (
          <p className="text-sm text-[#9B8E7E] py-12 text-center">
            No {filter.toLowerCase()} leads yet.
          </p>
        )}
      </div>

    </div>
  );
}