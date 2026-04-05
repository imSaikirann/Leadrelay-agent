"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { industries } from "@/lib/industry-data";
import { CustomButton } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";

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
  { value: "1-10", label: "1-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201+", label: "201+" },
];

const statusStyles: Record<string, string> = {
  trial: "bg-amber-50 text-amber-700 border-amber-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  past_due: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  expired: "bg-red-50 text-red-700 border-red-200",
};

const FEATURE_LABELS: Record<string, string> = {
  ai_scoring: "AI scoring",
  excel_export: "Excel export",
  team_management: "Team management",
  lead_assignment: "Lead assignment",
};

export default function CompanyProfileForm({
  company,
  subscription,
}: {
  company: Company;
  subscription: Subscription | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [name, setName] = useState(company.name);
  const [email, setEmail] = useState(company.email);
  const [website, setWebsite] = useState(company.website ?? "");
  const [industry, setIndustry] = useState(company.industry);
  const [size, setSize] = useState(company.size ?? "");

  const plan = subscription?.plan;
  const statusLabel = (subscription?.status ?? "expired").replace("_", " ");
  const statusClass = statusStyles[subscription?.status ?? "expired"] ?? statusStyles.expired;

  const billingCopy = useMemo(() => {
    if (!subscription || !plan) {
      return {
        title: "No active plan",
        note: "Your workspace does not have an active subscription yet.",
      };
    }

    if (subscription.status === "trial") {
      return {
        title: `${plan.trialDays}-day trial`,
        note: `${subscription.daysLeftInTrial ?? 0} day(s) left before upgrade is needed.`,
      };
    }

    if (subscription.status === "active") {
      return {
        title: `${plan.name} plan`,
        note: `Renews at Rs ${plan.priceMonthly.toLocaleString("en-IN")} per month.`,
      };
    }

    return {
      title: `${plan.name} plan`,
      note: "This subscription needs attention before workspace access is interrupted.",
    };
  }, [subscription, plan]);

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
      setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to start checkout");
      if (!data.url) throw new Error("No checkout URL returned");

      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start checkout";
      setCheckoutError(message);
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-mono text-[#9B8E7E] transition-colors hover:text-[#1A1714]"
        >
          Back
        </button>

        <div className="mb-8 border-b border-[#E8E2D9] pb-5">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E]">Workspace profile</p>
          <h1
            className="mt-2 text-[clamp(1.8rem,4vw,2.5rem)] leading-tight text-[#1A1714]"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Company and billing
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6E6253]">
            Keep your company details current and review plan status without the clutter.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-[#E8E2D9] bg-white p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E]">Company</p>
                <h2
                  className="mt-2 text-[1.65rem] text-[#1A1714]"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  Details
                </h2>
              </div>
              <span className="rounded-full bg-[#F6F1EA] px-3 py-1 text-[10px] font-mono text-[#7D7264]">
                {saved ? "Saved" : "Editable"}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-mono text-[#9B8E7E]">Company name</label>
                <CustomInput type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono text-[#9B8E7E]">Company email</label>
                <CustomInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono text-[#9B8E7E]">Website</label>
                <CustomInput type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono text-[#9B8E7E]">Industry</label>
                <div className="relative">
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                    className="w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF8] px-4 py-3 text-sm text-[#1A1714] outline-none"
                  >
                    <option value="" disabled>
                      Select industry
                    </option>
                    {industries.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#C4B9A8]">
                    v
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono text-[#9B8E7E]">Team size</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {companySizes.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setSize(item.value)}
                      className="rounded-xl border px-3 py-2.5 text-sm font-mono transition-colors"
                      style={{
                        background: size === item.value ? "#1A1714" : "#FCFBF8",
                        color: size === item.value ? "#FAF9F6" : "#1A1714",
                        borderColor: size === item.value ? "#1A1714" : "#E8E2D9",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {formError && <p className="text-xs font-mono text-red-500">{formError}</p>}

              <div className="flex flex-wrap gap-3 pt-2">
                <CustomButton type="submit" disabled={loading}>
                  {loading ? "Saving..." : saved ? "Saved" : "Save changes"}
                </CustomButton>
              </div>
            </form>
          </section>

          <div className="space-y-6">
            <section className="rounded-3xl border border-[#E8E2D9] bg-white p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E]">Billing</p>
                  <h2
                    className="mt-2 text-[1.5rem] text-[#1A1714]"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                  >
                    {billingCopy.title}
                  </h2>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[10px] font-mono capitalize ${statusClass}`}>
                  {statusLabel}
                </span>
              </div>

              <p className="text-sm text-[#6E6253]">{billingCopy.note}</p>

              {plan && (
                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl bg-[#FBF8F4] px-4 py-3">
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#9B8E7E]">Price</p>
                    <p className="mt-1 text-lg text-[#1A1714]">
                      Rs {plan.priceMonthly.toLocaleString("en-IN")} / month
                    </p>
                  </div>

                  {subscription?.trialEnd && subscription.status === "trial" && (
                    <div className="rounded-2xl bg-[#FBF8F4] px-4 py-3">
                      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#9B8E7E]">Trial end</p>
                      <p className="mt-1 text-lg text-[#1A1714]">
                        {new Date(subscription.trialEnd).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  )}

                  {subscription?.currentPeriodEnd && subscription.status === "active" && (
                    <div className="rounded-2xl bg-[#FBF8F4] px-4 py-3">
                      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#9B8E7E]">Next billing</p>
                      <p className="mt-1 text-lg text-[#1A1714]">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(subscription?.status !== "active" || !subscription) && (
                <div className="mt-5">
                  <CustomButton onClick={handleUpgrade} disabled={checkoutLoading}>
                    {checkoutLoading ? "Redirecting..." : "Open checkout"}
                  </CustomButton>
                  {checkoutError && <p className="mt-2 text-xs font-mono text-red-500">{checkoutError}</p>}
                </div>
              )}
            </section>

            {plan?.features?.length ? (
              <section className="rounded-3xl border border-[#E8E2D9] bg-white p-6">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E]">Included</p>
                <h2
                  className="mt-2 text-[1.5rem] text-[#1A1714]"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  Features
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-[#E8E2D9] bg-[#FCFBF8] px-3 py-1.5 text-[10px] font-mono text-[#6E6253]"
                    >
                      {FEATURE_LABELS[feature] ?? feature}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {subscription?.lastPayment ? (
              <section className="rounded-3xl border border-[#E8E2D9] bg-white p-6">
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E]">Last payment</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg text-[#1A1714]">
                      Rs {subscription.lastPayment.amount.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-xs text-[#9B8E7E]">
                      {subscription.lastPayment.paidAt
                        ? new Date(subscription.lastPayment.paidAt).toLocaleDateString("en-IN")
                        : "Date unavailable"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-mono capitalize ${
                      subscription.lastPayment.status === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {subscription.lastPayment.status}
                  </span>
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
