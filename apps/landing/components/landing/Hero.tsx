"use client";

import { CustomButton } from "../common/CustomButton";
import HeroPreview from "./HeroPreview";

export default function Hero() {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-16">

      {/* subtle radial glow behind right side */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-[#D4622A]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ── Left: copy ── */}
          <div>
            <p className="font-mono text-xs text-[#C4B9A8] uppercase tracking-widest mb-6">
              AI lead scoring
            </p>

            <h1
              className="text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.08] text-[#1A1714] mb-5"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Your sales team should only{" "}
              <em className="text-[#D4622A] not-italic">
                talk to people ready to buy.
              </em>
            </h1>

            <p className="text-base text-[#9B8E7E] leading-relaxed mb-8 max-w-md">
              Inboq reads every inbound lead, understands their intent, and scores
              them Hot, Warm, or Cold  in under 2 seconds. Your rep picks up the
              phone already knowing who's serious.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <CustomButton onClick={scrollToWaitlist}>
                Join the waitlist
              </CustomButton>
            
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "R", "S", "D"].map((l) => (
                  <div
                    key={l}
                    className="w-7 h-7 rounded-full bg-[#E8E2D9] border-2 border-white flex items-center justify-center text-[10px] font-medium text-[#9B8E7E]"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#9B8E7E]">
                <span className="text-[#1A1714] font-medium">24 founders</span>{" "}
                already on the waitlist
              </p>
            </div>
          </div>

      
         <HeroPreview/>

        </div>
      </div>
    </section>
  );
}