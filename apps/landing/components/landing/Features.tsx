import React from "react";
import { Brain, Bell, Users, Code2, Zap, BarChart3, Layout } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  wide?: boolean;
}

const features = [
  {
    icon: <Brain className="h-4 w-4" />,
    tag: "lead intelligence",
    title: "Know which leads deserve your time first.",
    description:
      "AI Lead Intelligence classifies leads as hot, warm, or cold so you stop guessing and focus your team on the leads most likely to convert.",
  },
  {
    icon: <Bell className="h-4 w-4" />,
    tag: "follow-up",
    title: "Respond faster with the context already there.",
    description:
      "Your team sees why a lead matters before they reach out, which means better follow-up, faster response time, and fewer missed opportunities.",
  },
  {
    icon: <Users className="h-4 w-4" />,
    tag: "team clarity",
    title: "Create accountability without micromanaging.",
    description:
      "Team and lead management stays clear. You can see ownership, activity, and progress without asking three people for a status update.",
  },
  {
    icon: <Code2 className="h-4 w-4" />,
    tag: "workflow",
    title: "Launch quickly without rebuilding your workflow.",
    description:
      "Capture inbound leads, route them into the right workflow, and start scoring immediately without stitching together extra tools.",
  },
  {
    icon: <Zap className="h-4 w-4" />,
    tag: "visibility",
    title: "See the business clearly without checking five tools.",
    description:
      "FoundHub becomes the one founder dashboard for leads, team activity, marketing signals, and operating flow.",
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    tag: "decision-making",
    title: "Make faster decisions with less mental load.",
    description:
      "You stop piecing together the story manually and start acting on one clear view of what is working, what is stuck, and what needs attention.",
  },
  {
    icon: <Layout className="h-4 w-4" />,
    tag: "fit",
    title: "Start with a setup that already makes sense.",
    description:
      "Built for early-stage founders in edtech, agencies, and service businesses who need clarity quickly, not a complex rollout.",
    wide: true,
  },
];

export default function Features() {
  const firstSix = features.slice(0, 6);
  const last = features[6];

  return (
    <section className="border-t border-[#E8E2D9] px-6 py-24 dark:border-white/10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#C4B9A8] dark:text-[#8E8377]">
              Why founders use it
            </p>
            <h2
              className="max-w-md text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[#1A1714] dark:text-[#F5F1EB]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Benefits that matter to founders.
              <em className="text-[#D4622A] not-italic"> Not a pile of features.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#9B8E7E] dark:text-[#B8ADA0] md:text-right">
            Every part of FoundHub is designed to reduce noise, sharpen focus, and help your team
            move on what actually drives revenue.
          </p>
        </div>

        <div className="grid gap-px rounded-t-2xl border border-[#E8E2D9] bg-[#E8E2D9] dark:border-white/10 dark:bg-white/10 sm:grid-cols-2 md:grid-cols-3">
          {firstSix.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="overflow-hidden rounded-b-2xl border-x border-b border-[#E8E2D9] dark:border-white/10">
          <FeatureCard {...last} wide />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, tag, wide }: FeatureCardProps) {
  return (
    <div
      className={`group flex gap-4 bg-[#FAF9F6] p-6 transition-colors duration-200 hover:bg-white dark:bg-[#151515] dark:hover:bg-[#191919] ${
        wide ? "flex-col sm:flex-row sm:items-start" : "flex-col"
      }`}
    >
      <div className={`flex items-center justify-between ${wide ? "shrink-0 sm:flex-col sm:items-start sm:gap-3" : ""}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EDE6] text-[#2C2825] transition-colors duration-200 group-hover:bg-[#D4622A] group-hover:text-white dark:bg-[#222222] dark:text-[#F5F1EB]">
          {icon}
        </div>
        <span className="rounded-full border border-[#E8E2D9] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#C4B9A8] dark:border-white/10 dark:text-[#8E8377]">
          {tag}
        </span>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium leading-snug text-[#1A1714] dark:text-[#F5F1EB]">{title}</h3>
        <p className="text-xs leading-relaxed text-[#9B8E7E] dark:text-[#B8ADA0]">{description}</p>

        {wide && (
          <div className="mt-4 flex flex-wrap gap-2">
            {["EdTech", "Agencies", "Service Businesses"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-[#E8E2D9] bg-[#F0EDE6] px-2.5 py-1 font-mono text-[10px] text-[#9B8E7E] dark:border-white/10 dark:bg-[#222222] dark:text-[#B8ADA0]"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
