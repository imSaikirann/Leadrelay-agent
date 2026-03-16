"use client";

import { useState, useEffect } from "react";
import { Link2, Code2, Eye, Copy, Check, Plus, Trash2, GripVertical, Save } from "lucide-react";

type FieldType = "text" | "email" | "phone" | "select" | "textarea";

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface LeadForm {
  id: string;
  name: string;
  slug: string;
  fields: FormField[];
  _count?: { submissions: number };
}

const defaultFields: FormField[] = [
  { id: "1", label: "Full name", type: "text", placeholder: "Enter your full name", required: true },
  { id: "2", label: "Email address", type: "email", placeholder: "Enter your email", required: true },
  { id: "3", label: "Phone number", type: "phone", placeholder: "Enter your phone number", required: false },
];

type Tab = "builder" | "preview" | "share";

export default function FormPage() {
  const [tab, setTab] = useState<Tab>("builder");
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [companySlug, setCompanySlug] = useState("your-company");

  const [forms, setForms] = useState<LeadForm[]>([]);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [creatingForm, setCreatingForm] = useState(false);
  const [newFormName, setNewFormName] = useState("");

  // Load all forms + company slug
  useEffect(() => {
    fetch("/api/form")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setForms(list);
        if (list.length > 0) {
          setActiveFormId(list[0].id);
          setFields(list[0].fields ?? defaultFields);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/onboarding")
      .then((r) => r.json())
      .then((data) => {
        if (data?.name) setCompanySlug(data.name.toLowerCase().replace(/\s+/g, "-"));
      })
      .catch(() => {});
  }, []);

  const activeForm = forms.find((f) => f.id === activeFormId);
  const formLink = `${typeof window !== "undefined" ? window.location.origin : ""}/f/${companySlug}/${activeForm?.slug ?? ""}`;
  const snippet = `<script src="https://inboq.io/embed.js" data-company="${companySlug}" data-form="${activeForm?.slug ?? ""}" async></script>`;

  // Switch active form
  const switchForm = (form: LeadForm) => {
    setActiveFormId(form.id);
    setFields(form.fields ?? defaultFields);
    setEditingId(null);
  };

  // Create new form
  const handleCreateForm = async () => {
    const res = await fetch("/api/form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFormName || "Untitled Form", fields: defaultFields }),
    });
    const newForm = await res.json();
    setForms((prev) => [newForm, ...prev]);
    switchForm(newForm);
    setCreatingForm(false);
    setNewFormName("");
  };

  // Save active form
  const handleSave = async () => {
    if (!activeFormId) return;
    setSaving(true);
    try {
      await fetch(`/api/form/${activeFormId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });
      // Update local forms list
      setForms((prev) => prev.map((f) => f.id === activeFormId ? { ...f, fields } : f));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  // Delete form
  const handleDeleteForm = async (id: string) => {
    if (!confirm("Delete this form?")) return;
    await fetch(`/api/form/${id}`, { method: "DELETE" });
    const remaining = forms.filter((f) => f.id !== id);
    setForms(remaining);
    if (activeFormId === id) {
      if (remaining.length > 0) switchForm(remaining[0]);
      else { setActiveFormId(null); setFields(defaultFields); }
    }
  };

  const handleCopy = (type: "snippet" | "link") => {
    navigator.clipboard.writeText(type === "link" ? formLink : snippet);
    if (type === "link") { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
    else { setCopiedSnippet(true); setTimeout(() => setCopiedSnippet(false), 2000); }
  };

  const addField = () => {
    const newField: FormField = { id: Date.now().toString(), label: "New field", type: "text", placeholder: "Enter value", required: false };
    setFields([...fields, newField]);
    setEditingId(newField.id);
  };

  const removeField = (id: string) => setFields(fields.filter((f) => f.id !== id));
  const updateField = (id: string, updates: Partial<FormField>) =>
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "builder", label: "Form Builder", icon: <Plus className="w-3.5 h-3.5" /> },
    { key: "preview", label: "Preview", icon: <Eye className="w-3.5 h-3.5" /> },
    { key: "share", label: "Share & Embed", icon: <Link2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            Lead Forms
          </h1>
          <p className="text-sm text-[#9B8E7E] mt-1">Build, preview and share your lead capture forms.</p>
        </div>
        {tab === "builder" && activeFormId && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 text-xs font-mono px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            style={{
              background: saved ? "#f0fdf4" : "#1A1714",
              color: saved ? "#16a34a" : "#FAF9F6",
              border: saved ? "1px solid #bbf7d0" : "1px solid #1A1714",
            }}
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save form"}
          </button>
        )}
      </div>

      {/* Form selector */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {forms.map((f) => (
          <div key={f.id} className="flex items-center gap-1">
            <button
              onClick={() => switchForm(f)}
              className="text-xs font-mono px-3 py-1.5 rounded-lg border transition-all"
              style={{
                background: activeFormId === f.id ? "#1A1714" : "#FAF9F6",
                color: activeFormId === f.id ? "#FAF9F6" : "#9B8E7E",
                borderColor: activeFormId === f.id ? "#1A1714" : "#E8E2D9",
              }}
            >
              {f.name}
              {f._count && (
                <span className="ml-1.5 opacity-60">{f._count.submissions}</span>
              )}
            </button>
            <button onClick={() => handleDeleteForm(f.id)} className="text-[#C4B9A8] hover:text-red-500 transition-colors">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}

        {creatingForm ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={newFormName}
              onChange={(e) => setNewFormName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateForm(); if (e.key === "Escape") setCreatingForm(false); }}
              placeholder="Form name..."
              className="text-xs font-mono bg-[#FAF9F6] border border-[#D4622A] rounded-lg px-3 py-1.5 outline-none text-[#1A1714]"
            />
            <button onClick={handleCreateForm} className="text-xs font-mono text-white bg-[#D4622A] px-3 py-1.5 rounded-lg">Create</button>
            <button onClick={() => setCreatingForm(false)} className="text-xs font-mono text-[#9B8E7E]">Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => setCreatingForm(true)}
            className="text-xs font-mono border border-dashed border-[#C4B9A8] rounded-lg px-3 py-1.5 text-[#9B8E7E] hover:border-[#D4622A] hover:text-[#D4622A] transition-colors"
          >
            + New form
          </button>
        )}
      </div>

      {/* No forms empty state */}
      {!loading && forms.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[#E8E2D9] rounded-2xl max-w-2xl">
          <p className="text-sm text-[#9B8E7E] font-mono mb-3">No forms yet.</p>
          <button onClick={() => setCreatingForm(true)} className="text-xs text-[#D4622A] font-mono hover:underline">
            + Create your first form
          </button>
        </div>
      )}

      {/* Tabs — only show if form selected */}
      {activeFormId && (
        <>
          <div className="flex gap-1 bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl p-1 mb-6 w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all duration-150 ${
                  tab === t.key ? "bg-white text-[#1A1714] shadow-sm border border-[#E8E2D9]" : "text-[#9B8E7E] hover:text-[#1A1714]"
                }`}
              >
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* ── BUILDER TAB ── */}
          {tab === "builder" && (
            <div className="max-w-2xl">
              {loading ? (
                <div className="text-center py-16 text-sm text-[#9B8E7E] font-mono">Loading...</div>
              ) : (
                <>
                  <div className="flex flex-col gap-3 mb-4">
                    {fields.map((field) => (
                      <div key={field.id} className="bg-white border border-[#E8E2D9] rounded-2xl p-4 hover:border-[#C4B9A8] transition-colors">
                        {editingId === field.id ? (
                          <div className="flex flex-col gap-3">
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] font-mono text-[#9B8E7E] mb-1 block">Label</label>
                                <input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })}
                                  className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors" />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono text-[#9B8E7E] mb-1 block">Field type</label>
                                <select value={field.type} onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                                  className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1714] font-mono outline-none appearance-none focus:border-[#D4622A] transition-colors">
                                  <option value="text">Text</option>
                                  <option value="email">Email</option>
                                  <option value="phone">Phone</option>
                                  <option value="select">Dropdown</option>
                                  <option value="textarea">Textarea</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-[#9B8E7E] mb-1 block">Placeholder</label>
                              <input value={field.placeholder} onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors" />
                            </div>
                            {field.type === "select" && (
                              <div>
                                <label className="text-[10px] font-mono text-[#9B8E7E] mb-1 block">Options (comma separated)</label>
                                <input value={field.options?.join(", ") ?? ""}
                                  onChange={(e) => updateField(field.id, { options: e.target.value.split(",").map((o) => o.trim()) })}
                                  className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors"
                                  placeholder="Option 1, Option 2" />
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <div onClick={() => updateField(field.id, { required: !field.required })}
                                  className={`relative w-8 h-4 rounded-full transition-colors duration-200 cursor-pointer ${field.required ? "bg-[#1A1714]" : "bg-[#E8E2D9]"}`}>
                                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${field.required ? "translate-x-4" : "translate-x-0.5"}`} />
                                </div>
                                <span className="text-xs font-mono text-[#9B8E7E]">Required</span>
                              </label>
                              <button onClick={() => setEditingId(null)}
                                className="text-xs font-mono bg-[#1A1714] text-[#FAF9F6] px-3 py-1.5 rounded-lg hover:bg-[#2C2825] transition-colors">
                                Done
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <GripVertical className="w-4 h-4 text-[#C4B9A8] shrink-0" />
                              <div>
                                <p className="text-sm text-[#1A1714] font-medium">{field.label}</p>
                                <p className="text-[10px] font-mono text-[#9B8E7E]">{field.type}{field.required && " · required"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setEditingId(field.id)}
                                className="text-xs font-mono text-[#9B8E7E] hover:text-[#1A1714] border border-[#E8E2D9] rounded-lg px-2.5 py-1 hover:border-[#C4B9A8] transition-colors">
                                Edit
                              </button>
                              <button onClick={() => removeField(field.id)} className="text-[#C4B9A8] hover:text-red-500 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={addField}
                    className="w-full border border-dashed border-[#C4B9A8] rounded-2xl py-3 text-xs font-mono text-[#9B8E7E] hover:border-[#D4622A] hover:text-[#D4622A] transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-3.5 h-3.5" />Add field
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── PREVIEW TAB ── */}
          {tab === "preview" && (
            <div className="max-w-md">
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl text-[#1A1714] mb-2" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                  {activeForm?.name}
                </h3>
                <p className="text-xs text-[#9B8E7E] font-mono mb-6">Fill in your details and we'll get back to you.</p>
                <div className="flex flex-col gap-4">
                  {fields.map((field) => (
                    <div key={field.id}>
                      <label className="text-xs font-mono text-[#9B8E7E] mb-1.5 block">
                        {field.label}{field.required && <span className="text-[#D4622A] ml-0.5">*</span>}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea placeholder={field.placeholder}
                          className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] placeholder:text-[#C4B9A8] resize-none h-20 font-mono outline-none focus:border-[#D4622A] transition-colors" />
                      ) : field.type === "select" ? (
                        <select className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none appearance-none focus:border-[#D4622A] transition-colors">
                          <option value="">Select an option</option>
                          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={field.type} placeholder={field.placeholder}
                          className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] placeholder:text-[#C4B9A8] font-mono outline-none focus:border-[#D4622A] transition-colors" />
                      )}
                    </div>
                  ))}
                  <div className="w-full bg-[#1A1714] text-[#FAF9F6] text-sm font-mono py-3 rounded-xl text-center mt-2 cursor-pointer hover:bg-[#2C2825] transition-colors">
                    Submit
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SHARE TAB ── */}
          {tab === "share" && (
            <div className="max-w-2xl flex flex-col gap-4">
              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="w-4 h-4 text-[#D4622A]" />
                  <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest">Shareable link</p>
                </div>
                <p className="text-xs text-[#9B8E7E] mb-4">Share this link directly with anyone.</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 font-mono text-xs text-[#9B8E7E] truncate">{formLink}</div>
                  <button onClick={() => handleCopy("link")}
                    className={`flex items-center gap-2 text-xs font-mono px-4 py-3 rounded-xl border transition-colors whitespace-nowrap ${copiedLink ? "bg-green-50 border-green-200 text-green-700" : "bg-[#1A1714] text-[#FAF9F6] border-[#1A1714] hover:bg-[#2C2825]"}`}>
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? "Copied!" : "Copy link"}
                  </button>
                </div>
                <a href={formLink} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D4622A] hover:underline mt-3">
                  Open form →
                </a>
              </div>

              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-4 h-4 text-[#D4622A]" />
                  <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest">Embed on your website</p>
                </div>
                <div className="bg-[#1A1714] rounded-xl p-4 relative mb-3">
                  <p className="font-mono text-xs text-[#F5C27A] break-all leading-relaxed pr-16">{snippet}</p>
                  <button onClick={() => handleCopy("snippet")}
                    className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg transition-colors ${copiedSnippet ? "bg-green-700 text-white" : "bg-[#2C2825] text-[#FAF9F6] hover:bg-[#D4622A]"}`}>
                    {copiedSnippet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedSnippet ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-[10px] font-mono text-[#C4B9A8]">Paste before the closing {"</body>"} tag.</p>
              </div>

              <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
                <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-4">Form stats</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-mono font-medium text-[#1A1714]">
                      {activeForm?._count?.submissions ?? 0}
                    </p>
                    <p className="text-[10px] font-mono text-[#9B8E7E] mt-0.5">Total submissions</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}