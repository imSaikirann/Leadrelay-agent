const painPoints = [
  "Leads are coming from forms, WhatsApp, and DMs, but no one sees the full picture.",
  "Follow-ups live in chats, spreadsheets, and memory instead of one reliable system.",
  "You keep asking the same questions: Who replied? Which lead matters? What is stuck?",
];

export default function ProblemSection() {
  return (
    <section className="border-t border-[#E8E2D9] px-6 py-24 dark:border-white/10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#C4B9A8] dark:text-[#8E8377]">
              The problem
            </p>
            <h2
              className="max-w-lg text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[#1A1714] dark:text-[#F5F1EB]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              You are not short on effort.
              <em className="text-[#D4622A] not-italic"> You are short on visibility.</em>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#6E6253] dark:text-[#B8ADA0]">
              A lead lands on your site. Another comes through WhatsApp. Someone updates a sheet.
              Someone else says “followed up” in chat. The CRM is half-filled. The real status of
              the business lives in your head.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#6E6253] dark:text-[#B8ADA0]">
              That is why founders work all day and still feel behind. Hot leads go cold. Team
              accountability gets fuzzy. Decisions get delayed because clarity never shows up in one
              place.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#E8E2D9] bg-white p-6 dark:border-white/10 dark:bg-[#151515]">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9B8E7E] dark:text-[#A99C8B]">
              What chaos looks like
            </p>
            <div className="mt-5 grid gap-3">
              {painPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#E8E2D9] bg-[#FAF9F6] px-4 py-4 dark:border-white/10 dark:bg-[#1C1C1C]"
                >
                  <p className="text-sm leading-6 text-[#1A1714] dark:text-[#F5F1EB]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-[#E8E2D9] bg-[#FFF8F2] px-4 py-4 dark:border-white/10 dark:bg-[#211914]">
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#D4622A]">
                The cost
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6E6253] dark:text-[#B8ADA0]">
                You keep checking five tools to answer one simple question: what actually needs my
                attention right now?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
