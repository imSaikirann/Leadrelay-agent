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
    title: "It reads what they wrote, not who they are.",
    description:
      "Job title tells you nothing. Inboq reads the context field, the goal, the urgency, the timeline and scores from that. Real signal, not surface data.",
  },
  {
    icon: <Bell className="h-4 w-4" />,
    tag: "alerts",
    title: "Your rep knows before they pick up the phone.",
    description:
      "Hot lead comes in, your rep gets notified with the full picture. Not just a name. The exact reason they scored hot, word for word.",
  },
  {
    icon: <Users className="h-4 w-4" />,
    tag: "crm",
    title: "A CRM that doesn't need a manual.",
    description:
      "Add your team, assign leads, track what happened. Built for a 3-person sales floor, not a 300-person enterprise. No onboarding call required.",
  },
  {
    icon: <Code2 className="h-4 w-4" />,
    tag: "embed",
    title: "One line of code. Works anywhere.",
    description:
      "Drop a script tag on your landing page, course page, or webinar signup. The form appears, leads flow in, scoring starts. That's it.",
  },
  {
    icon: <Zap className="h-4 w-4" />,
    tag: "transparency",
    title: "No black box. Your rep sees the why.",
    description:
      "Every score comes with a reason. 'Mentioned a 30-day deadline and company budget.' Your rep can make a judgment call — the AI just does the reading.",
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    tag: "analytics",
    title: "Which channels bring buyers, not browsers.",
    description:
      "Track your hot rate week over week. See which sources send serious leads. Stop spending on traffic that never converts.",
  },
  {
    icon: <Layout className="h-4 w-4" />,
    tag: "forms",
    title: "A default form that knows your industry.",
    description:
      "Sign up and get a ready-to-use form built for your industry - EdTech, SaaS, Coaching, Real Estate and more. Fields, options, and context prompts already set up. Customise everything or ship it as-is.",
    wide: true,
  },
];

export default function Features() {
  const firstSix = features.slice(0, 6);
  const last = features[6];

  return (
    <section className="px-6 py-24 border-t border-[#E8E2D9]">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-mono text-xs text-[#C4B9A8] uppercase tracking-widest mb-4">
              What you get
            </p>
            <h2
              className="text-[clamp(1.8rem,4vw,3rem)] text-[#1A1714] leading-tight max-w-sm"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Everything your team needs.
              <em className="text-[#D4622A] not-italic"> Nothing they don't.</em>
            </h2>
          </div>
          <p className="text-sm text-[#9B8E7E] leading-relaxed max-w-xs md:text-right">
            Built for small sales teams who want to move fast without buying a platform they'll never fully use.
          </p>
        </div>

        {/* 6-card grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-[#E8E2D9] border border-[#E8E2D9] rounded-t-2xl overflow-hidden">
          {firstSix.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

        {/* 7th card — full width */}
        <div className="border-x border-b border-[#E8E2D9] rounded-b-2xl overflow-hidden">
          <FeatureCard {...last} wide />
        </div>

      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description, tag, wide }: FeatureCardProps) {
  return (
    <div
      className={`group bg-[#FAF9F6] hover:bg-white transition-colors duration-200 p-6 flex gap-4 ${
        wide ? "flex-col sm:flex-row sm:items-start" : "flex-col"
      }`}
    >
      {/* Top row */}
      <div className={`flex items-center justify-between ${wide ? "sm:flex-col sm:items-start sm:gap-3 shrink-0" : ""}`}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EDE6] text-[#2C2825] group-hover:bg-[#D4622A] group-hover:text-white transition-colors duration-200">
          {icon}
        </div>
        <span className="font-mono text-[10px] text-[#C4B9A8] uppercase tracking-widest border border-[#E8E2D9] rounded-full px-2 py-0.5">
          {tag}
        </span>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-sm font-medium text-[#1A1714] leading-snug mb-2">
          {title}
        </h3>
        <p className="text-xs text-[#9B8E7E] leading-relaxed">
          {description}
        </p>

        {/* Industry pills — only on wide card */}
        {wide && (
          <div className="flex flex-wrap gap-2 mt-4">
            {["EdTech", "SaaS", "Coaching", "Real Estate", "Healthcare", "Agency"].map((ind) => (
              <span
                key={ind}
                className="font-mono text-[10px] text-[#9B8E7E] bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2.5 py-1"
              >
                {ind}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}