"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomInput } from "@/components/common/CustomInput";
import { CustomButton } from "@/components/common/CustomButton";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/onboarding");
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-sm">

        <p className="font-mono text-sm font-medium text-[#1A1714] mb-10">
          lead<span className="text-[#D4622A]">IQ</span>
        </p>

        <h1
          className="text-[clamp(1.8rem,5vw,2.2rem)] text-[#1A1714] mb-2 leading-tight"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Create your account.
        </h1>
        <p className="text-sm text-[#9B8E7E] mb-8">
          Start scoring leads in minutes.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <CustomInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="w-full mt-2">
            <CustomButton type="submit" className="w-full">
              Create account
            </CustomButton>
          </div>
        </form>

        <p className="text-xs text-[#9B8E7E] mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[#D4622A] hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}