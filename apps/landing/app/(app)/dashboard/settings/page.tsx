"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LifeBuoy } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { industries } from "@/lib/industry-data";
import { ALL_WORKSPACES_ID, FOUNDER_WORKSPACE_ID } from "@/lib/workspace";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomButton } from "@/components/common/CustomButton";

const supportQuestions = [
  {
    title: "How does the trial work?",
    answer: "You get full access for 7 days before moving to a paid workspace.",
  },
  {
    title: "What is included after trial?",
    answer: "Paid workspaces include lead capture, routing, team management, and analytics.",
  },
  {
    title: "Can I create more workspaces?",
    answer: "Yes. Add more workspaces when you need separate teams or business units.",
  },
];

export default function SettingsPage() {
  const company = useAppStore((s) => s.company);
  const activeWorkspace = useAppStore((s) => s.activeWorkspace);
  const setCompany = useAppStore((s) => s.setCompany);
  const reset = useAppStore((s) => s.reset);

  const [name, setName] = useState(company?.name ?? "");
  const [email, setEmail] = useState(company?.email ?? "");
  const [industry, setIndustry] = useState(company?.industry ?? "");
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showDangerConfirm, setShowDangerConfirm] = useState(false);
  const [dangerInput, setDangerInput] = useState("");
  const [dangerError, setDangerError] = useState("");

  const workspaceLabel = useMemo(() => {
    if (activeWorkspace === ALL_WORKSPACES_ID) return "All workspaces";
    if (activeWorkspace === FOUNDER_WORKSPACE_ID) return "Founder view";
    return "Current workspace";
  }, [activeWorkspace]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCompany({ name, email, industry });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (dangerInput !== "DELETE") {
      setDangerError('Type "DELETE" to confirm.');
      return;
    }

    setResetting(true);
    setDangerError("");

    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to delete account");
      }

      reset();
      await signOut({ callbackUrl: "/signup" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete account";
      setDangerError(message);
      setResetting(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 border-b border-[#E8E2D9] pb-5">
          <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E]">Workspace settings</p>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1
                className="text-[clamp(1.8rem,4vw,2.5rem)] leading-tight text-[#1A1714]"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                Keep things tidy.
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#6E6253]">
                Update your company details, review workspace basics, and keep support info close by.
              </p>
            </div>
            <div className="rounded-full border border-[#E8E2D9] bg-white px-4 py-2 text-[11px] font-mono text-[#7D7264]">
              {workspaceLabel}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-[#E8E2D9] bg-white p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E]">Company profile</p>
                <h2
                  className="mt-2 text-[1.65rem] text-[#1A1714]"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  Basics
                </h2>
              </div>
              <span className="rounded-full bg-[#F6F1EA] px-3 py-1 text-[10px] font-mono text-[#7D7264]">
                {saved ? "Saved" : "Ready"}
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-mono text-[#9B8E7E]">Company name</label>
                <CustomInput
                  type="text"
                  placeholder="Company name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono text-[#9B8E7E]">Company email</label>
                <CustomInput
                  type="email"
                  placeholder="company@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono text-[#9B8E7E]">Industry</label>
                <div className="relative">
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                    className="w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FCFBF8] px-4 py-3 text-sm text-[#1A1714] outline-none"
                  >
                    <option value="" disabled>
                      Select industry
                    </option>
                    {industries.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#C4B9A8]">
                    v
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <CustomButton type="submit">{saved ? "Saved" : "Save changes"}</CustomButton>
                <Link
                  href="/dashboard/profile"
                  className="rounded-xl border border-[#E8E2D9] bg-[#FAF9F6] px-4 py-2.5 text-xs font-mono text-[#6E6253] hover:border-[#C4B9A8]"
                >
                  Open billing
                </Link>
              </div>
            </form>
          </section>

          <div className="space-y-6">
            <section className="rounded-3xl border border-[#E8E2D9] bg-white p-6">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E]">Snapshot</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-[#FBF8F4] px-4 py-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#9B8E7E]">Trial</p>
                  <p className="mt-1 text-lg text-[#1A1714]">7 days full access</p>
                </div>
                <div className="rounded-2xl bg-[#FBF8F4] px-4 py-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#9B8E7E]">Paid plan</p>
                  <p className="mt-1 text-lg text-[#1A1714]">1500 leads / month</p>
                </div>
                <div className="rounded-2xl bg-[#FBF8F4] px-4 py-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#9B8E7E]">Workspace add-on</p>
                  <p className="mt-1 text-lg text-[#1A1714]">Extra teams when needed</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#E8E2D9] bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <LifeBuoy className="h-4 w-4 text-[#D4622A]" />
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-[#9B8E7E]">Help</p>
                  <h2
                    className="mt-1 text-[1.4rem] text-[#1A1714]"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                  >
                    Quick answers
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {supportQuestions.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-[#EFE7DD] bg-[#FCFBF8] p-4">
                    <p className="text-sm font-medium text-[#1A1714]">{item.title}</p>
                    <p className="mt-1 text-xs leading-6 text-[#6E6253]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-red-100 bg-white p-6">
              <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-red-400">Danger zone</p>
              <p className="mt-3 text-sm text-[#6E6253]">
                Delete this account and remove the full workspace data including company, forms, leads, teams, and members.
              </p>
              <button
                onClick={() => {
                  setShowDangerConfirm(true);
                  setDangerError("");
                  setDangerInput("");
                }}
                className="mt-4 rounded-xl border border-red-200 px-4 py-2.5 text-xs font-mono text-red-500 transition-colors hover:bg-red-50"
              >
                Delete account
              </button>
            </section>
          </div>
        </div>
      </div>

      {showDangerConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1714]/40 px-4">
          <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-6 shadow-[0_30px_120px_-40px_rgba(26,23,20,0.45)]">
            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-red-400">Danger</p>
            <h2
              className="mt-2 text-[1.7rem] text-[#1A1714]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Delete account permanently
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6E6253]">
              This action cannot be undone. Your company, forms, leads, teams, team members, subscription, and billing history in this workspace will be deleted.
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-mono text-[#9B8E7E]">
                Type DELETE to confirm
              </label>
              <CustomInput
                type="text"
                placeholder="DELETE"
                value={dangerInput}
                onChange={(e) => setDangerInput(e.target.value)}
              />
            </div>

            {dangerError && <p className="mt-3 text-xs font-mono text-red-500">{dangerError}</p>}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setShowDangerConfirm(false);
                  setDangerInput("");
                  setDangerError("");
                }}
                className="rounded-xl border border-[#E8E2D9] px-4 py-2.5 text-xs font-mono text-[#6E6253]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={resetting}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-xs font-mono text-white transition-colors hover:bg-red-600 disabled:opacity-60"
              >
                {resetting ? "Deleting..." : "Delete everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
