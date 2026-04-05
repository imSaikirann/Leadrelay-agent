"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CreditCard, Sparkles } from "lucide-react";
import { CustomButton } from "@/components/common/CustomButton";

type Plan = {
  id: string;
  name: string;
  priceMonthly: number;
  trialDays: number;
  maxLeads?: number | null;
  maxMembers?: number | null;
  features?: string[] | null;
};

function normalizeFeature(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setPlans(data);
      })
      .catch(() => {});
  }, []);

  const visiblePlans = useMemo(
    () =>
      plans
        .filter((plan) => typeof plan.priceMonthly === "number")
        .sort((a, b) => a.priceMonthly - b.priceMonthly),
    [plans]
  );

  if (visiblePlans.length === 0) return null;

  return (
    <section className="border-t border-[#E8E2D9] px-6 py-24 dark:border-white/10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#C4B9A8] dark:text-[#8E8377]">
              Pricing
            </p>
            <h2
              className="max-w-2xl text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[#1A1714] dark:text-[#F5F1EB]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Start with a <span className="text-[#D4622A]">7-day free trial</span>, then run
              multiple workspaces from one founder dashboard.
            </h2>
          </div>

          <div className="max-w-sm rounded-2xl border border-[#E8E2D9] bg-[#FFF8F2] px-5 py-4 dark:border-white/10 dark:bg-[#1A1512]">
            <p className="text-sm leading-relaxed text-[#6E6253] dark:text-[#B8ADA0]">
              Separate spaces for sales, marketing, support, and ops. One place for founders to
              manage billing, forms, scoring, and team activity.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {visiblePlans.map((plan, index) => {
            const featured = index === Math.min(1, visiblePlans.length - 1);
            const features = Array.isArray(plan.features) ? plan.features.slice(0, 6) : [];

            return (
              <div
                key={plan.id}
                className={`rounded-[28px] border p-6 transition-colors ${
                  featured
                    ? "border-[#D4622A] bg-[linear-gradient(135deg,#fffaf4_0%,#fff4ea_52%,#fff1e4_100%)] dark:bg-[linear-gradient(135deg,#211814_0%,#2A1C15_52%,#331E14_100%)]"
                    : "border-[#E8E2D9] bg-white dark:border-white/10 dark:bg-[#151515]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#9B8E7E] dark:text-[#A99C8B]">
                      {featured ? "Popular plan" : "Plan"}
                    </p>
                    <h3
                      className="mt-2 text-[2rem] leading-none text-[#1A1714] dark:text-[#F5F1EB]"
                      style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                    >
                      {plan.name}
                    </h3>
                  </div>

                  <span className="rounded-full border border-[#E8E2D9] bg-[#FAF9F6] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-[#7D7264] dark:border-white/10 dark:bg-[#171717] dark:text-[#D4C7B8]">
                    {plan.trialDays || 7} day trial
                  </span>
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <p className="text-4xl text-[#1A1714] dark:text-[#F5F1EB]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                    Rs {plan.priceMonthly}
                  </p>
                  <p className="pb-1 text-sm text-[#9B8E7E] dark:text-[#B8ADA0]">per month</p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#FAF9F6] px-4 py-3 dark:bg-[#1C1C1C]">
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#C4B9A8] dark:text-[#8E8377]">Leads</p>
                    <p className="mt-2 text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">
                      {plan.maxLeads == null ? "Unlimited" : `${plan.maxLeads}/month`}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#FAF9F6] px-4 py-3 dark:bg-[#1C1C1C]">
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#C4B9A8] dark:text-[#8E8377]">Members</p>
                    <p className="mt-2 text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">
                      {plan.maxMembers == null ? "Unlimited" : `${plan.maxMembers} seats`}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#FAF9F6] px-4 py-3 dark:bg-[#1C1C1C]">
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#C4B9A8] dark:text-[#8E8377]">Access</p>
                    <p className="mt-2 text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">Founder dashboard</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 text-[#D4622A]" />
                    <p className="text-sm leading-6 text-[#6E6253] dark:text-[#B8ADA0]">
                      Includes a <span className="font-medium text-[#1A1714] dark:text-[#F5F1EB]">7-day free trial</span> before billing starts.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CreditCard className="mt-0.5 h-4 w-4 text-[#D4622A]" />
                    <p className="text-sm leading-6 text-[#6E6253] dark:text-[#B8ADA0]">
                      Separate workspaces for teams, one shared billing and control layer for founders.
                    </p>
                  </div>
                </div>

                {features.length > 0 && (
                  <div className="mt-6 grid gap-2">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-[#6E6253] dark:text-[#B8ADA0]">
                        <Check className="h-4 w-4 text-[#D4622A]" />
                        <span>{normalizeFeature(feature)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8">
                  <CustomButton href="/login">Start Free Trial</CustomButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
