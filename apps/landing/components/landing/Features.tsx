import React from 'react'


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}


import {
  CheckCircle2,
  Zap,
  Brain,
  Users,
  Code2,
  BarChart3,
  Bell,
} from "lucide-react";
import { Card, CardContent } from '../ui/card';
export default function Features() {

    
const features = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "Intent-first scoring",
    description:
      "Most tools score on job title. LeadIQ reads what they actually wrote — urgency, timeline, and buying signals from their own words.",
  },
  {
    icon: <Bell className="h-5 w-5" />,
    title: "Hot lead alerts",
    description:
      "When a hot lead comes in, your rep is notified instantly with full context — not just a name, but exactly why they're ready to buy.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Built-in mini CRM",
    description:
      "Add your sales team, assign leads, track status. No Salesforce complexity — just the pipeline view a small team actually needs.",
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    title: "Embeddable form",
    description:
      "One script tag. Drop the LeadIQ form on any page. Works on landing pages, course pages, webinar signups — anywhere.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "AI reasoning visible",
    description:
      "Your rep sees exactly why a lead scored hot. 'Mentioned company sponsorship + 30-day deadline' — not a black-box number.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Lead quality over time",
    description:
      "Track your hot/warm/cold ratio weekly. Understand which channels bring buyers vs browsers.",
  },
];
  return (
      <section className="px-6 py-24 bg-[#F0EDE6] border-t border-[#E8E2D9]">
      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  )
}




function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="rounded-2xl border-[#E8E2D9] hover:border-[#C4B9A8] transition-colors duration-200 hover:shadow-sm">
      <CardContent className="p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EDE6] text-[#2C2825]">
          {icon}
        </div>
        <h3 className="mt-4 text-sm font-medium text-[#1A1714]">{title}</h3>
        <p className="mt-2 text-xs text-[#9B8E7E] leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}