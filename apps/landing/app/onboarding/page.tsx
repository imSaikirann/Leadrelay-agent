"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { industries } from "@/lib/industry-data";
import { CustomButton } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";

const STEPS = 4;

const companySizes = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201+", label: "201+ employees" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState(session?.user?.email ?? "");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyName,
          email: companyEmail,
          website,
          industry,
          size,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canContinue = () => {
    if (step === 1) return companyName.trim().length > 0;
    if (step === 2) return companyEmail.trim().length > 0;
    if (step === 3) return website.trim().length > 0;
    if (step === 4) return industry.length > 0;
    return true;
  };

  const titles = [
    "What's your company called?",
    "Company email?",
    "Your website?",
    "Tell us about your team.",
  ];

  const subtitles = [
    "This is how your team will see your workspace.",
    "We'll use this for account notifications.",
    "Your public-facing site or app URL.",
    "We'll personalize your dashboard based on this.",
  ];

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <p className="font-mono text-sm font-medium text-[#1A1714] mb-12">
          lead<span className="text-[#D4622A]">IQ</span>
        </p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: i + 1 <= step ? "#D4622A" : "#E8E2D9" }}
            />
          ))}
        </div>

        <h1
          className="text-3xl text-[#1A1714] mb-2"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          {titles[step - 1]}
        </h1>
        <p className="text-sm text-[#9B8E7E] mb-8">{subtitles[step - 1]}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {step === 1 && (
            <CustomInput
              type="text"
              placeholder="Acme Inc."
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
            <CustomInput
              type="url"
              placeholder="https://yourcompany.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
            />
          )}

          {step === 4 && (
            <div className="flex flex-col gap-3">
              {/* Industry select */}
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

              {/* Company size */}
              <div className="grid grid-cols-2 gap-2">
                {companySizes.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSize(s.value)}
                    className="py-3 px-4 rounded-xl text-sm font-mono border transition-all"
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
          )}

          {error && (
            <p className="text-xs text-red-500 font-mono">{error}</p>
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
            {step < STEPS ? (
              <div className={step > 1 ? "flex-1" : "w-full"}>
                <CustomButton
                  type="button"
                  className="w-full"
                  onClick={() => { if (canContinue()) setStep(step + 1); }}
                >
                  Continue →
                </CustomButton>
              </div>
            ) : (
              <div className={step > 1 ? "flex-1" : "w-full"}>
                <CustomButton
                  type="submit"
                  className="w-full"
                  disabled={loading || !industry}
                >
                  {loading ? "Saving..." : "Go to dashboard →"}
                </CustomButton>
              </div>
            )}
          </div>
        </form>

        <p className="text-xs text-[#C4B9A8] mt-6 text-center">
          Step {step} of {STEPS}
        </p>
      </div>
    </main>
  );
}