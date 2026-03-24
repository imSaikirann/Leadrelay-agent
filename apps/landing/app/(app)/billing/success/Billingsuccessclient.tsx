"use client";

// app/billing/success/BillingSuccessClient.tsx
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BillingSuccessClient({
  subscriptionId,
  status,
  email,
}: {
  subscriptionId: string | null;
  status: string | null;
  email: string | null;
}) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect to dashboard after 5s
  useEffect(() => {
    if (status !== "active") return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.push("/dashboard/profile");
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status, router]);

  // Payment failed or unknown status
  if (status !== "active") {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl">✕</span>
          </div>
          <h1
            className="text-3xl text-[#1A1714] mb-2"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Payment unsuccessful
          </h1>
          <p className="text-sm text-[#9B8E7E] font-mono mb-8">
            Something went wrong. Your card was not charged.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/settings/company")}
              className="w-full bg-[#D4622A] text-white rounded-xl py-3 text-sm font-mono hover:bg-[#C05520] transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full border border-[#E8E2D9] text-[#9B8E7E] rounded-xl py-3 text-sm font-mono hover:border-[#C4B9A8] transition-colors"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6">
      <div className="max-w-md w-full">

        {/* Success icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-[clamp(2rem,5vw,2.8rem)] text-[#1A1714] leading-tight mb-3 text-center"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          You're all set.
        </h1>
        <p className="text-sm text-[#9B8E7E] font-mono text-center mb-10">
          Your subscription is now active. Start capturing and scoring leads.
        </p>

        {/* Subscription details card */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl px-5 py-5 mb-8">
          <p className="text-[10px] text-[#9B8E7E] font-mono uppercase tracking-wider mb-4">
            Subscription details
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#9B8E7E] font-mono">Status</span>
              <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-mono rounded-full px-2.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </span>
            </div>
            {email && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9B8E7E] font-mono">Email</span>
                <span className="text-xs text-[#1A1714] font-mono">{email}</span>
              </div>
            )}
            {subscriptionId && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#9B8E7E] font-mono">Subscription ID</span>
                <span className="text-xs text-[#1A1714] font-mono truncate max-w-[180px]">
                  {subscriptionId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-[#D4622A] text-white rounded-xl py-3.5 text-sm font-mono hover:bg-[#C05520] transition-colors mb-3"
        >
          Go to dashboard
        </button>

        {/* Countdown */}
        <p className="text-center text-xs text-[#C4B9A8] font-mono">
          Redirecting in {countdown}s...
        </p>

      </div>
    </main>
  );
}