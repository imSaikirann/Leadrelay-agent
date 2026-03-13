"use client";

import { useAppStore } from "@/store/useAppStore";
import { getLeadsByIndustry, getAnalytics } from "@/lib/industry-data";

// ─── Simple bar chart ─────────────────────────────────────────────────────────

function BarChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-3 h-32">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-[#1A1714]">{d.value}</span>
          <div className="w-full rounded-t-lg transition-all duration-500" style={{
            height: `${(d.value / max) * 100}%`,
            background: d.color,
            minHeight: "4px",
          }} />
          <span className="text-[10px] font-mono text-[#9B8E7E]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────

function DonutChart({
  hot,
  warm,
  cold,
}: {
  hot: number;
  warm: number;
  cold: number;
}) {
  const total = hot + warm + cold;
  const hotPct = (hot / total) * 100;
  const warmPct = (warm / total) * 100;
  const coldPct = (cold / total) * 100;

  // SVG donut
  const r = 40;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * r;

  const hotDash = (hotPct / 100) * circumference;
  const warmDash = (warmPct / 100) * circumference;
  const coldDash = (coldPct / 100) * circumference;

  const hotOffset = 0;
  const warmOffset = -hotDash;
  const coldOffset = -(hotDash + warmDash);

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
        {/* Background */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8E2D9" strokeWidth="12" />
        {/* Hot */}
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke="#ef4444" strokeWidth="12"
          strokeDasharray={`${hotDash} ${circumference}`}
          strokeDashoffset={hotOffset}
          strokeLinecap="butt"
        />
        {/* Warm */}
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke="#f59e0b" strokeWidth="12"
          strokeDasharray={`${warmDash} ${circumference}`}
          strokeDashoffset={warmOffset}
          strokeLinecap="butt"
        />
        {/* Cold */}
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke="#3b82f6" strokeWidth="12"
          strokeDasharray={`${coldDash} ${circumference}`}
          strokeDashoffset={coldOffset}
          strokeLinecap="butt"
        />
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {[
          { label: "Hot", pct: hotPct, color: "bg-red-500", value: hot },
          { label: "Warm", pct: warmPct, color: "bg-amber-400", value: warm },
          { label: "Cold", pct: coldPct, color: "bg-blue-400", value: cold },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
            <span className="text-xs text-[#9B8E7E] font-mono w-8">{item.label}</span>
            <span className="text-xs font-mono text-[#1A1714]">{item.value}</span>
            <span className="text-[10px] text-[#C4B9A8] font-mono">
              {Math.round(item.pct)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Weekly trend (mock data) ─────────────────────────────────────────────────

const weeklyData = [
  { day: "Mon", hot: 2, warm: 3, cold: 4 },
  { day: "Tue", hot: 4, warm: 2, cold: 3 },
  { day: "Wed", hot: 1, warm: 5, cold: 2 },
  { day: "Thu", hot: 6, warm: 3, cold: 1 },
  { day: "Fri", hot: 3, warm: 4, cold: 3 },
  { day: "Sat", hot: 2, warm: 1, cold: 2 },
  { day: "Sun", hot: 5, warm: 2, cold: 1 },
];

function WeeklyChart() {
  const maxTotal = Math.max(...weeklyData.map((d) => d.hot + d.warm + d.cold));

  return (
    <div className="flex items-end gap-2 h-36">
      {weeklyData.map((d) => {
        const total = d.hot + d.warm + d.cold;
        const hotH = (d.hot / maxTotal) * 100;
        const warmH = (d.warm / maxTotal) * 100;
        const coldH = (d.cold / maxTotal) * 100;

        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col rounded-t-lg overflow-hidden" style={{ height: `${(total / maxTotal) * 120}px` }}>
              <div style={{ height: `${coldH}%`, background: "#3b82f6" }} />
              <div style={{ height: `${warmH}%`, background: "#f59e0b" }} />
              <div style={{ height: `${hotH}%`, background: "#ef4444" }} />
            </div>
            <span className="text-[10px] font-mono text-[#9B8E7E]">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Response time breakdown ──────────────────────────────────────────────────

const responseData = [
  { range: "< 15 min", leads: 8, color: "#22c55e" },
  { range: "15–30 min", leads: 5, color: "#f59e0b" },
  { range: "30–60 min", leads: 3, color: "#f97316" },
  { range: "> 1 hour", leads: 2, color: "#ef4444" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const company = useAppStore((s) => s.company);
  const industry = company?.industry ?? "edtech";
  const analytics = getAnalytics(industry);
  const leads = getLeadsByIndustry(industry);

  const hotLeads = leads.filter((l) => l.score === "Hot");
  const assignedHot = hotLeads.filter((l) => l.assignedTo).length;
  const avgConv = Math.round((analytics.hot / analytics.total) * 100);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Analytics
        </h1>
        <p className="text-sm text-[#9B8E7E] mt-1">
          Lead quality and team performance overview.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Leads", value: analytics.total, sub: "this month", color: "text-[#1A1714]" },
          { label: "Hot Rate", value: `${avgConv}%`, sub: "of all leads", color: "text-red-600" },
          { label: "Hot Assigned", value: `${assignedHot}/${hotLeads.length}`, sub: "routed to reps", color: "text-[#D4622A]" },
          { label: "Avg Score Time", value: "1.8s", sub: "per lead", color: "text-green-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4">
            <p className="text-xs text-[#9B8E7E] font-mono mb-1">{k.label}</p>
            <p className={`text-2xl sm:text-3xl font-mono font-medium ${k.color}`}>
              {k.value}
            </p>
            <p className="text-[10px] text-[#C4B9A8] font-mono mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">

        {/* Lead distribution donut */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
          <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-6">
            Lead distribution
          </p>
          <DonutChart
            hot={analytics.hot}
            warm={analytics.warm}
            cold={analytics.cold}
          />
        </div>

        {/* Weekly trend stacked bar */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest">
              Weekly trend
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: "Hot", color: "bg-red-500" },
                { label: "Warm", color: "bg-amber-400" },
                { label: "Cold", color: "bg-blue-400" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${l.color}`} />
                  <span className="text-[10px] font-mono text-[#9B8E7E]">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <WeeklyChart />
        </div>

      </div>

      {/* Bottom row */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Response time */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
          <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-6">
            Response time breakdown
          </p>
          <div className="flex flex-col gap-3">
            {responseData.map((r) => {
              const max = Math.max(...responseData.map((d) => d.leads));
              return (
                <div key={r.range} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#9B8E7E] w-20 shrink-0">
                    {r.range}
                  </span>
                  <div className="flex-1 h-2 bg-[#E8E2D9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(r.leads / max) * 100}%`,
                        background: r.color,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#1A1714] w-4 shrink-0">
                    {r.leads}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] font-mono text-[#C4B9A8] mt-4">
            Faster response = higher conversion. Target &lt;15 min for hot leads.
          </p>
        </div>

        {/* Lead source / industry breakdown */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
          <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-6">
            Leads by interest
          </p>
          <BarChart
            data={leads.map((l) => ({
              label: l.interest.split(" ").slice(0, 2).join(" "),
              value: 1,
              color:
                l.score === "Hot"
                  ? "#ef4444"
                  : l.score === "Warm"
                  ? "#f59e0b"
                  : "#3b82f6",
            })).reduce((acc: { label: string; value: number; color: string }[], curr) => {
              const existing = acc.find((a) => a.label === curr.label);
              if (existing) {
                existing.value += 1;
              } else {
                acc.push({ ...curr });
              }
              return acc;
            }, [])}
          />
        </div>

      </div>

    </div>
  );
}