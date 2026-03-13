import { ArrowRightIcon } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6">
      
      <span className="font-mono text-sm font-medium text-[#1A1714] tracking-tight">
        lead<span className="text-[#D4622A]">IQ</span>
      </span>

      <a
        href="#waitlist"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#9B8E7E] hover:text-[#1A1714] transition-colors duration-200"
      >
        Join waitlist
        <ArrowRightIcon className="w-4 h-4" />
      </a>

    </nav>
  );
}