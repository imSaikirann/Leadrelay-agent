"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { industries } from "@/lib/industry-data";
import { CustomButton } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";

// ─── Types ────────────────────────────────────────────────────────────────────

type Company = {
  id: string;
  name: string;
  email: string;
  website?: string | null;
  industry: string;
  size?: string | null;
};

type Plan = {
  name: string;
  priceMonthly: number;
  trialDays: number;
  features: string[];
};

type Subscription = {
  status: string;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
  daysLeftInTrial: number | null;
  plan: Plan | null;
  lastPayment: {
    amount: number;
    status: string;
    paidAt: string | null;
  } | null;
};

const companySizes = [
  { value: "1-10", label: "1–10" },
  { value: "11-50", label: "11–50" },
  { value: "51-200", label: "51–200" },
  { value: "201+", label: "201+" },
];

const FEATURE_LABELS: Record<string, string> = {
  ai_scoring: "AI Lead Scoring",
  excel_export: "Excel Export",
  team_management: "Team Management",
  lead_assignment: "Lead Assignment",
};

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  trial:     { label: "Trial",     dot: "bg-amber-400", badge: "bg-amber-50 border-amber-200 text-amber-700" },
  active:    { label: "Active",    dot: "bg-green-500", badge: "bg-green-50 border-green-200 text-green-700" },
  past_due:  { label: "Past Due",  dot: "bg-red-400",   badge: "bg-red-50 border-red-200 text-red-600" },
  cancelled: { label: "Cancelled", dot: "bg-gray-300",  badge: "bg-gray-50 border-gray-200 text-gray-500" },
  expired:   { label: "Expired",   dot: "bg-red-400",   badge: "bg-red-50 border-red-200 text-red-600" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompanyProfileForm({
  company,
  subscription,
}: {
  company: Company;
  subscription: Subscription | null;
}) {
  const router = useRouter();

  // Form state
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");
  const [name, setName] = useState(company.name);
  const [email, setEmail] = useState(company.email);
  const [website, setWebsite] = useState(company.website ?? "");
  const [industry, setIndustry] = useState(company.industry);
  const [size, setSize] = useState(company.size ?? "");

  // Checkout state
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // ── Save company details ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    setSaved(false);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website, industry, size }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Upgrade / Reactivate → Dodo checkout ─────────────────────────────────
  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to start checkout");
      if (!data.url) throw new Error("No checkout URL returned");

      // Redirect to Dodo hosted checkout
      window.location.href = data.url;
    } catch (err: any) {
      setCheckoutError(err.message);
      setCheckoutLoading(false);
    }
  };

  const sub = subscription;
  const plan = sub?.plan;
  const statusCfg = statusConfig[sub?.status ?? ""] ?? statusConfig.expired;
  const isTrialExpiring = sub?.status === "trial" && (sub.daysLeftInTrial ?? 99) <= 3;
  const needsUpgrade =
    sub?.status === "expired" ||
    sub?.status === "cancelled" ||
    sub?.status === "past_due" ||
    isTrialExpiring;

  // Label for the upgrade button
  const upgradeLabel =
    checkoutLoading
      ? "Redirecting..."
      : sub?.status === "trial"
      ? "Upgrade now"
      : "Reactivate";

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-6 py-1">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-sm text-[#9B8E7E] font-mono mb-8 hover:text-[#1A1714] transition-colors"
        >
          ← back
        </button>

        <h1
          className="text-3xl text-[#1A1714] mb-1"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Company Profile
        </h1>
        <p className="text-sm text-[#9B8E7E] mb-10">
          Update your company details anytime.
        </p>

        {/* ── Subscription Card ──────────────────────────────────────────── */}
        {sub && plan && (
          <div className={`mb-8 rounded-2xl border overflow-hidden ${needsUpgrade ? "border-[#D4622A]" : "border-[#E8E2D9]"}`}>

            {/* Warning banner */}
            {needsUpgrade && (
              <div className="bg-[#D4622A] px-5 py-2.5 flex items-center gap-3">
                <p className="text-xs text-white font-mono">
                  {sub.status === "trial" && isTrialExpiring
                    ? `⚠️ Trial ends in ${sub.daysLeftInTrial} day${sub.daysLeftInTrial === 1 ? "" : "s"} — upgrade to keep access.`
                    : sub.status === "expired"
                    ? "⚠️ Your trial has expired. Upgrade to continue."
                    : sub.status === "past_due"
                    ? "⚠️ Payment overdue. Update your billing to avoid interruption."
                    : "⚠️ Subscription cancelled. Reactivate to continue."}
                </p>
              </div>
            )}

            <div className="bg-white px-5 py-5">
              {/* Plan header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className="text-lg text-[#1A1714]"
                      style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                    >
                      {plan.name} Plan
                    </p>
                    <span className={`inline-flex items-center gap-1.5 border text-xs font-mono rounded-full px-2.5 py-0.5 ${statusCfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-2xl font-mono font-medium text-[#1A1714]">
                    ₹{plan.priceMonthly.toLocaleString("en-IN")}
                    <span className="text-sm text-[#9B8E7E] font-normal">/month</span>
                  </p>
                </div>

                {/* Upgrade button — wired to /api/checkout */}
                {sub.status !== "active" && (
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={handleUpgrade}
                      disabled={checkoutLoading}
                      className="shrink-0 bg-[#D4622A] text-white text-xs font-mono px-4 py-2.5 rounded-xl hover:bg-[#C05520] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {upgradeLabel}
                    </button>
                    {checkoutError && (
                      <p className="text-[10px] text-red-500 font-mono text-right max-w-[160px]">
                        {checkoutError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Trial progress bar */}
              {sub.status === "trial" && sub.trialEnd && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-xs text-[#9B8E7E] font-mono">Trial period</p>
                    <p className="text-xs font-mono text-[#1A1714]">
                      {sub.daysLeftInTrial} of {plan.trialDays} days left
                    </p>
                  </div>
                  <div className="h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(4, ((sub.daysLeftInTrial ?? 0) / plan.trialDays) * 100)}%`,
                        background: isTrialExpiring ? "#D4622A" : "#16A34A",
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-[#9B8E7E] font-mono mt-1.5">
                    Expires{" "}
                    {new Date(sub.trialEnd).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* Active billing period */}
              {sub.status === "active" && sub.currentPeriodEnd && (
                <div className="mb-4">
                  <p className="text-xs text-[#9B8E7E] font-mono">
                    Next billing date:{" "}
                    <span className="text-[#1A1714]">
                      {new Date(sub.currentPeriodEnd).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              )}

              {/* Features */}
              {plan.features.length > 0 && (
                <div className="pt-4 border-t border-[#F0EDE6]">
                  <p className="text-[10px] text-[#9B8E7E] font-mono uppercase tracking-wider mb-2.5">
                    Included features
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {plan.features.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center gap-1 text-[10px] font-mono bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2.5 py-1 text-[#9B8E7E]"
                      >
                        <span className="text-green-600">✓</span>
                        {FEATURE_LABELS[f] ?? f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Last payment */}
              {sub.lastPayment && (
                <div className="pt-4 mt-4 border-t border-[#F0EDE6] flex items-center justify-between">
                  <p className="text-xs text-[#9B8E7E] font-mono">Last payment</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#1A1714]">
                      ₹{sub.lastPayment.amount.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        sub.lastPayment.status === "success"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-red-50 border-red-200 text-red-600"
                      }`}
                    >
                      {sub.lastPayment.status}
                    </span>
                    {sub.lastPayment.paidAt && (
                      <span className="text-[10px] text-[#9B8E7E] font-mono">
                        {new Date(sub.lastPayment.paidAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No subscription state */}
        {!sub && (
          <div className="mb-8 border border-dashed border-[#E8E2D9] rounded-2xl px-5 py-6 text-center">
            <p className="text-sm text-[#9B8E7E] font-mono mb-3">No active subscription found.</p>
            <button
              onClick={handleUpgrade}
              disabled={checkoutLoading}
              className="text-xs text-[#D4622A] font-mono hover:underline disabled:opacity-60"
            >
              {checkoutLoading ? "Redirecting..." : "View plans →"}
            </button>
            {checkoutError && (
              <p className="text-[10px] text-red-500 font-mono mt-2">{checkoutError}</p>
            )}
          </div>
        )}

        {/* ── Company Form ───────────────────────────────────────────────── */}
        <div className="pt-2">
          <p
            className="text-lg text-[#1A1714] mb-6"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Company details
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#9B8E7E]">Company name</label>
              <CustomInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
  
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#9B8E7E]">Company email</label>
              <CustomInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
               
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#9B8E7E]">Website</label>
              <CustomInput
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
               
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#9B8E7E]">Industry</label>
              <div className="relative">
                <div
                  className="absolute -inset-[1.5px] rounded-xl"
                  style={{
                    background: industry
                      ? "linear-gradient(135deg, #D4622A, #F5C27A)"
                      : "linear-gradient(135deg, #E8E2D9, #E8E2D9)",
                  }}
                />
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                  className="relative w-full bg-[#FAF9F6] rounded-xl px-4 py-3.5 text-sm text-[#1A1714] font-mono outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select your industry</option>
                  {industries.map((ind) => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4B9A8] pointer-events-none">↓</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#9B8E7E]">Team size</label>
              <div className="grid grid-cols-4 gap-2">
                {companySizes.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSize(s.value)}
                    className="py-3 px-2 rounded-xl text-sm font-mono border transition-all"
                    style={{
                      background: size === s.value ? "#D4622A" : "#FAF9F6",
                      color: size === s.value ? "#fff" : "#1A1714",
                      borderColor: size === s.value ? "#D4622A" : "#E8E2D9",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {formError && <p className="text-xs text-red-500 font-mono">{formError}</p>}
            {saved && <p className="text-xs text-green-600 font-mono">✓ Changes saved</p>}

            <div className="mt-2">
              <CustomButton type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </CustomButton>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}