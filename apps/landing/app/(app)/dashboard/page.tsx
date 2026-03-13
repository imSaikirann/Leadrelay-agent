"use client";

import { useAppStore } from "@/store/useAppStore";
import { getAnalytics, getLeadsByIndustry } from "@/lib/industry-data";
import LeadCard from "@/components/dashboard/leads/LeadCard";

export default function DashboardPage() {
  const company = useAppStore((s) => s.company);
  const industry = company?.industry ?? "edtech";
  const analytics = getAnalytics(industry);
  const leads = getLeadsByIndustry(industry).slice(0, 3);

  const stats = [
    { label: "Total Leads", value: analytics.total, color: "text-[#1A1714]" },
    { label: "Hot 🔥", value: analytics.hot, color: "text-red-600" },
    { label: "Warm 🟡", value: analytics.warm, color: "text-amber-600" },
    { label: "Cold 🔵", value: analytics.cold, color: "text-blue-600" },
    { label: "Hot Rate", value: `${analytics.conversionRate}%`, color: "text-[#D4622A]" },
  ];

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Good morning{company?.name ? `, ${company.name}` : ""} 👋
        </h1>
        <p className="text-sm text-[#9B8E7E] mt-1">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4"
          >
            <p className="text-xs text-[#9B8E7E] font-mono mb-1">{stat.label}</p>
            <p className={`text-2xl sm:text-3xl font-medium font-mono ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-[#1A1714]">Recent leads</h2>
        <a href="/dashboard/leads" className="text-xs text-[#D4622A] hover:underline">
          View all →
        </a>
      </div>

      <div className="flex flex-col gap-3">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>

    </div>
  );
}