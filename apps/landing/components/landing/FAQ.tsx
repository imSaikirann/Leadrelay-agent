"use client";

import { useState, useRef, useEffect } from "react";

const faqs = [
  {
    q: "Does this work with my existing form?",
    a: "Yes. Inboq has an embeddable form you drop on any page with one script tag. You don't need to replace anything — just add it where you want leads to come in.",
  },
  {
    q: "What happens to warm and cold leads?",
    a: "Warm leads stay in your CRM for follow-up — you can set up a drip sequence or assign them manually. Cold leads are stored too, so nothing is lost. You decide what to do with them.",
  },
  {
    q: "How is this different from HubSpot?",
    a: "HubSpot scores leads based on job title, company size, and page visits. Inboq reads what the lead actually wrote — their intent, urgency, and timeline in their own words. It's faster to set up and built for small teams, not enterprise.",
  },
  {
    q: "How accurate is the AI scoring?",
    a: "The scoring is based on intent signals in the context field — urgency words, timeline mentions, budget signals. You also see the AI's reasoning for every score, so your rep can make the final call.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section className="px-6 py-24 border-t border-[#E8E2D9]">
      <div className="max-w-4xl mx-auto">

        <p className="font-mono text-xs text-[#C4B9A8] uppercase tracking-widest mb-4">
          FAQ
        </p>
   <h2
  className="text-[clamp(1.8rem,4vw,2.8rem)] text-[#1A1714] leading-tight mb-10"
  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
>
  Questions you probably{" "}
  <span className="relative inline-block">
    have.
    <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#D4622A] rounded-full" />
  </span>
</h2>

        <div className="divide-y divide-[#E8E2D9]">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                >
                  <span
                    className="text-sm font-medium text-[#1A1714] leading-relaxed transition-colors duration-150"
                    style={{ color: isOpen ? "#D4622A" : undefined }}
                  >
                    {faq.q}
                  </span>

                  {/* Icon circle */}
                  <span
                    className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mt-0.5 transition-all duration-150"
                    style={{
                      background: isOpen ? "#D4622A" : "transparent",
                      borderColor: isOpen ? "#D4622A" : "#C4B9A8",
                      color: isOpen ? "white" : "#C4B9A8",
                    }}
                  >
                    <svg
                      width="10" height="10" viewBox="0 0 10 10" fill="none"
                      style={{ transition: "transform 0.25s ease", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    >
                      <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>

                {/* Answer — smooth height transition */}
                <div
                  ref={(el) => { bodyRefs.current[i] = el; }}
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? (bodyRefs.current[i]?.scrollHeight ?? 200) + "px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="text-sm text-[#9B8E7E] leading-relaxed pb-5 pr-10">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}