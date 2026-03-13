const leads = [
  {
    name: "Priya Sharma",
    email: "priya@techstartup.io",
    course: "Full-Stack Bootcamp",
    context: "Looking to switch careers in 30 days. Company is sponsoring fees. Need to enroll ASAP.",
    score: "Hot",
    rep: "Arjun",
    time: "2s ago",
    scoreColor: "bg-red-50 border-red-200 text-red-700",
    dot: "bg-red-500",
  },
  {
    name: "Rahul Mehta",
    email: "rahul@gmail.com",
    course: "Data Science",
    context: "Exploring options, comparing a few programs. Not in a rush.",
    score: "Warm",
    rep: null,
    time: "1m ago",
    scoreColor: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-400",
  },
];

export default function LeadCardPreview() {
  return (
    <div className="max-w-4xl mx-auto w-full pb-20 px-6">
      <p className="font-mono text-xs text-[#C4B9A8] uppercase tracking-widest mb-4">
        Live preview
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        {leads.map((lead) => (
          <div
            key={lead.name}
            className="flex-1 bg-white border border-[#E8E2D9] rounded-2xl p-5 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-[#1A1714]">{lead.name}</p>
                <p className="text-xs text-[#9B8E7E]">
                  {lead.email} · {lead.course}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 ${lead.scoreColor}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${lead.dot} animate-pulse`} />
                {lead.score}
              </span>
            </div>

            {/* Context */}
            <div className="bg-[#F0EDE6] rounded-lg px-3 py-2.5 mb-3">
              <p className="text-xs text-[#9B8E7E] italic leading-relaxed">
                "{lead.context}"
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {lead.rep ? (
                <p className="text-xs text-[#C4B9A8]">
                  Routed to →{" "}
                  <span className="text-[#1A1714] font-medium">
                    {lead.rep} (Sales)
                  </span>
                </p>
              ) : (
                <p className="text-xs text-[#C4B9A8]">In CRM — awaiting follow-up</p>
              )}
              <span className="text-xs text-[#D4622A] font-medium">{lead.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}