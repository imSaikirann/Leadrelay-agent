"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function FormPreviewPage() {
  const company = useAppStore((s) => s.company);
  const [copied, setCopied] = useState(false);

  const snippet = `<script src="https://leadiq.io/embed.js" data-company="${company?.name ?? "your-company"}" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      <div className="mb-6 sm:mb-8">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Embeddable Form
        </h1>
        <p className="text-sm text-[#9B8E7E] mt-1">
          Drop this script on any page. Leads flow in automatically.
        </p>
      </div>

      {/* Snippet */}
      <div className="bg-[#1A1714] rounded-2xl p-4 sm:p-5 mb-8 relative">
        <p className="font-mono text-xs text-[#9B8E7E] mb-3">embed snippet</p>
        <p className="font-mono text-xs sm:text-sm text-[#F5C27A] break-all leading-relaxed pr-16">
          {snippet}
        </p>
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 text-xs font-mono bg-[#2C2825] text-[#FAF9F6] px-3 py-1.5 rounded-lg hover:bg-[#D4622A] transition-colors whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Form preview */}
      <p className="text-xs font-mono text-[#C4B9A8] uppercase tracking-widest mb-4">
        Form preview
      </p>
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 w-full max-w-md">
        <h3
          className="text-xl text-[#1A1714] mb-6"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Get in touch
        </h3>
        <div className="flex flex-col gap-4">
          {["Full name", "Email address", "Phone number", "Interested in", "Tell us your goal"].map(
            (field) => (
              <div key={field}>
                <label className="text-xs font-mono text-[#9B8E7E] mb-1.5 block">
                  {field}
                </label>
                {field === "Tell us your goal" ? (
                  <textarea
                    disabled
                    placeholder="Describe what you're looking for..."
                    className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#C4B9A8] resize-none h-20 font-mono"
                  />
                ) : field === "Interested in" ? (
                  <select
                    disabled
                    className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#C4B9A8] font-mono appearance-none"
                  >
                    <option>Select an option</option>
                  </select>
                ) : (
                  <input
                    disabled
                    placeholder={`Enter ${field.toLowerCase()}`}
                    className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#C4B9A8] font-mono"
                  />
                )}
              </div>
            )
          )}
          <div className="w-full bg-[#1A1714] text-[#FAF9F6] text-sm font-mono py-3 rounded-xl text-center mt-2 opacity-60">
            Submit
          </div>
        </div>
      </div>

    </div>
  );
}