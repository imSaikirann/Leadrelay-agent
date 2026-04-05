"use client";

import { useEffect, useState } from "react";
import { CreditCard, X } from "lucide-react";
import { createPortal } from "react-dom";

type Plan = {
  id: string;
  name: string;
  priceMonthly: number;
  trialDays: number;
  maxLeads?: number | null;
  maxMembers?: number | null;
  features?: string[];
};

type Subscription = {
  status: string;
  planId?: string;
  daysLeftInTrial?: number | null;
  plan?: {
    name?: string;
    priceMonthly?: number;
    maxLeads?: number | null;
    maxMembers?: number | null;
    features?: string[];
  };
};

export default function SidebarPlanCard() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);

    fetch("/api/subscription")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSubscription(data))
      .catch(() => {});

    fetch("/api/plans")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPlans(data);
      })
      .catch(() => {});
  }, []);

  const currentPlanName = subscription?.plan?.name ?? "Trial";
  const currentPlanSub =
    subscription?.status === "trial"
      ? `${subscription?.daysLeftInTrial ?? 0} day(s) left`
      : subscription?.status === "active"
      ? `Rs ${subscription?.plan?.priceMonthly ?? 0}/month`
      : subscription?.status ?? "No plan";

  async function handleCheckout(planId: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start checkout");
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start checkout";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mb-3 rounded-2xl border border-dashed border-[#E8E2D9] bg-[#F4EFE8] px-3 py-3 text-left transition-colors hover:border-[#D9CCBC] hover:bg-[#EFE8DE] dark:border-white/10 dark:bg-[#171717] dark:hover:border-white/20 dark:hover:bg-[#1d1d1d]"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#C4B9A8] dark:text-[#8E8377]">Current plan</p>
            <p className="mt-2 text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">{currentPlanName}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#7D7264] dark:text-[#B8ADA0]">{currentPlanSub}</p>
          </div>
          <CreditCard className="h-4 w-4 text-[#D4622A]" />
        </div>
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[100] bg-[#1A1714]/60 p-4 sm:p-6">
              <div className="flex h-full items-center justify-center">
                <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#E8E2D9] bg-white p-6 shadow-[0_30px_120px_-40px_rgba(26,23,20,0.45)] dark:border-white/10 dark:bg-[#121212] sm:p-7">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E] dark:text-[#A99C8B]">Plans</p>
                      <h2 className="mt-2 text-[1.8rem] text-[#1A1714] dark:text-[#F5F1EB]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                        Manage your plan
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-[#6E6253] dark:text-[#B8ADA0]">
                        Trial accounts can use only one extra workspace. Upgrade to unlock more workspaces and higher limits.
                      </p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="rounded-xl border border-[#E8E2D9] p-2 text-[#6E6253] dark:border-white/10 dark:text-[#B8ADA0]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {plans.map((plan) => {
                      const isCurrent = subscription?.planId === plan.id && subscription?.status === "active";
                      return (
                        <div
                          key={plan.id}
                          className={`rounded-3xl border p-5 ${
                            isCurrent
                              ? "border-[#D4622A] bg-[#FFF8F2] dark:bg-[#221b16]"
                              : "border-[#E8E2D9] bg-[#FCFBF8] dark:border-white/10 dark:bg-[#1A1A1A]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-lg text-[#1A1714] dark:text-[#F5F1EB]">{plan.name}</p>
                              <p className="mt-1 text-sm text-[#6E6253] dark:text-[#B8ADA0]">Rs {plan.priceMonthly}/month</p>
                            </div>
                            {isCurrent && (
                              <span className="rounded-full bg-[#1A1714] px-3 py-1 text-[10px] font-mono text-white dark:bg-[#F5F1EB] dark:text-[#111111]">Current</span>
                            )}
                          </div>

                          <div className="mt-4 space-y-2 text-xs text-[#6E6253] dark:text-[#B8ADA0]">
                            <p>Trial: {plan.trialDays} days</p>
                            <p>Leads: {plan.maxLeads ?? "Unlimited"}</p>
                            <p>Members: {plan.maxMembers ?? "Unlimited"}</p>
                            <p>More than one workspace requires upgrade after trial.</p>
                          </div>

                          {Array.isArray(plan.features) && plan.features.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {plan.features.map((feature) => (
                                <span key={feature} className="rounded-full border border-[#E8E2D9] px-2 py-1 text-[10px] font-mono text-[#7D7264] dark:border-white/10 dark:text-[#D4C7B8]">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => handleCheckout(plan.id)}
                            disabled={loading || isCurrent}
                            className="mt-5 w-full rounded-xl bg-[#1A1714] px-4 py-3 text-sm text-[#FAF9F6] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#F5F1EB] dark:text-[#111111]"
                          >
                            {isCurrent ? "Current plan" : loading ? "Redirecting..." : "Choose plan"}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {error && <p className="mt-4 text-xs font-mono text-red-500">{error}</p>}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
