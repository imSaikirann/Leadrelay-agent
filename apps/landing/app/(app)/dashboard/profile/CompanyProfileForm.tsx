"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { industries } from "@/lib/industry-data";
import { CustomButton } from "@/components/common/CustomButton";
import { CustomInput } from "@/components/common/CustomInput";

const companySizes = [
  { value: "1-10", label: "1–10" },
  { value: "11-50", label: "11–50" },
  { value: "51-200", label: "51–200" },
  { value: "201+", label: "201+" },
];

type Company = {
  id: string;
  name: string;
  email: string;
  website?: string | null;
  industry: string;
  size?: string | null;
};

export default function CompanyProfileForm({ company }: { company: Company }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(company.name);
  const [email, setEmail] = useState(company.email);
  const [website, setWebsite] = useState(company.website ?? "");
  const [industry, setIndustry] = useState(company.industry);
  const [size, setSize] = useState(company.size ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-6 py-12">
      <div className="max-w-xl mx-auto">

        {/* Header */}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Company Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#9B8E7E]">Company name</label>
            <CustomInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Inc."
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#9B8E7E]">Company email</label>
            <CustomInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="company@email.com"
              required
            />
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-[#9B8E7E]">Website</label>
            <CustomInput
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourcompany.com"
            />
          </div>

          {/* Industry */}
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

          {/* Company Size */}
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

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 font-mono">{error}</p>
          )}

          {/* Success */}
          {saved && (
            <p className="text-xs text-green-600 font-mono">✓ Changes saved</p>
          )}

          {/* Submit */}
          <div className="mt-2">
            <CustomButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </CustomButton>
          </div>

        </form>
      </div>
    </main>
  );
}