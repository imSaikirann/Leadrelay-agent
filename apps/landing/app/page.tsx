"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Zap,
  Brain,
  Users,
  Code2,
  BarChart3,
  Bell,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StepProps {
  number: string;
  title: string;
  description: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

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

const badges = [
  { color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500", label: "Hot" },
  { color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400", label: "Warm" },
  { color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-400", label: "Cold" },
];

// ─── Components ──────────────────────────────────────────────────────────────

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

// ─── Sections ────────────────────────────────────────────────────────────────

function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6">

      {/* NAV */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6">
        <span className="font-mono text-sm font-medium text-[#1A1714] tracking-tight">
          lead<span className="text-[#D4622A]">IQ</span>
        </span>

        <a
          href="#waitlist"
          className="text-sm font-medium text-[#9B8E7E] hover:text-[#1A1714] transition-colors duration-200"
        >
          Join waitlist →
        </a>
      </nav>

      {/* HERO CONTENT */}
      <div className="max-w-4xl mx-auto w-full pt-24 pb-16">

        <h1
          className="text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] text-[#1A1714] mb-6"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Your sales team should only
          <br />
          <em className="text-[#D4622A] not-italic">
            talk to people ready to buy.
          </em>
        </h1>

        <p className="text-[clamp(1rem,2vw,1.25rem)] text-[#9B8E7E] font-light leading-relaxed max-w-2xl mb-10">
          LeadIQ reads every inbound lead, understands their intent, and scores
          them Hot, Warm, or Cold — instantly.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm"
            />

            <Button
              type="submit"
              className="bg-[#1A1714] text-[#FAF9F6] hover:bg-[#2C2825] rounded-xl px-6"
            >
              Join the waitlist
            </Button>
          </form>
        ) : (
          <div className="bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl px-5 py-4 max-w-md">
            🎉 You're on the list
          </div>
        )}
      </div>
    </section>
  );
}

function HowItWorks() {
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

function Features() {
  return (
    <section className="px-6 py-24 bg-[#F0EDE6] border-t border-[#E8E2D9]">
      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-[#E8E2D9]">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span className="font-mono text-sm">
          lead<span className="text-[#D4622A]">IQ</span>
        </span>

        <p className="text-xs text-[#C4B9A8]">
          AI-powered lead scoring
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="bg-[#FAF9F6] text-[#1A1714] antialiased">
      <Hero />
      <HowItWorks />
      <Features />
      <Footer />
    </main>
  );
}