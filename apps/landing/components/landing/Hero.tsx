"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";

// ─── CrazyInput ───────────────────────────────────────────────────────────────

interface CrazyInputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

function CrazyInput({
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  className = "",
}: CrazyInputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange(e);
  };

  return (
    <div
      className={`relative w-full cursor-text ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Gradient border */}
      <div
        className="absolute -inset-[1.5px] rounded-xl transition-all duration-300"
        style={{
          background: focused
            ? "linear-gradient(135deg, #D4622A, #F5C27A, #D4622A)"
            : "linear-gradient(135deg, #E8E2D9, #E8E2D9)",
          backgroundSize: "200% 200%",
          animation: focused ? "borderShift 2s ease infinite" : "none",
          opacity: focused ? 1 : 0.6,
        }}
      />

      <div className="relative rounded-xl bg-[#FAF9F6] overflow-hidden h-[52px]">
        {/* Scan line */}
        {focused && (
          <div
            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4622A]/40 to-transparent pointer-events-none z-20"
            style={{ animation: "scanLine 1.5s ease-in-out infinite" }}
          />
        )}

        {/* Floating label */}
        <label
          className="absolute left-4 transition-all duration-200 pointer-events-none font-mono select-none z-10"
          style={{
            top: focused || hasValue ? "6px" : "50%",
            transform:
              focused || hasValue
                ? "translateY(0) scale(0.75)"
                : "translateY(-50%) scale(1)",
            transformOrigin: "left center",
            fontSize: "13px",
            color: focused ? "#D4622A" : "#C4B9A8",
            letterSpacing: focused ? "0.08em" : "0",
          }}
        >
          {placeholder}
        </label>

        {/* Input */}
        <Input
          ref={inputRef}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          placeholder=""
          className="absolute inset-0 z-10 border-0 bg-transparent px-4 pb-2 pt-6 text-sm text-[#1A1714] placeholder:text-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono h-full"
        />

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8E2D9] z-10">
          <div
            className="h-full bg-gradient-to-r from-[#D4622A] to-[#F5C27A] transition-all duration-300 ease-out"
            style={{ width: focused ? "100%" : "0%" }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes borderShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── CrazyButton ─────────────────────────────────────────────────────────────

interface CrazyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

function CrazyButton({
  children,
  onClick,
  type = "button",
  className = "",
}: CrazyButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: "600px" }}
    >
      {/* Shadow depth */}
      <div
        className="absolute inset-0 rounded-xl bg-black translate-y-[4px] translate-x-[1px]"
        style={{ filter: "blur(1px)" }}
      />

      <button
        type={type}
        onClick={onClick}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        className="relative z-10 group overflow-hidden rounded-xl border border-black w-full h-[52px] px-7 font-mono text-sm font-medium tracking-wide text-white"
        style={{
          background: "linear-gradient(145deg, #2a2724, #0f0d0c)",
          transform: pressed
            ? "translateY(3px) translateX(0.5px) rotateX(4deg)"
            : "translateY(0px) rotateX(0deg)",
          boxShadow: pressed
            ? "0 1px 0 #000, inset 0 1px 3px rgba(0,0,0,0.5)"
            : "0 4px 0 #000, 0 6px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          transition: "transform 0.08s ease, box-shadow 0.08s ease",
          whiteSpace: "nowrap",
        }}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="relative flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6">


      {/* Content */}
      <div className="max-w-4xl mx-auto w-full pt-24 pb-16">
        <h1
          className="text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] text-[#1A1714] mb-6"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Your sales team should only
          <br />
          <em className="text-[#e55913] not-italic">
            talk to people ready to buy.
          </em>
        </h1>

        <p className="text-[clamp(1rem,2vw,1.25rem)] text-[#9B8E7E] font-normal leading-relaxed max-w-2xl mb-10">
          LeadIQ reads every inbound lead, understands their intent, and scores
          them Hot, Warm, or Cold — instantly.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-md"
          >
            {/* Input takes all available space */}
            <div className="flex-1 min-w-0">
              <CrazyInput
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Button fixed width on desktop, full width on mobile */}
            <div className="w-full sm:w-auto sm:shrink-0">
              <CrazyButton type="submit">
                Join the waitlist
              </CrazyButton>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3 bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl px-5 py-4 max-w-md">
            <span className="text-xl">🎉</span>
            <div>
              <p className="text-sm font-medium text-[#1A1714]">You're on the list.</p>
              <p className="text-xs text-[#9B8E7E]">We'll reach out when LeadIQ is ready.</p>
            </div>
          </div>
        )}

        <p className="text-xs text-[#C4B9A8] mt-4">
          No credit card. No spam. Just early access.
        </p>
      </div>
    </section>
  );
}