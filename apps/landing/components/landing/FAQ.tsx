"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Does this work with my existing form?",
    a: "Yes. LeadIQ has an embeddable form you drop on any page with one script tag. You don't need to replace anything — just add it where you want leads to come in.",
  },
  {
    q: "What happens to warm and cold leads?",
    a: "Warm leads stay in your CRM for follow-up — you can set up a drip sequence or assign them manually. Cold leads are stored too, so nothing is lost. You decide what to do with them.",
  },
  {
    q: "How is this different from HubSpot?",
    a: "HubSpot scores leads based on job title, company size, and page visits. LeadIQ reads what the lead actually wrote — their intent, urgency, and timeline in their own words. It's faster to set up and built for small teams, not enterprise.",
  },
  {
    q: "How accurate is the AI scoring?",
    a: "The scoring is based on intent signals in the context field — urgency words, timeline mentions, budget signals. You also see the AI's reasoning for every score, so your rep can make the final call.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-6 py-24 border-t border-[#E8E2D9]">
      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-xs text-[#C4B9A8] uppercase tracking-widest mb-4">
          FAQ
        </p>
        <h2
          className="text-[clamp(1.8rem,4vw,3rem)] text-[#1A1714] leading-tight mb-12"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Questions you probably have.
        </h2>

        <div className="flex flex-col divide-y divide-[#E8E2D9]">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 text-left group"
              >
                <span className="text-sm font-medium text-[#1A1714] group-hover:text-[#D4622A] transition-colors duration-200">
                  {faq.q}
                </span>
                <span
                  className="text-[#C4B9A8] font-mono text-lg shrink-0 transition-transform duration-200"
                  style={{
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: open === i ? "200px" : "0px",
                  opacity: open === i ? 1 : 0,
                }}
              >
                <p className="text-sm text-[#9B8E7E] leading-relaxed pt-3 pr-8">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}