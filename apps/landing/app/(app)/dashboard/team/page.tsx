import { getTeam } from "@/lib/industry-data";

export default function TeamPage() {
  const team = getTeam();

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Team
          </h1>
          <p className="text-sm text-[#9B8E7E] mt-1">
            Manage your sales reps and lead assignments.
          </p>
        </div>
        <button className="self-start sm:self-auto text-xs font-mono border border-[#E8E2D9] rounded-xl px-4 py-2 text-[#9B8E7E] hover:border-[#C4B9A8] hover:text-[#1A1714] transition-colors whitespace-nowrap">
          + Add member
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E2D9]">
              <th className="text-left px-5 py-3 text-xs font-mono text-[#9B8E7E]">Name</th>
              <th className="text-left px-5 py-3 text-xs font-mono text-[#9B8E7E]">Email</th>
              <th className="text-left px-5 py-3 text-xs font-mono text-[#9B8E7E]">Role</th>
              <th className="text-left px-5 py-3 text-xs font-mono text-[#9B8E7E]">Leads</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member, i) => (
              <tr
                key={member.id}
                className={`border-b border-[#E8E2D9] last:border-0 hover:bg-[#FAF9F6] transition-colors ${
                  i % 2 === 0 ? "" : "bg-[#FAF9F6]/50"
                }`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#E8E2D9] flex items-center justify-center text-xs font-medium text-[#1A1714] shrink-0">
                      {member.name[0]}
                    </div>
                    <span className="text-sm text-[#1A1714]">{member.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-[#9B8E7E] font-mono">{member.email}</td>
                <td className="px-5 py-3.5">
                  <span className="text-xs bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2.5 py-1 text-[#9B8E7E]">
                    {member.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm font-mono text-[#1A1714]">{member.leads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E8E2D9] flex items-center justify-center text-sm font-medium text-[#1A1714] shrink-0">
                {member.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1714]">{member.name}</p>
                <p className="text-xs text-[#9B8E7E] font-mono">{member.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs bg-[#F0EDE6] border border-[#E8E2D9] rounded-full px-2.5 py-1 text-[#9B8E7E] mb-1">
                {member.role}
              </p>
              <p className="text-xs font-mono text-[#1A1714]">{member.leads} leads</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}