"use client";

import { useState } from "react";
import { getTeam } from "@/lib/industry-data";

const initialTeam = [
  {
    id: "1",
    name: "Arjun Mehta",
    email: "arjun@company.com",
    role: "Sales Rep",
    specialty: "EdTech",
    leads: 12,
    converted: 7,
    avgResponseTime: "18 min",
    status: "active",
    activeLeads: 3,
  },
  {
    id: "2",
    name: "Sneha Rao",
    email: "sneha@company.com",
    role: "Sales Rep",
    specialty: "SaaS",
    leads: 9,
    converted: 4,
    avgResponseTime: "42 min",
    status: "busy",
    activeLeads: 5,
  },
  {
    id: "3",
    name: "Dev Patel",
    email: "dev@company.com",
    role: "Sales Lead",
    specialty: "Real Estate",
    leads: 17,
    converted: 13,
    avgResponseTime: "9 min",
    status: "offline",
    activeLeads: 0,
  },
];

const statusConfig = {
  active: {
    label: "Active",
    dot: "bg-green-500",
    badge: "bg-green-50 border-green-200 text-green-700",
  },
  busy: {
    label: "Busy",
    dot: "bg-amber-400",
    badge: "bg-amber-50 border-amber-200 text-amber-700",
  },
  offline: {
    label: "Offline",
    dot: "bg-gray-300",
    badge: "bg-gray-50 border-gray-200 text-gray-500",
  },
};

export default function TeamPage() {
  const [team, setTeam] = useState(initialTeam);

  const toggleStatus = (id: string) => {
    setTeam((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const next =
          m.status === "active"
            ? "busy"
            : m.status === "busy"
            ? "offline"
            : "active";
        return { ...m, status: next };
      })
    );
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Team
          </h1>
          <p className="text-sm text-[#9B8E7E] mt-1">
            Track rep availability, response times and conversion rates.
          </p>
        </div>
        <button className="self-start sm:self-auto text-xs font-mono border border-[#E8E2D9] rounded-xl px-4 py-2 text-[#9B8E7E] hover:border-[#C4B9A8] hover:text-[#1A1714] transition-colors whitespace-nowrap">
          + Add member
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          {
            label: "Active now",
            value: team.filter((m) => m.status === "active").length,
            color: "text-green-600",
          },
          {
            label: "Total leads",
            value: team.reduce((a, m) => a + m.leads, 0),
            color: "text-[#1A1714]",
          },
          {
            label: "Converted",
            value: team.reduce((a, m) => a + m.converted, 0),
            color: "text-[#D4622A]",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4"
          >
            <p className="text-xs text-[#9B8E7E] font-mono mb-1">{s.label}</p>
            <p className={`text-2xl font-mono font-medium ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E2D9] bg-[#FAF9F6]">
              {[
                "Rep",
                "Specialty",
                "Status",
                "Active Leads",
                "Total Leads",
                "Converted",
                "Avg Response",
                "Conv. Rate",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-mono text-[#9B8E7E] whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {team.map((member) => {
              const s = statusConfig[member.status as keyof typeof statusConfig];
              const convRate = Math.round(
                (member.converted / member.leads) * 100
              );

              return (
                <tr
                  key={member.id}
                  className="border-b border-[#E8E2D9] last:border-0 hover:bg-[#FAF9F6] transition-colors"
                >
                  {/* Rep */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#E8E2D9] flex items-center justify-center text-xs font-medium text-[#1A1714]">
                          {member.name[0]}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${s.dot}`}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-[#1A1714] font-medium whitespace-nowrap">
                          {member.name}
                        </p>
                        <p className="text-[10px] text-[#9B8E7E] font-mono">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Specialty */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2.5 py-1 text-[#9B8E7E] font-mono whitespace-nowrap">
                      {member.specialty}
                    </span>
                  </td>

                  {/* Status — clickable toggle */}
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleStatus(member.id)}
                      className={`inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 transition-all ${s.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </button>
                  </td>

                  {/* Active leads */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-[#1A1714]">
                        {member.activeLeads}
                      </span>
                      {member.activeLeads >= 4 && (
                        <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5 font-mono">
                          overloaded
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Total leads */}
                  <td className="px-4 py-3.5 text-sm font-mono text-[#1A1714]">
                    {member.leads}
                  </td>

                  {/* Converted */}
                  <td className="px-4 py-3.5 text-sm font-mono text-[#1A1714]">
                    {member.converted}
                  </td>

                  {/* Avg response time */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-xs font-mono ${
                        parseInt(member.avgResponseTime) <= 15
                          ? "text-green-600"
                          : parseInt(member.avgResponseTime) <= 30
                          ? "text-amber-600"
                          : "text-red-500"
                      }`}
                    >
                      {member.avgResponseTime}
                    </span>
                  </td>

                  {/* Conversion rate */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4622A] rounded-full"
                          style={{ width: `${convRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-[#1A1714]">
                        {convRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {team.map((member) => {
          const s = statusConfig[member.status as keyof typeof statusConfig];
          const convRate = Math.round((member.converted / member.leads) * 100);

          return (
            <div
              key={member.id}
              className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4"
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-[#E8E2D9] flex items-center justify-center text-sm font-medium text-[#1A1714]">
                      {member.name[0]}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${s.dot}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1714]">{member.name}</p>
                    <p className="text-[10px] text-[#9B8E7E] font-mono">{member.role} · {member.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(member.id)}
                  className={`inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 ${s.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#E8E2D9]">
                {[
                  { label: "Leads", value: member.leads },
                  { label: "Converted", value: member.converted },
                  { label: "Active", value: member.activeLeads },
                  { label: "Resp.", value: member.avgResponseTime },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xs font-mono font-medium text-[#1A1714]">{s.value}</p>
                    <p className="text-[10px] text-[#9B8E7E]">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Conv rate bar */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8E2D9]">
                <p className="text-[10px] text-[#9B8E7E] font-mono shrink-0">Conv. rate</p>
                <div className="flex-1 h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4622A] rounded-full"
                    style={{ width: `${convRate}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono text-[#1A1714] shrink-0">{convRate}%</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}