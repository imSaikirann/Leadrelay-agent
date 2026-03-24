"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useAppStore } from "@/store/useAppStore";
import {
  LayoutDashboard, Users, Code2, BarChart3,
  LineChart, LogOut, X, Shield,
} from "lucide-react";

// ─── Nav per role ─────────────────────────────────────────────────────────────

const ownerNav = [
  { label: "Dashboard",  href: "/dashboard",           icon: LayoutDashboard },
  { label: "Leads",      href: "/dashboard/leads",     icon: BarChart3       },
  { label: "Analytics",  href: "/dashboard/analytics", icon: LineChart       },
  { label: "Team",       href: "/dashboard/team",      icon: Users           },
  { label: "Form",       href: "/dashboard/form",      icon: Code2           },
];

const repNav = [
  { label: "My Leads",   href: "/dashboard/rep",                 icon: BarChart3       },
];

const superAdminNav = [
  { label: "Dashboard",  href: "/dashboard",           icon: LayoutDashboard },
  { label: "Leads",      href: "/dashboard/leads",     icon: BarChart3       },
  { label: "Analytics",  href: "/dashboard/analytics", icon: LineChart       },
  { label: "Team",       href: "/dashboard/team",      icon: Users           },
  { label: "Form",       href: "/dashboard/form",      icon: Code2           },
  { label: "Admin",      href: "/admin",               icon: Shield          },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname    = usePathname();
  const { data: session } = useSession();
  const company     = useAppStore((s) => s.company);
  const reset       = useAppStore((s) => s.reset);

  const isMember    = session?.user?.isMember;
  const isSuperAdmin = session?.user?.role === "superadmin";

  const navItems = isSuperAdmin ? superAdminNav : isMember ? repNav : ownerNav;

  function handleLogout() {
    reset();
    signOut({ callbackUrl: "/login" });
  }

  return (
    <aside className="w-56 h-full bg-[#FAF9F6] border-r border-[#E8E2D9] flex flex-col px-4 py-6">

      {/* Logo + close on mobile */}
      <div className="flex items-center justify-between mb-8 px-2">
    
        {onClose && (
          <button onClick={onClose} className="text-[#9B8E7E] hover:text-[#1A1714] lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Context badge */}
      {isMember ? (
        <div className="bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl px-3 py-2.5 mb-6">
          <p className="text-xs font-medium text-[#1A1714] truncate">{session?.user?.name}</p>
          <p className="text-[10px] text-[#9B8E7E] capitalize">{session?.user?.role ?? "Sales Rep"}</p>
        </div>
      ) : company ? (
        <div className="bg-[#F0EDE6] border border-[#E8E2D9] rounded-xl px-3 py-2.5 mb-6">
          <p className="text-xs font-medium text-[#1A1714] truncate">{company.name}</p>
          <p className="text-[10px] text-[#9B8E7E] capitalize">{company.industry}</p>
        </div>
      ) : null}

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
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

      {/* Role pill */}
      <div className="px-3 mb-3">
        <span className="text-[10px] font-mono text-[#C4B9A8] uppercase tracking-widest">
          {isSuperAdmin ? "Super Admin" : isMember ? session?.user?.role : "Owner"}
        </span>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9B8E7E] hover:bg-[#F0EDE6] hover:text-[#1A1714] transition-all duration-150"
      >
        <LogOut className="w-4 h-4" />
        Log out
      </button>
    </aside>
  );
}