"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "../common/CustomInput";

// ─── CrazyInput ───────────────────────────────────────────────────────────────





export default function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6">


      {/* Content */}
      <div className="max-w-4xl mx-auto w-full pt-24 pb-16">
        <h1
          className="text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] text-[#1A1714] mb-6"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Your sales team should only
          <br />
          <em className="text-[#e55913] not-italic">
            talk to people ready to buy.
          </em>
        </h1>

        <p className="text-[clamp(1rem,2vw,1.25rem)] text-[#9B8E7E] font-normal leading-relaxed max-w-2xl mb-10">
          LeadIQ reads every inbound lead, understands their intent, and scores
          them Hot, Warm, or Cold — instantly.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-md"
          >
            {/* Input takes all available space */}
            <div className="flex-1 min-w-0">
              <CustomInput
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Button fixed width on desktop, full width on mobile */}
            <div className="w-full sm:w-auto sm:shrink-0">
              <CustomButton type="submit">
                Join the waitlist
              </CustomButton>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3 bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl px-5 py-4 max-w-md">
            <span className="text-xl">🎉</span>
            <div>
              <p className="text-sm font-medium text-[#1A1714]">You're on the list.</p>
              <p className="text-xs text-[#9B8E7E]">We'll reach out when LeadIQ is ready.</p>
            </div>
          </div>
        )}

        <p className="text-xs text-[#C4B9A8] mt-4">
          No credit card. No spam. Just early access.
        </p>
      </div>
    </section>
  );
}