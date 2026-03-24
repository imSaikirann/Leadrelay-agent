"use client";

import * as XLSX from "xlsx";

type Submission = {
  id: string;
  data: any;
  rank: string | null;
  rankReason: string | null;
  createdAt: Date;
  form: { name: string } | null;
};

export default function LeadsExportButton({ submissions }: { submissions: Submission[] }) {
  function handleExport() {
    const rows = submissions.map((s) => ({
      ...s.data,
      rank: s.rank ?? "pending",
      rank_reason: s.rankReason ?? "",
      form: s.form?.name ?? "imported",
      created_at: new Date(s.createdAt).toLocaleDateString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, `leads-${Date.now()}.xlsx`);
  }

  return (
    <button onClick={handleExport} disabled={!submissions.length}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
        bg-white border border-[#E8E2D9] text-[#9B8E7E] hover:text-[#1A1714] hover:border-[#C4B9A8]
        transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
      <DownloadIcon /> Export
    </button>
  );
}

function DownloadIcon() {
  return <svg width={14} height={14} viewBox="0 0 16 16" fill="none"><path d="M8 3v7M8 10l-3-3M8 10l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 11v1.5A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}