"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { LayoutDashboard, Users, Code2, BarChart3, LogOut, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/dashboard/leads", icon: BarChart3 },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Form", href: "/dashboard/form", icon: Code2 },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const company = useAppStore((s) => s.company);
  const reset = useAppStore((s) => s.reset);

  return (
    <aside className="w-56 h-full bg-[#FAF9F6] border-r border-[#E8E2D9] flex flex-col px-4 py-6">

      {/* Logo + close on mobile */}
      <div className="flex items-center justify-between mb-8 px-2">
        <p className="font-mono text-sm font-medium text-[#1A1714]">
          lead<span className="text-[#D4622A]">IQ</span>
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#9B8E7E] hover:text-[#1A1714] lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Company badge */}
      {company && (
        <div className="bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl px-3 py-2.5 mb-6">
          <p className="text-xs font-medium text-[#1A1714] truncate">{company.name}</p>
          <p className="text-[10px] text-[#9B8E7E] capitalize">{company.industry}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                active
                  ? "bg-[#1A1714] text-[#FAF9F6]"
                  : "text-[#9B8E7E] hover:bg-[#F0EDE6] hover:text-[#1A1714]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => { reset(); window.location.href = "/login"; }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9B8E7E] hover:bg-[#F0EDE6] hover:text-[#1A1714] transition-all duration-150"
      >
        <LogOut className="w-4 h-4" />
        Log out
      </button>

    </aside>
  );
}