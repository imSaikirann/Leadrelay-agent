"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Link2, Code2, Eye, Copy, Check, Plus, Trash2, GripVertical } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "email" | "phone" | "select" | "textarea";

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder: string;
  required: boolean;
  options?: string[];
}

// ─── Default fields ───────────────────────────────────────────────────────────

const defaultFields: FormField[] = [
  { id: "1", label: "Full name", type: "text", placeholder: "Enter your full name", required: true },
  { id: "2", label: "Email address", type: "email", placeholder: "Enter your email", required: true },
  { id: "3", label: "Phone number", type: "phone", placeholder: "Enter your phone number", required: false },
  { id: "4", label: "Interested in", type: "select", placeholder: "", required: true, options: ["Full-Stack Bootcamp", "Data Science", "UI/UX Design"] },
  { id: "5", label: "Tell us your goal", type: "textarea", placeholder: "Describe what you're looking for...", required: true },
];

type Tab = "builder" | "preview" | "share";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormPage() {
  const company = useAppStore((s) => s.company);
  const [tab, setTab] = useState<Tab>("builder");
  const [fields, setFields] = useState<FormField[]>(defaultFields);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const formLink = "https://leadiq.io/f/" + (company?.name?.toLowerCase().replace(/\s+/g, "-") ?? "your-company");
  const snippet = '<script src="https://leadiq.io/embed.js" data-company="' + (company?.name ?? "your-company") + '" async></script>';

  const handleCopy = (type: "snippet" | "link") => {
    if (type === "snippet") {
      navigator.clipboard.writeText(snippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      navigator.clipboard.writeText(formLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: "New field",
      type: "text",
      placeholder: "Enter value",
      required: false,
    };
    setFields([...fields, newField]);
    setEditingId(newField.id);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "builder", label: "Form Builder", icon: <Plus className="w-3.5 h-3.5" /> },
    { key: "preview", label: "Preview", icon: <Eye className="w-3.5 h-3.5" /> },
    { key: "share", label: "Share & Embed", icon: <Link2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-[clamp(1.6rem,4vw,2.2rem)] text-[#1A1714] leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Lead Form
        </h1>
        <p className="text-sm text-[#9B8E7E] mt-1">
          Build your form, preview it, then share via link or embed.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl p-1 mb-6 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all duration-150 ${
              tab === t.key
                ? "bg-white text-[#1A1714] shadow-sm border border-[#E8E2D9]"
                : "text-[#9B8E7E] hover:text-[#1A1714]"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── BUILDER TAB ── */}
      {tab === "builder" && (
        <div className="max-w-2xl">
          <div className="flex flex-col gap-3 mb-4">
            {fields.map((field) => (
              <div
                key={field.id}
                className="bg-white border border-[#E8E2D9] rounded-2xl p-4 hover:border-[#C4B9A8] transition-colors"
              >
                {editingId === field.id ? (
                  // Edit mode
                  <div className="flex flex-col gap-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-[#9B8E7E] mb-1 block">
                          Label
                        </label>
                        <input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-[#9B8E7E] mb-1 block">
                          Field type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                          className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1714] font-mono outline-none appearance-none focus:border-[#D4622A] transition-colors"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="select">Dropdown</option>
                          <option value="textarea">Textarea</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-[#9B8E7E] mb-1 block">
                        Placeholder
                      </label>
                      <input
                        value={field.placeholder}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors"
                      />
                    </div>

                    {field.type === "select" && (
                      <div>
                        <label className="text-[10px] font-mono text-[#9B8E7E] mb-1 block">
                          Options (comma separated)
                        </label>
                        <input
                          value={field.options?.join(", ") ?? ""}
                          onChange={(e) =>
                            updateField(field.id, {
                              options: e.target.value.split(",").map((o) => o.trim()),
                            })
                          }
                          className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1714] font-mono outline-none focus:border-[#D4622A] transition-colors"
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div
                          onClick={() => updateField(field.id, { required: !field.required })}
                          className={"relative w-8 h-4 rounded-full transition-colors duration-200 cursor-pointer " + (field.required ? "bg-[#1A1714]" : "bg-[#E8E2D9]")}
                        >
                          <span className={"absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 " + (field.required ? "translate-x-4" : "translate-x-0.5")} />
                        </div>
                        <span className="text-xs font-mono text-[#9B8E7E]">Required</span>
                      </label>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs font-mono bg-[#1A1714] text-[#FAF9F6] px-3 py-1.5 rounded-lg hover:bg-[#2C2825] transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-[#C4B9A8] shrink-0" />
                      <div>
                        <p className="text-sm text-[#1A1714] font-medium">{field.label}</p>
                        <p className="text-[10px] font-mono text-[#9B8E7E]">
                          {field.type}
                          {field.required && " · required"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingId(field.id)}
                        className="text-xs font-mono text-[#9B8E7E] hover:text-[#1A1714] border border-[#E8E2D9] rounded-lg px-2.5 py-1 hover:border-[#C4B9A8] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeField(field.id)}
                        className="text-[#C4B9A8] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addField}
            className="w-full border border-dashed border-[#C4B9A8] rounded-2xl py-3 text-xs font-mono text-[#9B8E7E] hover:border-[#D4622A] hover:text-[#D4622A] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add field
          </button>
        </div>
      )}

      {/* ── PREVIEW TAB ── */}
      {tab === "preview" && (
        <div className="max-w-md">
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8">
            <h3
              className="text-xl text-[#1A1714] mb-2"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              {company?.name ? "Get in touch with " + company.name : "Get in touch"}
            </h3>
            <p className="text-xs text-[#9B8E7E] font-mono mb-6">
              Fill in your details and we'll get back to you.
            </p>

            <div className="flex flex-col gap-4">
              {fields.map((field) => (
                <div key={field.id}>
                  <label className="text-xs font-mono text-[#9B8E7E] mb-1.5 block">
                    {field.label}
                    {field.required && <span className="text-[#D4622A] ml-0.5">*</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      placeholder={field.placeholder}
                      className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] placeholder:text-[#C4B9A8] resize-none h-20 font-mono outline-none focus:border-[#D4622A] transition-colors"
                    />
                  ) : field.type === "select" ? (
                    <select className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none appearance-none focus:border-[#D4622A] transition-colors">
                      <option value="">Select an option</option>
                      {field.options?.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] placeholder:text-[#C4B9A8] font-mono outline-none focus:border-[#D4622A] transition-colors"
                    />
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

          {/* Shareable link — like Google Forms */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-4 h-4 text-[#D4622A]" />
              <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest">
                Shareable link
              </p>
            </div>
            <p className="text-xs text-[#9B8E7E] mb-4">
              Share this link directly — anyone with it can fill out your form. Works like Google Forms.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 font-mono text-xs text-[#9B8E7E] truncate">
                {formLink}
              </div>
              <button
                onClick={() => handleCopy("link")}
                className={"flex items-center gap-2 text-xs font-mono px-4 py-3 rounded-xl border transition-colors whitespace-nowrap " + (copiedLink ? "bg-green-50 border-green-200 text-green-700" : "bg-[#1A1714] text-[#FAF9F6] border-[#1A1714] hover:bg-[#2C2825]")}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? "Copied!" : "Copy link"}
              </button>
            </div>

            {/* Open in new tab */}
            <a
              href={formLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D4622A] hover:underline mt-3"
            >
              Open form →
            </a>
          </div>

          {/* Embed snippet */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-[#D4622A]" />
              <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest">
                Embed on your website
              </p>
            </div>
            <p className="text-xs text-[#9B8E7E] mb-4">
              Drop this script tag anywhere on your site. The form will appear wherever you place it.
            </p>
            <div className="bg-[#1A1714] rounded-xl p-4 relative mb-3">
              <p className="font-mono text-xs text-[#F5C27A] break-all leading-relaxed pr-16">
                {snippet}
              </p>
              <button
                onClick={() => handleCopy("snippet")}
                className={"absolute top-3 right-3 flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg transition-colors " + (copiedSnippet ? "bg-green-700 text-white" : "bg-[#2C2825] text-[#FAF9F6] hover:bg-[#D4622A]")}
              >
                {copiedSnippet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-[10px] font-mono text-[#C4B9A8]">
              Paste this before the closing {"</body>"} tag on any page.
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6">
            <p className="text-xs font-mono text-[#9B8E7E] uppercase tracking-widest mb-4">
              Form stats
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total views", value: "142" },
                { label: "Submissions", value: "38" },
                { label: "Conversion", value: "26%" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-mono font-medium text-[#1A1714]">{s.value}</p>
                  <p className="text-[10px] font-mono text-[#9B8E7E] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}