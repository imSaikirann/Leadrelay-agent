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
    tag: "scoring",
    title: "AI scoring that reads intent, not just form fields.",
    description:
      "Foundhub reads urgency, goals, buying language, and timeline from every submission so your team sees real buying signal instead of shallow tags.",
  },
  {
    icon: <Bell className="h-4 w-4" />,
    tag: "alerts",
    title: "Every hot lead lands with context attached.",
    description:
      "Sales does not just get a name and email. They get the score, the reason, and the exact details that made the lead urgent.",
  },
  {
    icon: <Users className="h-4 w-4" />,
    tag: "crm",
    title: "Separate workspaces for separate teams.",
    description:
      "Create dedicated workspaces for sales, marketing, support, and ops, then manage access and activity from one founder view.",
  },
  {
    icon: <Code2 className="h-4 w-4" />,
    tag: "embed",
    title: "Forms go live fast, scoring starts immediately.",
    description:
      "Drop your form on a landing page, campaign page, or webinar signup and start collecting and routing inbound leads right away.",
  },
  {
    icon: <Zap className="h-4 w-4" />,
    tag: "transparency",
    title: "Founders keep one operating layer across all teams.",
    description:
      "Billing, team setup, workspaces, and lead flow stay in one place, even when each team runs its own queue and form workflow.",
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    tag: "analytics",
    title: "See which workspaces and channels actually convert.",
    description:
      "Track lead quality, volume, and conversion trends so you can see which team spaces and sources produce real pipeline.",
  },
  {
    icon: <Layout className="h-4 w-4" />,
    tag: "forms",
    title: "Industry-ready forms with sensible defaults.",
    description:
      "Get ready-to-use forms for EdTech, SaaS, coaching, real estate, and more. Default fields, options, and prompts are already set up for launch.",
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
              What you get
            </p>
            <h2
              className="max-w-md text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[#1A1714] dark:text-[#F5F1EB]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              One dashboard for founders.
              <em className="text-[#D4622A] not-italic"> Separate workspaces for every team.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#9B8E7E] dark:text-[#B8ADA0] md:text-right">
            Built for companies that want sales, marketing, support, and ops to move separately
            without losing founder control.
          </p>
        </div>

        <div className="grid gap-px rounded-t-2xl border border-[#E8E2D9] bg-[#E8E2D9] dark:border-white/10 dark:bg-white/10 sm:grid-cols-2 md:grid-cols-3">
          {firstSix.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="overflow-hidden rounded-b-2xl border-b border-x border-[#E8E2D9] dark:border-white/10">
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
            {["EdTech", "SaaS", "Coaching", "Real Estate", "Healthcare", "Agency"].map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-[#E8E2D9] bg-[#F0EDE6] px-2.5 py-1 font-mono text-[10px] text-[#9B8E7E] dark:border-white/10 dark:bg-[#222222] dark:text-[#B8ADA0]"
              >
                {industry}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
