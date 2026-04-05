"use client";

import { CustomButton } from "../common/CustomButton";
import HeroPreview from "./HeroPreview";

export default function Hero() {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-24">

      {/* subtle radial glow behind right side */}
      <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#D4622A]/5 blur-[100px] pointer-events-none -z-10 dark:bg-[#D4622A]/10" />

      <div className="max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ── Left: copy ── */}
          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-[#C4B9A8] dark:text-[#8E8377]">
              Founder workspace control
            </p>

            <h1
              className="mb-5 text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.08] text-[#1A1714] dark:text-[#F5F1EB]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Run separate team workspaces from{" "}
              <em className="text-[#D4622A] not-italic">
                one founder dashboard.
              </em>
            </h1>

            <p className="mb-8 max-w-md text-base leading-relaxed text-[#9B8E7E] dark:text-[#B8ADA0]">
              Foundhub gives sales, marketing, support, and ops their own workspace, while founders
              still manage forms, billing, lead scoring, and team activity from one calm control center.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <CustomButton href="/login">
                Start Free Trial
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
              <p className="text-xs text-[#9B8E7E] dark:text-[#B8ADA0]">
                <span className="font-medium text-[#1A1714] dark:text-[#F5F1EB]">24 founders</span>{" "}
                testing multi-workspace lead operations
              </p>
            </div>
          </div>

      
         <HeroPreview/>

        </div>
      </div>
    </section>
  );
}
