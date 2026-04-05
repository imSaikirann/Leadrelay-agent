import { getAdminLeads } from "@/lib/admin-data";

export default async function AdminLeadsPage() {
  const leads = await getAdminLeads();

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] leading-tight">All Leads</h1>
        <p className="text-sm text-[#666] mt-1">{leads.length} leads across all workspaces</p>
      </div>

      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {["Lead", "Email", "Score", "Company", "Industry", "Submitted"].map((header) => (
                <th key={header} className="text-left px-4 py-3 text-xs font-mono text-[#444] whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-[#1e1e1e] last:border-0">
                <td className="px-4 py-3.5 text-xs text-white">{lead.leadName}</td>
                <td className="px-4 py-3.5 text-[10px] font-mono text-[#777]">{lead.email}</td>
                <td className="px-4 py-3.5 text-[10px] font-mono text-[#D4622A]">{lead.score}</td>
                <td className="px-4 py-3.5">
                  <p className="text-xs text-white">{lead.company}</p>
                  <p className="text-[10px] font-mono text-[#555]">{lead.userName}</p>
                </td>
                <td className="px-4 py-3.5 text-[10px] font-mono text-[#777]">{lead.industry}</td>
                <td className="px-4 py-3.5 text-[10px] font-mono text-[#777]">{lead.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
