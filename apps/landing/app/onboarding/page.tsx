"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { industries } from "@/lib/industry-data";
import { useAppStore } from "@/store/useAppStore";
import { CustomButton } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";

export default function OnboardingPage() {
  const router = useRouter();
  const setCompany = useAppStore((s) => s.setCompany);

  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [industry, setIndustry] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompany({ name: companyName, email: companyEmail, industry });
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <p className="font-mono text-sm font-medium text-[#1A1714] mb-12">
          lead<span className="text-[#D4622A]">IQ</span>
        </p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                background:
                  s <= step ? "#D4622A" : "#E8E2D9",
              }}
            />
          ))}
        </div>

        <h1
          className="text-3xl text-[#1A1714] mb-2"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          {step === 1 && "What's your company called?"}
          {step === 2 && "Company email?"}
          {step === 3 && "What industry are you in?"}
        </h1>
        <p className="text-sm text-[#9B8E7E] mb-8">
          {step === 1 && "This is how your team will see your workspace."}
          {step === 2 && "We'll use this for account notifications."}
          {step === 3 && "We'll personalize your dashboard based on this."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {step === 1 && (
            <CustomInput
              type="text"
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          )}

          {step === 2 && (
            <CustomInput
              type="email"
              placeholder="company@email.com"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              required
            />
          )}

          {step === 3 && (
            <div className="relative">
              {/* Gradient border */}
              <div
                className="absolute -inset-[1.5px] rounded-xl"
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
                <option value="" disabled>
                  Select your industry
                </option>
                {industries.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
              {/* Dropdown arrow */}
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4B9A8] pointer-events-none">
                ↓
              </span>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 border border-[#E8E2D9] rounded-xl py-3 text-sm text-[#9B8E7E] hover:border-[#C4B9A8] transition-colors font-mono"
              >
                ← Back
              </button>
            )}
            {step < 3 ? (
              <div className={step > 1 ? "flex-1" : "w-full"}>
                <CustomButton
                  type="button"
                  className="w-full"
                  onClick={() => {
                    if (step === 1 && !companyName) return;
                    if (step === 2 && !companyEmail) return;
                    setStep(step + 1);
                  }}
                >
                  Continue →
                </CustomButton>
              </div>
            ) : (
              <div className={step > 1 ? "flex-1" : "w-full"}>
                <CustomButton type="submit" className="w-full">
                  Go to dashboard →
                </CustomButton>
              </div>
            )}
          </div>
        </form>

        <p className="text-xs text-[#C4B9A8] mt-6 text-center">
          Step {step} of 3
        </p>
      </div>
    </main>
  );
}