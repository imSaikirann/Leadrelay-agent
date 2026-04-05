export default function SocialProof() {
  return (
    <section className="border-t border-[#E8E2D9] px-6 py-16 dark:border-white/10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-mono text-5xl font-medium text-[#1A1714] dark:text-[#F5F1EB]">20+</p>
            <p className="mt-1 text-sm text-[#9B8E7E] dark:text-[#B8ADA0]">founders already testing the workflow</p>
          </div>

          <div className="hidden h-12 w-px bg-[#E8E2D9] dark:bg-white/10 sm:block" />

          <div className="text-center sm:text-left">
            <p className="font-mono text-5xl font-medium text-[#1A1714] dark:text-[#F5F1EB]">2s</p>
            <p className="mt-1 text-sm text-[#9B8E7E] dark:text-[#B8ADA0]">average lead classification time</p>
          </div>

          <div className="hidden h-12 w-px bg-[#E8E2D9] dark:bg-white/10 sm:block" />

          <div className="text-center sm:text-left">
            <p className="font-mono text-5xl font-medium text-[#1A1714] dark:text-[#F5F1EB]">3x</p>
            <p className="mt-1 text-sm text-[#9B8E7E] dark:text-[#B8ADA0]">faster follow-up on high-intent leads</p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              quote:
                "Before FoundHub, our leads were spread across forms, WhatsApp, and team chats. Now I can see exactly which leads matter and who is following up.",
              by: "Aarav S.",
              role: "Founder, EdTech startup",
            },
            {
              quote:
                "We used to waste hours every week figuring out what happened to inbound leads. FoundHub gave us one place to run sales and ops without the chaos.",
              by: "Meera K.",
              role: "Founder, Service business",
            },
            {
              quote:
                "The hot, warm, cold view changed how we work. My team stopped chasing everyone and started focusing on the right people.",
              by: "Rohan P.",
              role: "Founder, Agency",
            },
          ].map((item) => (
            <div
              key={item.by}
              className="rounded-2xl border border-[#E8E2D9] bg-[#F0EDE6] px-5 py-5 dark:border-white/10 dark:bg-[#191919]"
            >
              <p className="text-sm leading-7 text-[#1A1714] dark:text-[#F5F1EB]">"{item.quote}"</p>
              <p className="mt-4 font-mono text-xs text-[#9B8E7E] dark:text-[#B8ADA0]">{item.by}</p>
              <p className="mt-1 text-[11px] text-[#9B8E7E] dark:text-[#B8ADA0]">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
