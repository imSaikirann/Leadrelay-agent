"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";

type ImportRow = Record<string, string>;
type ImportState = "idle" | "preview" | "uploading" | "done";

const MESSAGE_ALIASES = [
  "message", "msg", "notes", "note", "description",
  "query", "enquiry", "inquiry", "comment", "comments",
  "requirement", "requirements", "details", "info",
];

function normalizeRows(raw: ImportRow[]): { rows: ImportRow[]; detectedAlias: string | null } {
  let detectedAlias: string | null = null;
  const rows = raw.map((row) => {
    const clean: ImportRow = {};
    for (const [k, v] of Object.entries(row))
      clean[k.toLowerCase().trim().replace(/\s+/g, "_")] = String(v ?? "").trim();
    return clean;
  });
  const alias = Object.keys(rows[0] ?? {}).find((k) => MESSAGE_ALIASES.includes(k) && k !== "message");
  if (alias) {
    detectedAlias = alias;
    for (const row of rows) { if (!row.message) { row.message = row[alias]; delete row[alias]; } }
  }
  return { rows, detectedAlias };
}

export default function LeadsImportButton({ formId, onImported }: { formId?: string; onImported?: () => void }) {
  const fileRef                   = useRef<HTMLInputElement>(null);
  const [open, setOpen]           = useState(false);
  const [state, setState]         = useState<ImportState>("idle");
  const [rows, setRows]           = useState<ImportRow[]>([]);
  const [headers, setHeaders]     = useState<string[]>([]);
  const [aliasNote, setAliasNote] = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  function reset() {
    setState("idle"); setRows([]); setHeaders([]);
    setAliasNote(null); setError(null); setResultMsg(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function parseFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target!.result as ArrayBuffer), { type: "array" });
        const raw: ImportRow[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
        if (!raw.length) { setError("Sheet is empty."); return; }
        const { rows: normalized, detectedAlias } = normalizeRows(raw);
        if (!Object.keys(normalized[0]).includes("message")) {
          setError(`No message column. Accepted: ${MESSAGE_ALIASES.join(", ")}. Found: ${Object.keys(normalized[0]).join(", ")}`);
          return;
        }
        setHeaders(Object.keys(normalized[0]));
        setRows(normalized.slice(0, 5));
        setAliasNote(detectedAlias ? `"${detectedAlias}" mapped → "message"` : null);
        setError(null); setState("preview");
      } catch { setError("Could not parse file."); }
    };
    reader.readAsArrayBuffer(file);
  }

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) { setError("File missing."); return; }
    setState("uploading"); setError(null);
    try {
      const wb = XLSX.read(new Uint8Array(await file.arrayBuffer()), { type: "array" });
      const { rows: allRows } = normalizeRows(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" }));
      const res = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, rows: allRows }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setResultMsg(`✓ Imported ${json.imported} leads.`);
      setState("done");
      onImported?.();
    } catch (err: any) { setError(err.message); setState("preview"); }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
          bg-white border border-[#E8E2D9] text-[#9B8E7E] hover:text-[#1A1714] hover:border-[#C4B9A8] transition-all shadow-sm">
        <UploadIcon /> Import
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setOpen(false); reset(); }} />
          <div className="relative bg-white rounded-2xl border border-[#E8E2D9] shadow-xl w-full max-w-lg">

            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D9]">
              <div>
                <h2 className="text-base text-[#1A1714]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Import Leads</h2>
                <p className="text-xs text-[#9B8E7E] font-mono mt-0.5">.xlsx or .csv · <span className="text-[#D4622A]">message</span> column required</p>
              </div>
              <button onClick={() => { setOpen(false); reset(); }} className="text-[#C4B9A8] hover:text-[#1A1714]">
                <CloseIcon />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3">
              {state === "idle" && (
                <div onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) parseFile(f); }}
                  onDragOver={(e) => e.preventDefault()} onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-[#E8E2D9] rounded-xl py-10 flex flex-col items-center gap-2 cursor-pointer hover:border-[#D4622A] hover:bg-[#FAF9F6] transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#F0EDE6] flex items-center justify-center group-hover:bg-[#FDF0EB]">
                    <UploadIcon className="text-[#9B8E7E] group-hover:text-[#D4622A]" size={18} />
                  </div>
                  <p className="text-sm text-[#9B8E7E] font-mono">Drop file or <span className="text-[#D4622A]">browse</span></p>
                  <p className="text-xs text-[#C4B9A8] font-mono">.xlsx · .xls · .csv</p>
                </div>
              )}

              {aliasNote && <div className="rounded-xl px-4 py-2 bg-amber-50 border border-amber-200"><p className="text-xs font-mono text-amber-600">⚡ {aliasNote}</p></div>}
              {error && (
                <div className="rounded-xl px-4 py-3 bg-red-50 border border-red-200">
                  <p className="text-xs font-mono text-red-600">{error}</p>
                  <button onClick={reset} className="mt-1 text-xs font-mono text-red-400 underline">Try again</button>
                </div>
              )}

              {state === "preview" && !error && (
                <div className="rounded-xl border border-[#E8E2D9] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead className="bg-[#F0EDE6]">
                        <tr>{headers.map((h) => <th key={h} className={`px-3 py-2 text-left whitespace-nowrap font-medium ${h === "message" ? "text-[#D4622A]" : "text-[#9B8E7E]"}`}>{h}{h === "message" && <span className="ml-1 opacity-60">*</span>}</th>)}</tr>
                      </thead>
                      <tbody>
                        {rows.map((row, i) => <tr key={i} className="border-t border-[#E8E2D9]">{headers.map((h) => <td key={h} className="px-3 py-2 text-[#1A1714] max-w-[140px] truncate">{row[h] || "—"}</td>)}</tr>)}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-3 py-2 bg-[#FAF9F6] border-t border-[#E8E2D9]"><p className="text-[10px] font-mono text-[#C4B9A8]">Showing first 5 rows</p></div>
                </div>
              )}

              {state === "uploading" && <div className="py-8 flex flex-col items-center gap-3"><div className="w-8 h-8 rounded-full border-2 border-[#D4622A] border-t-transparent animate-spin" /><p className="text-sm font-mono text-[#9B8E7E]">Importing…</p></div>}
              {state === "done" && resultMsg && <div className="rounded-xl px-4 py-4 bg-green-50 border border-green-200 text-center"><p className="text-sm font-mono text-green-700">{resultMsg}</p></div>}
            </div>

            <div className="px-6 pb-5 flex justify-end gap-2">
              {state === "done"
                ? <button onClick={() => { setOpen(false); reset(); }} className="px-4 py-2 rounded-xl text-sm font-mono bg-[#1A1714] text-white">Done</button>
                : <>
                    <button onClick={() => { setOpen(false); reset(); }} className="px-4 py-2 rounded-xl text-sm font-mono text-[#9B8E7E]">Cancel</button>
                    {state === "preview" && !error && <button onClick={handleUpload} className="px-4 py-2 rounded-xl text-sm font-mono bg-[#D4622A] text-white hover:bg-[#B8501F]">Import all rows</button>}
                  </>
              }
            </div>
          </div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) parseFile(f); }} />
        </div>
      )}
    </>
  );
}

function UploadIcon({ className = "text-[#9B8E7E]", size = 14 }: { className?: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}><path d="M8 10V3M8 3L5 6M8 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 11v1.5A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
function CloseIcon() {
  return <svg width={16} height={16} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}