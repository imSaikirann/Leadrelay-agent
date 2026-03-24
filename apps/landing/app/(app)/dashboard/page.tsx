"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import LeadCard from "@/components/dashboard/leads/LeadCard";

type DashboardData = {
  stats: {
    total: number;
    hot: number;
    warm: number;
    cold: number;
    conversionRate: number;
  };
  recentLeads: any[];
};

export default function DashboardPage() {
  const company = useAppStore((s) => s.company);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const fetchDashboard = async () => {
  
    try {
      setLoading(true);

      const res = await fetch(`/api/dashboard`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to load");

      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 🔥 Optional: polling (real-time feel)
  useEffect(() => {
 

    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="px-6 py-10 text-sm font-mono text-[#9B8E7E]">
        Loading dashboard...
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="px-6 py-10 text-sm font-mono text-red-500">
        {error}
      </div>
    );
  }

  // 🧠 Safe fallback
  const stats = data
    ? [
        { label: "Total Leads", value: data.stats.total, color: "text-[#1A1714]" },
        { label: "Hot 🔥", value: data.stats.hot, color: "text-red-600" },
        { label: "Warm 🟡", value: data.stats.warm, color: "text-amber-600" },
        { label: "Cold 🔵", value: data.stats.cold, color: "text-blue-600" },
        {
          label: "Hot Rate",
          value: `${data.stats.conversionRate}%`,
          color: "text-[#D4622A]",
        },
      ]
    : [];

  const leads = data?.recentLeads ?? [];

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
            className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4 hover:border-[#C4B9A8] transition-colors"
          >
            <p className="text-xs text-[#9B8E7E] font-mono mb-1">
              {stat.label}
            </p>
            <p
              className={`text-2xl sm:text-3xl font-medium font-mono ${stat.color}`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-[#1A1714]">
          Recent leads
        </h2>
        <a
          href="/dashboard/leads"
          className="text-xs text-[#D4622A] hover:underline"
        >
          View all →
        </a>
      </div>

      <div className="flex flex-col gap-3">
        {leads.length === 0 ? (
          <div className="text-sm text-[#9B8E7E] font-mono py-6 text-center border border-dashed border-[#E8E2D9] rounded-xl">
            No leads yet
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))
        )}
      </div>
    </div>
  );
}