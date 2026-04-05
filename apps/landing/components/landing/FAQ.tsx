"use client";

import { useState, useRef, useEffect } from "react";

const faqs = [
  {
    q: "Does this work with my existing form?",
    a: "Yes. Foundhub has an embeddable form you drop on any page with one script tag. You don't need to replace anything — just add it where you want leads to come in.",
  },
  {
    q: "What happens to warm and cold leads?",
    a: "Warm leads stay in your CRM for follow-up — you can set up a drip sequence or assign them manually. Cold leads are stored too, so nothing is lost. You decide what to do with them.",
  },
  {
    q: "How is this different from HubSpot?",
    a: "HubSpot scores leads based on job title, company size, and page visits. Foundhub reads what the lead actually wrote — their intent, urgency, and timeline in their own words. It's faster to set up and built for small teams, not enterprise.",
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
    <section className="border-t border-[#E8E2D9] px-6 py-24 dark:border-white/10">
      <div className="max-w-4xl mx-auto">

        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#C4B9A8] dark:text-[#8E8377]">
          FAQ
        </p>
   <h2
  className="mb-10 text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-[#1A1714] dark:text-[#F5F1EB]"
  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
>
  Questions you probably{" "}
  <span className="relative inline-block">
    have.
    <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#D4622A] rounded-full" />
  </span>
</h2>

        <div className="divide-y divide-[#E8E2D9] dark:divide-white/10">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                >
                  <span
                    className="text-sm font-medium leading-relaxed text-[#1A1714] transition-colors duration-150 dark:text-[#F5F1EB]"
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
                  <p className="pb-5 pr-10 text-sm leading-relaxed text-[#9B8E7E] dark:text-[#B8ADA0]">
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
