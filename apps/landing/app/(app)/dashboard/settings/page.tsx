"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { industries } from "@/lib/industry-data";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomButton } from "@/components/common/CustomButton";

export default function SettingsPage() {
  const router = useRouter();
  const company = useAppStore((s) => s.company);
  const setCompany = useAppStore((s) => s.setCompany);
  const reset = useAppStore((s) => s.reset);

  const [name, setName] = useState(company?.name ?? "");
  const [email, setEmail] = useState(company?.email ?? "");
  const [industry, setIndustry] = useState(company?.industry ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCompany({ name, email, industry });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDeleteAccount = () => {
    reset();
    router.push("/signup");
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-2xl">

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Settings
        </h1>
        <p className="text-sm text-[#9B8E7E] mt-1">
          Manage your workspace and preferences.
        </p>
      </div>

      {/* Workspace settings */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 mb-4">
        <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-6">
          Workspace
        </p>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-mono text-[#9B8E7E] mb-2 block">
              Company name
            </label>
            <CustomInput
              type="text"
              placeholder="Company name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#9B8E7E] mb-2 block">
              Company email
            </label>
            <CustomInput
              type="email"
              placeholder="company@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#9B8E7E] mb-2 block">
              Industry
            </label>
            <div className="relative">
              <div
                className="absolute -inset-[1.5px] rounded-xl transition-all duration-300"
                style={{
                  background: industry
                    ? "linear-gradient(135deg, #D4622A, #F5C27A)"
                    : "linear-gradient(135deg, #E8E2D9, #E8E2D9)",
                  opacity: industry ? 1 : 0.6,
                }}
              />
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="relative w-full bg-[#FAF9F6] rounded-xl px-4 py-3.5 text-sm text-[#1A1714] font-mono outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled>Select industry</option>
                {industries.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4B9A8] pointer-events-none text-xs">
                ↓
              </span>
            </div>
          </div>

          <div className="pt-2">
            <CustomButton type="submit" className="w-full sm:w-auto">
              {saved ? "Saved ✓" : "Save changes"}
            </CustomButton>
          </div>
        </form>
      </div>

      {/* Plan */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 mb-4">
        <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-6">
          Plan
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-[#1A1714]">Free Plan</p>
              <span className="text-[10px] font-mono bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2 py-0.5 text-[#9B8E7E]">
                Current
              </span>
            </div>
            <p className="text-xs text-[#9B8E7E]">
              50 leads/month · 1 team member · Basic scoring
            </p>
          </div>
          <button className="self-start sm:self-auto text-xs font-mono bg-[#1A1714] text-[#FAF9F6] rounded-xl px-4 py-2 hover:bg-[#2C2825] transition-colors whitespace-nowrap">
            Upgrade to Pro →
          </button>
        </div>

        {/* Usage bar */}
        <div className="mt-5 pt-5 border-t border-[#E8E2D9]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-mono text-[#9B8E7E]">Leads used this month</p>
            <p className="text-xs font-mono text-[#1A1714]">23 / 50</p>
          </div>
          <div className="h-2 bg-[#E8E2D9] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: "46%",
                background: "linear-gradient(90deg, #D4622A, #F5C27A)",
              }}
            />
          </div>
          <p className="text-[10px] text-[#C4B9A8] font-mono mt-2">
            27 leads remaining · resets in 8 days
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 mb-4">
        <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-6">
          Notifications
        </p>
        <div className="flex flex-col gap-4">
          {[
            { label: "Hot lead alert", sub: "Get notified instantly when a hot lead comes in", default: true },
            { label: "Daily summary", sub: "Receive a daily report of lead activity", default: true },
            { label: "Weekly report", sub: "Monday morning performance email", default: false },
            { label: "Unassigned leads", sub: "Alert when hot leads go unassigned for 30 min", default: true },
          ].map((item) => (
            <NotificationToggle key={item.label} {...item} />
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-100 rounded-2xl p-6">
        <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-6">
          Danger zone
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#1A1714]">Reset workspace</p>
            <p className="text-xs text-[#9B8E7E]">
              Clears all data and takes you back to onboarding.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="self-start sm:self-auto text-xs font-mono border border-red-200 text-red-500 rounded-xl px-4 py-2 hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            Reset workspace
          </button>
        </div>
      </div>

    </div>
  );
}

// ─── Notification Toggle ──────────────────────────────────────────────────────

function NotificationToggle({
  label,
  sub,
  default: defaultVal,
}: {
  label: string;
  sub: string;
  default: boolean;
}) {
  const [enabled, setEnabled] = useState(defaultVal);

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-[#1A1714]">{label}</p>
        <p className="text-xs text-[#9B8E7E]">{sub}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${
          enabled ? "bg-[#1A1714]" : "bg-[#E8E2D9]"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}