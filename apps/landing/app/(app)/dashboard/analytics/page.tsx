// app/(dashboard)/analytics/page.tsx
"use client";

import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type KPIs = {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  unranked: number;
  hotAssigned: number;
  hotTotal: number;
  avgScoreSeconds: string;
  hotRate: number;
};

type TrendPoint = { label: string; hot: number; warm: number; cold: number };
type ResponseBucket = { range: string; leads: number; color: string };
type Period = "daily" | "weekly" | "monthly";

// ── Charts (same as before, no changes needed) ────────────────────────────────

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
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
          <span className="text-[10px] font-mono text-[#9B8E7E] truncate max-w-full">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ hot, warm, cold }: { hot: number; warm: number; cold: number }) {
  const total = hot + warm + cold || 1;
  const hotPct = (hot / total) * 100;
  const warmPct = (warm / total) * 100;
  const coldPct = (cold / total) * 100;
  const r = 40, cx = 50, cy = 50;
  const circumference = 2 * Math.PI * r;
  const hotDash = (hotPct / 100) * circumference;
  const warmDash = (warmPct / 100) * circumference;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8E2D9" strokeWidth="12" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth="12"
          strokeDasharray={`${hotDash} ${circumference}`} strokeDashoffset={0} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f59e0b" strokeWidth="12"
          strokeDasharray={`${warmDash} ${circumference}`} strokeDashoffset={-hotDash} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3b82f6" strokeWidth="12"
          strokeDasharray={`${(coldPct / 100) * circumference} ${circumference}`}
          strokeDashoffset={-(hotDash + warmDash)} />
      </svg>
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
            <span className="text-[10px] text-[#C4B9A8] font-mono">{Math.round(item.pct)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart({ data }: { data: TrendPoint[] }) {
  const maxTotal = Math.max(...data.map((d) => d.hot + d.warm + d.cold), 1);
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((d, i) => {
        const total = d.hot + d.warm + d.cold;
        const hotH = (d.hot / maxTotal) * 100;
        const warmH = (d.warm / maxTotal) * 100;
        const coldH = (d.cold / maxTotal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col rounded-t-lg overflow-hidden"
              style={{ height: `${(total / maxTotal) * 120}px` }}>
              <div style={{ height: `${coldH}%`, background: "#3b82f6" }} />
              <div style={{ height: `${warmH}%`, background: "#f59e0b" }} />
              <div style={{ height: `${hotH}%`, background: "#ef4444" }} />
            </div>
            <span className="text-[10px] font-mono text-[#9B8E7E] truncate max-w-full">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-[#E8E2D9] animate-pulse rounded-lg ${className}`} />;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [responseTimes, setResponseTimes] = useState<ResponseBucket[]>([]);
  const [period, setPeriod] = useState<Period>("daily");
  const [loading, setLoading] = useState(true);

  // Fetch KPIs once
  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setKpis)
      .catch(console.error);

    fetch("/api/analytics/response-time")
      .then((r) => r.json())
      .then(setResponseTimes)
      .catch(console.error);
  }, []);

  // Fetch trend on period change
  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics/trend?period=${period}`)
      .then((r) => r.json())
      .then((d) => { setTrend(d.trend); setLoading(false); })
      .catch(console.error);
  }, [period]);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          Analytics
        </h1>
        <p className="text-sm text-[#9B8E7E] mt-1">Lead quality and team performance overview.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {kpis ? [
          { label: "Total Leads", value: kpis.total, sub: "all time", color: "text-[#1A1714]" },
          { label: "Hot Rate", value: `${kpis.hotRate}%`, sub: "of all leads", color: "text-red-600" },
          { label: "Hot Assigned", value: `${kpis.hotAssigned}/${kpis.hotTotal}`, sub: "routed to reps", color: "text-[#D4622A]" },
          { label: "Avg Score Time", value: `${kpis.avgScoreSeconds}s`, sub: "per lead", color: "text-green-600" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4">
            <p className="text-xs text-[#9B8E7E] font-mono mb-1">{k.label}</p>
            <p className={`text-2xl sm:text-3xl font-mono font-medium ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-[#C4B9A8] font-mono mt-1">{k.sub}</p>
          </div>
        )) : Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-2 w-24" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">

        {/* Donut */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
          <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-6">
            Lead distribution
          </p>
          {kpis
            ? <DonutChart hot={kpis.hot} warm={kpis.warm} cold={kpis.cold} />
            : <Skeleton className="h-28 w-full" />}
        </div>

        {/* Trend */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest">Trend</p>
            {/* Period toggle */}
            <div className="flex bg-[#F5F0EA] rounded-lg p-0.5 gap-0.5">
              {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`text-[10px] font-mono px-2 py-1 rounded-md transition-all ${
                    period === p
                      ? "bg-white text-[#1A1714] shadow-sm"
                      : "text-[#9B8E7E] hover:text-[#1A1714]"
                  }`}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {loading
            ? <Skeleton className="h-36 w-full" />
            : trend.length > 0
              ? <TrendChart data={trend} />
              : <p className="text-xs font-mono text-[#C4B9A8] h-36 flex items-center justify-center">No data yet</p>
          }
        </div>

      </div>

      {/* Bottom row */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Response time */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
          <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-6">
            Response time breakdown
          </p>
          {responseTimes.length > 0 ? (
            <div className="flex flex-col gap-3">
              {responseTimes.map((r) => {
                const max = Math.max(...responseTimes.map((d) => d.leads), 1);
                return (
                  <div key={r.range} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#9B8E7E] w-20 shrink-0">{r.range}</span>
                    <div className="flex-1 h-2 bg-[#E8E2D9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(r.leads / max) * 100}%`, background: r.color }} />
                    </div>
                    <span className="text-xs font-mono text-[#1A1714] w-4 shrink-0">{r.leads}</span>
                  </div>
                );
              })}
              <p className="text-[10px] font-mono text-[#C4B9A8] mt-2">
                Target &lt;15 min for hot leads.
              </p>
            </div>
          ) : <Skeleton className="h-32 w-full" />}
        </div>

        {/* Leads by rank — from real data */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
          <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-6">
            Leads by rank
          </p>
          {kpis ? (
            <BarChart data={[
              { label: "Hot", value: kpis.hot, color: "#ef4444" },
              { label: "Warm", value: kpis.warm, color: "#f59e0b" },
              { label: "Cold", value: kpis.cold, color: "#3b82f6" },
              { label: "Unranked", value: kpis.unranked, color: "#E8E2D9" },
            ]} />
          ) : <Skeleton className="h-32 w-full" />}
        </div>

      </div>
    </div>
  );
}