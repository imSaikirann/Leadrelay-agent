"use client";

import { CustomButton } from "../common/CustomButton";
import HeroPreview from "./HeroPreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-24">
      <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#D4622A]/5 blur-[100px] pointer-events-none -z-10 dark:bg-[#D4622A]/10" />

      <div className="mx-auto w-full max-w-5xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-[#C4B9A8] dark:text-[#8E8377]">
              Founder workspace control
            </p>

            <h1
              className="mb-5 text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.08] text-[#1A1714] dark:text-[#F5F1EB]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Run your business without{" "}
              <em className="text-[#D4622A] not-italic">losing the signal.</em>
            </h1>

            <p className="mb-8 max-w-md text-base leading-relaxed text-[#9B8E7E] dark:text-[#B8ADA0]">
              FoundHub gives early-stage founders one workspace to manage leads, sales, team
              activity, marketing, and operations, while AI instantly shows which leads deserve
              attention first. Built for edtech, agencies, and service businesses.
            </p>

            <div className="mb-8 flex flex-wrap items-center gap-4">
              <CustomButton href="/login">See What Needs Attention</CustomButton>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "R", "S", "D"].map((letter) => (
                  <div
                    key={letter}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#E8E2D9] text-[10px] font-medium text-[#9B8E7E]"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#9B8E7E] dark:text-[#B8ADA0]">
                <span className="font-medium text-[#1A1714] dark:text-[#F5F1EB]">24 founders</span>{" "}
                already testing FoundHub
              </p>
            </div>
          </div>

          <HeroPreview />
        </div>
      </div>
    </section>
  );
}
