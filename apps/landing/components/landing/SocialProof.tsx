export default function SocialProof() {
  return (
    <section className="border-t border-[#E8E2D9] px-6 py-16 dark:border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          
          {/* Counter */}
          <div className="text-center sm:text-left">
            <p className="font-mono text-5xl font-medium text-[#1A1714] dark:text-[#F5F1EB]">20+</p>
            <p className="mt-1 text-sm text-[#9B8E7E] dark:text-[#B8ADA0]">sales teams on the waitlist</p>
          </div>

          <div className="hidden h-12 w-px bg-[#E8E2D9] dark:bg-white/10 sm:block" />

          <div className="text-center sm:text-left">
            <p className="font-mono text-5xl font-medium text-[#1A1714] dark:text-[#F5F1EB]">2s</p>
            <p className="mt-1 text-sm text-[#9B8E7E] dark:text-[#B8ADA0]">average lead scoring time</p>
          </div>

          <div className="hidden h-12 w-px bg-[#E8E2D9] dark:bg-white/10 sm:block" />

          <div className="text-center sm:text-left">
            <p className="font-mono text-5xl font-medium text-[#1A1714] dark:text-[#F5F1EB]">3x</p>
            <p className="mt-1 text-sm text-[#9B8E7E] dark:text-[#B8ADA0]">faster rep response on hot leads</p>
          </div>

        </div>

        {/* Quote */}
        <div className="mt-12 rounded-2xl border border-[#E8E2D9] bg-[#F0EDE6] px-8 py-6 dark:border-white/10 dark:bg-[#191919]">
          <p
            className="text-lg leading-relaxed text-[#1A1714] dark:text-[#F5F1EB]"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            "We were spending 2 hours a day chasing leads that were never going to buy.
            Foundhub fixes exactly that."
          </p>
          <p className="mt-4 font-mono text-xs text-[#9B8E7E] dark:text-[#B8ADA0]">
            — Early beta user, EdTech startup
          </p>
        </div>

      </div>
    </section>
  );
}
