"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`inline-flex items-center gap-2 rounded-full border border-[#E8E2D9] bg-white px-3 py-3 text-xs font-mono text-[#6E6253] transition-colors hover:border-[#C4B9A8] hover:text-[#1A1714] dark:border-white/10 dark:bg-[#171717] dark:text-[#d7d2ca] dark:hover:border-white/20 dark:hover:text-white ${className}`}
    >
      {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      
    </button>
  );
}
