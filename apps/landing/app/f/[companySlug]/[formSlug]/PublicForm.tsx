"use client";

import { useState, useEffect } from "react";

type FieldType = "text" | "email" | "phone" | "select" | "textarea";

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface Props {
  companyName: string;
  companySlug: string;
  formName: string;
  formSlug: string;
  fields: FormField[];
}

interface Company {
  name: string;
  logo?: string;
}

export default function PublicForm({
  companyName,
  companySlug,
  formName,
  formSlug,
  fields,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.id, ""]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [company, setCompany] = useState<Company | null>(null);

  // 🔥 Fetch company branding
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/public/company/${companySlug}`, {
          cache: "force-cache",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCompany(data);
      } catch {
        // fallback silently
      }
    };

    fetchCompany();
  }, [companySlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const data: Record<string, string> = {};
    fields.forEach((f) => {
      data[f.label] = values[f.id] ?? "";
    });

    try {
      const res = await fetch(`/api/f/${companySlug}?form=${formSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Submission failed");

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayName = company?.name ?? companyName ?? "inboq";

  // ── Success ──
  if (submitted) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
            <span className="text-green-600 text-2xl">✓</span>
          </div>

          <h1
            className="text-2xl text-[#1A1714] mb-2"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            You're all set!
          </h1>

          <p className="text-sm text-[#9B8E7E] font-mono">
            Thanks for reaching out to {displayName}. We'll be in touch soon.
          </p>
        </div>
      </main>
    );
  }

  // ── Form ──
  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* 🔥 Company Branding */}
        <div className="flex items-center gap-2 mb-10">
          {company?.logo ? (
            <img
              src={company.logo}
              alt={displayName}
              className="w-8 h-8 rounded-md object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-md bg-[#D4622A] flex items-center justify-center text-white text-xs font-medium">
              {displayName[0]}
            </div>
          )}

          <p className="font-mono text-sm font-medium text-[#1A1714]">
            {displayName}
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 shadow-sm">
          <h1
            className="text-2xl text-[#1A1714] mb-1"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            {formName}
          </h1>

          <p className="text-xs text-[#9B8E7E] font-mono mb-6">
            Fill in your details and we'll get back to you shortly.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="text-xs font-mono text-[#9B8E7E] mb-1.5 block">
                  {field.label}
                  {field.required && (
                    <span className="text-[#D4622A] ml-0.5">*</span>
                  )}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    placeholder={field.placeholder}
                    required={field.required}
                    value={values[field.id] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        [field.id]: e.target.value,
                      }))
                    }
                    className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] placeholder:text-[#C4B9A8] resize-none h-24 font-mono outline-none focus:border-[#D4622A] transition-colors"
                  />
                ) : field.type === "select" ? (
                  <select
                    required={field.required}
                    value={values[field.id] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        [field.id]: e.target.value,
                      }))
                    }
                    className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] font-mono outline-none appearance-none focus:border-[#D4622A] transition-colors"
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={values[field.id] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({
                        ...v,
                        [field.id]: e.target.value,
                      }))
                    }
                    className="w-full bg-[#FAF9F6] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm text-[#1A1714] placeholder:text-[#C4B9A8] font-mono outline-none focus:border-[#D4622A] transition-colors"
                  />
                )}
              </div>
            ))}

            {error && (
              <p className="text-xs text-red-500 font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#1A1714] text-[#FAF9F6] text-sm font-mono py-3.5 rounded-xl mt-2 hover:bg-[#2C2825] transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit →"}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-[#C4B9A8] font-mono mt-6">
          Powered by <span className="text-[#1A1714]">inboq</span>
        </p>
      </div>
    </main>
  );
}