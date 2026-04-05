export default function SocialProof() {
  return (
    <section className="px-6 py-16 border-t border-[#E8E2D9]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          
          {/* Counter */}
          <div className="text-center sm:text-left">
            <p className="font-mono text-5xl font-medium text-[#1A1714]">20+</p>
            <p className="text-sm text-[#9B8E7E] mt-1">sales teams on the waitlist</p>
          </div>

          <div className="hidden sm:block w-px h-12 bg-[#E8E2D9]" />

          <div className="text-center sm:text-left">
            <p className="font-mono text-5xl font-medium text-[#1A1714]">2s</p>
            <p className="text-sm text-[#9B8E7E] mt-1">average lead scoring time</p>
          </div>

          <div className="hidden sm:block w-px h-12 bg-[#E8E2D9]" />

          <div className="text-center sm:text-left">
            <p className="font-mono text-5xl font-medium text-[#1A1714]">3x</p>
            <p className="text-sm text-[#9B8E7E] mt-1">faster rep response on hot leads</p>
          </div>

        </div>

        {/* Quote */}
        <div className="mt-12 bg-[#F0EDE6] border border-[#E8E2D9] rounded-2xl px-8 py-6">
          <p
            className="text-lg text-[#1A1714] leading-relaxed"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            "We were spending 2 hours a day chasing leads that were never going to buy.
            Foundhub fixes exactly that."
          </p>
          <p className="text-xs text-[#9B8E7E] mt-4 font-mono">
            — Early beta user, EdTech startup
          </p>
        </div>

      </div>
    </section>
  );
}
