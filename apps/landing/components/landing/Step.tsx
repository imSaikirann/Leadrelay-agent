import { CheckCircle2 } from 'lucide-react';
import React from 'react'

interface StepProps {
  number: string;
  title: string;
  description: string;
}
 function Step({ number, title, description }: StepProps) {

 

const badges = [
  { color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500", label: "Hot" },
  { color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400", label: "Warm" },
  { color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-400", label: "Cold" },
];

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
    title: "Lead fills your form",
    description:
      "Name, email, phone, course interest — and a context field where they describe their goal in their own words. That last part is everything.",
  },
  {
    number: "02",
    title: "AI reads the intent",
    description:
      "LeadIQ reads the context, detects urgency signals, buying intent, and timeline — scores the lead Hot, Warm, or Cold in under 2 seconds.",
  },
  {
    number: "03",
    title: "Hot leads go to your rep. Instantly.",
    description:
      "Hot leads are assigned to an available sales rep inside your LeadIQ CRM. Your rep sees the lead, their context, and their score — no spreadsheet hunting.",
  },
];
  return (
    <section className="px-6 py-24 border-t border-[#E8E2D9]">
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <Step key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}