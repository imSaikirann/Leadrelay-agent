import { CheckCircle2 } from 'lucide-react';
import React from 'react';

interface StepProps {
  number: string;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="group rounded-2xl border border-[#E8E2D9] bg-[#FAF9F6] p-6 hover:border-[#C4B9A8] transition-colors duration-200">
      <span className="font-mono text-4xl font-medium text-[#E8E2D9] group-hover:text-[#D4622A] transition-colors duration-300">
        {number}
      </span>

      <h3 className="mt-4 text-base font-semibold text-[#1A1714] leading-tight">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[#9B8E7E] leading-relaxed">{description}</p>

      <CheckCircle2 className="mt-4 h-5 w-5 text-[#D4622A]" />
    </div>
  );
}

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Set up forms and workspaces once.",
      description:
        "Launch with a ready form, create separate team workspaces, and keep founder-level visibility from the first day.",
    },
    {
      number: "02",
      title: "Every lead gets read and scored by AI.",
      description:
        "Foundhub reads urgency, intent, timeline, and context from every submission and ranks each lead as hot, warm, or cold.",
    },
    {
      number: "03",
      title: "The right workspace handles the right work.",
      description:
        "Sales, marketing, support, and ops each work in their own space, while founders still manage billing, teams, and activity from one dashboard.",
    },
  ];

  return (
    <section className="px-6 py-24 border-t border-[#E8E2D9]">
      <div className="max-w-4xl mx-auto">

      <div className="mb-14">
  <p className="font-mono text-xs text-[#C4B9A8] uppercase tracking-widest mb-4">
    How it works
  </p>
  <h2
    className="text-[clamp(1.8rem,4vw,3rem)] text-[#1A1714] leading-tight max-w-xl"
    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
  >
    One system.{" "}
    <span className="relative inline-block">
      Multiple workspaces.
      <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#D4622A] rounded-full" />
    </span>
  </h2>
</div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <Step key={step.number} {...step} />
          ))}
        </div>

      </div>
    </section>
  );
}
