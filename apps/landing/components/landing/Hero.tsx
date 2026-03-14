"use client";

import { CustomButton } from "../common/CustomButton";

export default function Hero() {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6">

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
          Inboq reads every inbound lead, understands their intent, and scores
          them Hot, Warm, or Cold — instantly.
        </p>

        <div className="flex items-center gap-4">
          <CustomButton onClick={scrollToWaitlist}>
            Join the waitlist
          </CustomButton>
        
        </div>

      </div>
    </section>
  );
}