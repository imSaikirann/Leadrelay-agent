"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab]         = useState<"google" | "member">("google");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleMemberLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);

    const res = await signIn("credentials", {
      email, password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/auth-redirect");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="bg-white border border-[#E8E2D9] rounded-2xl p-8 w-full max-w-sm">

        <p className="font-mono text-xs text-[#C4B9A8] uppercase tracking-widest mb-4 text-center">
          Welcome back
        </p>
        <h1 className="text-2xl text-[#1A1714] mb-2 text-center" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          Sign in to Inboq
        </h1>
        <p className="text-sm text-[#9B8E7E] mb-6 text-center">
          Manage your leads and sales team.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl p-1 mb-6">
          <button onClick={() => { setTab("google"); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono transition-all ${tab === "google" ? "bg-white text-[#1A1714] shadow-sm border border-[#E8E2D9]" : "text-[#9B8E7E]"}`}>
            Owner
          </button>
          <button onClick={() => { setTab("member"); setError(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono transition-all ${tab === "member" ? "bg-white text-[#1A1714] shadow-sm border border-[#E8E2D9]" : "text-[#9B8E7E]"}`}>
            Sales Rep
          </button>
        </div>

        {/* Google */}
        {tab === "google" && (
          <button
            onClick={() => signIn("google", { callbackUrl: "/auth-redirect" })}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#E8E2D9]
              hover:border-[#C4B9A8] text-[#1A1714] text-sm font-medium py-3 px-4 rounded-xl transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        )}

        {/* Credentials */}
        {tab === "member" && (
          <form onSubmit={handleMemberLogin} className="space-y-3">
            <div>
              <label className="text-[10px] font-mono text-[#9B8E7E] uppercase tracking-wider">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@company.com"
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF9F6]
                  text-sm text-[#1A1714] placeholder:text-[#C4B9A8] focus:outline-none focus:border-[#D4622A] transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#9B8E7E] uppercase tracking-wider">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF9F6]
                  text-sm text-[#1A1714] placeholder:text-[#C4B9A8] focus:outline-none focus:border-[#D4622A] transition-colors"
              />
            </div>

            {error && <p className="text-xs font-mono text-red-500">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-mono bg-[#D4622A] text-white
                hover:bg-[#B8501F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}

        <p className="text-xs text-[#C4B9A8] mt-6 text-center">
          By signing in you agree to our terms.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
