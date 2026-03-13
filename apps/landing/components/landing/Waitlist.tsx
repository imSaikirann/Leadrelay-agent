"use client";

import { useState } from "react";
import { CustomInput } from "../common/CustomInput";
import { CustomButton } from "../common/CustomButton";

export default function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="px-6 py-32 border-t border-[#E8E2D9]">
      <div className="max-w-2xl mx-auto text-center">
        {/* Glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#D4622A]/5 blur-[80px] rounded-full pointer-events-none" />

          <p className="font-mono text-xs text-[#C4B9A8] uppercase tracking-widest mb-6">
            Early access
          </p>

          <h2
            className="text-[clamp(2.2rem,5vw,4rem)] text-[#1A1714] leading-tight mb-6"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Be the first to know
            <br />
            when <em className="text-[#D4622A]">LeadIQ</em> launches.
          </h2>

          <p className="text-[#9B8E7E] text-base leading-relaxed mb-10 max-w-lg mx-auto">
            Early members get free access during beta and a say in what we build next.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 max-w-sm mx-auto"
            >
              <CustomInput
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <CustomInput
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="w-full">
                <CustomButton type="submit" className="w-full">
                  {loading ? "Saving..." : "Claim early access →"}
                </CustomButton>
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}
            </form>
          ) : (
            <div className="bg-[#F0EDE6] border border-[#E8E2D9] rounded-2xl px-8 py-8 max-w-sm mx-auto">
              <p className="text-3xl mb-3">🎉</p>
              <p
                className="text-2xl text-[#1A1714] mb-2"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                You're in, {name}.
              </p>
              <p className="text-sm text-[#9B8E7E]">
                We'll email you the moment LeadIQ is ready. You're early — that means you'll shape what this becomes.
              </p>
            </div>
          )}

          <p className="text-xs text-[#C4B9A8] mt-6">
            Joining{" "}
            <span className="text-[#1A1714] font-medium">founders & sales teams</span>
            {" "}on the waitlist.
          </p>
        </div>
      </div>
    </section>
  );
}