export default function WorkspaceDiagram() {
  return (
    <section className="border-t border-[#E8E2D9] px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-[#C4B9A8]">
              Workspace model
            </p>
            <h2
              className="max-w-xl text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[#1A1714]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Separate team workspaces.
              <em className="text-[#D4622A] not-italic"> One Foundhub control center.</em>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#6E6253]">
              Sales, marketing, support, and ops can run independently inside their own workspace,
              while the founder still sees the full picture in Foundhub.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#E8E2D9] bg-[linear-gradient(135deg,#fffaf4_0%,#fff5ee_52%,#fff1e6_100%)] p-6">
            <div className="rounded-2xl bg-[#1A1714] p-5 text-[#FAF9F6]">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">
                Foundhub layout
              </p>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1.1fr] sm:items-center">
                <div className="space-y-3">
                  {["Sales Workspace", "Marketing Workspace", "Support Workspace"].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center text-[#D4622A]">
                  <div className="hidden flex-col items-center gap-2 sm:flex">
                    <span className="text-lg">┐</span>
                    <span className="text-lg">┤</span>
                    <span className="text-lg">┘</span>
                  </div>
                  <div className="font-mono text-xs uppercase tracking-[0.2em] sm:ml-2">flow</div>
                </div>

                <div className="rounded-2xl border border-[#D4622A]/30 bg-[#D4622A]/10 px-5 py-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F5C8A1]">
                    Founder view
                  </p>
                  <p
                    className="mt-2 text-2xl leading-none text-white"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                  >
                    FOUNDHUB
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    Billing, forms, lead flow, and workspace activity managed from one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
