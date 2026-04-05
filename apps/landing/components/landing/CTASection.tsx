import { CustomButton } from "@/components/common/CustomButton";

export default function CTASection() {
  return (
    <section className="border-t border-[#E8E2D9] px-6 py-24 dark:border-white/10">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-[#E8E2D9] bg-[linear-gradient(135deg,#fffaf4_0%,#fff3e8_52%,#ffeedf_100%)] px-6 py-10 dark:border-white/10 dark:bg-[linear-gradient(135deg,#181614_0%,#211914_52%,#2a1c14_100%)] sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-[#C4B9A8] dark:text-[#8E8377]">
          Final call
        </p>
        <h2
          className="mt-3 max-w-2xl text-[clamp(1.9rem,4vw,3.1rem)] leading-tight text-[#1A1714] dark:text-[#F5F1EB]"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          If your business is still running from five tools,
          <em className="text-[#D4622A] not-italic"> it is already costing you.</em>
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6E6253] dark:text-[#B8ADA0]">
          FoundHub gives you the clarity to focus, the system to follow through, and the visibility
          to scale without chaos. Start before more leads, more team members, and more moving parts
          make the mess harder to untangle.
        </p>

        <div className="mt-8">
          <CustomButton href="/login">Start Your FoundHub Trial</CustomButton>
        </div>
      </div>
    </section>
  );
}
