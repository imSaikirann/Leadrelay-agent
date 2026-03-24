"use client";

import { useState } from "react";
import Link from "next/link";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  href?: string; // ✅ NEW
}

export function CustomButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  href,
}: CustomButtonProps) {
  const [pressed, setPressed] = useState(false);

  const content = (
    <div
      className={`relative ${className}`}
      style={{ perspective: "600px" }}
    >
      <div
        className="absolute inset-0 rounded-lg bg-black translate-y-[3px] translate-x-[1px]"
        style={{ filter: "blur(1px)" }}
      />

      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        className="relative z-10 group overflow-hidden rounded-lg border border-black w-full h-[38px] px-5 font-mono text-xs font-medium tracking-wide text-white"
        style={{
          background: "linear-gradient(145deg, #2a2724, #0f0d0c)",
          transform: pressed
            ? "translateY(2px) translateX(0.5px) rotateX(4deg)"
            : "translateY(0px) rotateX(0deg)",
          boxShadow: pressed
            ? "0 1px 0 #000, inset 0 1px 3px rgba(0,0,0,0.5)"
            : "0 3px 0 #000, 0 5px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
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

  // ✅ If link → wrap with Next Link
  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}