"use client";

import { useEffect, useState } from "react";
import { CustomButton } from "./CustomButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(250,249,246,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #E8E2D9" : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <span className="font-mono text-sm font-medium text-[#1A1714] tracking-tight">
        inb<span className="text-[#D4622A]">oq</span>
      </span>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <a
          href="#how-it-works"
          className="hidden sm:block text-xs font-mono text-[#C4B9A8] hover:text-[#1A1714] transition-colors duration-150"
        >
          how it works
        </a>
        <a
          href="#features"
          className="hidden sm:block text-xs font-mono text-[#C4B9A8] hover:text-[#1A1714] transition-colors duration-150"
        >
          features
        </a>
        <CustomButton
          onClick={scrollToWaitlist}
         
        >
          get early access
        </CustomButton>
      </div>

    </nav>
  );
}