import { Lead } from "@/lib/industry-data";
import Link from "next/link";

const scoreConfig = {
  Hot: {
    badge: "bg-red-50 border-red-200 text-red-700",
    dot: "bg-red-500",
  },
  Warm: {
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-400",
  },
  Cold: {
    badge: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-400",
  },
};

export default function LeadCard({ lead }: { lead: Lead }) {
  const config = scoreConfig[lead.score];

  return (

     <Link href={`/dashboard/leads/${lead.id}`}>
    <div className="bg-white border border-[#E8E2D9] rounded-2xl p-5 hover:border-[#C4B9A8] transition-colors duration-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-sm font-medium text-[#1A1714]">{lead.name}</p>
          <p className="text-xs text-[#9B8E7E]">
            {lead.email} · {lead.interest}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 border text-xs font-medium rounded-full px-2.5 py-1 ${config.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
            {lead.score}
          </span>
        </div>
      </div>

      {/* Context */}
      <div className="bg-[#F0EDE6] rounded-lg px-3 py-2.5 mb-3">
        <p className="text-xs text-[#9B8E7E] italic leading-relaxed">
          "{lead.context}"
        </p>
      </div>

      {/* Reason + footer */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#C4B9A8]">
          {lead.assignedTo ? (
            <>Routed to → <span className="text-[#1A1714] font-medium">{lead.assignedTo}</span></>
          ) : (
            "Unassigned"
          )}
        </p>
        <span className="text-xs text-[#D4622A] font-medium">{lead.time}</span>
      </div>

      {/* AI Reason */}
      <div className="mt-3 pt-3 border-t border-[#E8E2D9]">
        <p className="text-[10px] font-mono text-[#9B8E7E]">
          AI: {lead.reason}
        </p>
      </div>
    </div>
    </Link>
  );
}