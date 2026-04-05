"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  LayoutDashboard,
  Users,
  Code2,
  BarChart3,
  LineChart,
  LogOut,
  X,
  Shield,
  Building2,
  Settings,
} from "lucide-react";
import SidebarPlanCard from "@/components/dashboard/SidebarPlanCard";

// ─── Nav per role ─────────────────────────────────────────────────────────────

const ownerNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/dashboard/leads", icon: BarChart3 },
  { label: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Forms", href: "/dashboard/form", icon: Code2 },
  { label: "Workspace", href: "/dashboard/profile", icon: Building2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const repNav = [
  { label: "My Leads", href: "/dashboard/rep", icon: BarChart3 },
  { label: "Workspace", href: "/dashboard/profile", icon: Building2 },
];

const leadGenNav = [
  { label: "Lead Queue", href: "/dashboard/leads", icon: BarChart3 },
  { label: "Forms", href: "/dashboard/form", icon: Code2 },
  { label: "Workspace", href: "/dashboard/profile", icon: Building2 },
];

const leadAdminNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/dashboard/leads", icon: BarChart3 },
  { label: "Analytics", href: "/dashboard/analytics", icon: LineChart },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Forms", href: "/dashboard/form", icon: Code2 },
  { label: "Workspace", href: "/dashboard/profile", icon: Building2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const superAdminNav = [
  { label: "Admin", href: "/admin", icon: Shield },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname    = usePathname();
  const { data: session } = useSession();
  const company     = useAppStore((s) => s.company);
  const activeWorkspace = useAppStore((s) => s.activeWorkspace);
  const setActiveWorkspace = useAppStore((s) => s.setActiveWorkspace);
  const reset       = useAppStore((s) => s.reset);
  const [companyName, setCompanyName] = useState(company?.name ?? "");
  const [companyIndustry, setCompanyIndustry] = useState(company?.industry ?? "");
  const [workspaceOptions, setWorkspaceOptions] = useState<Array<{ id: string; name: string }>>([]);

  const isMember    = session?.user?.isMember;
  const isSuperAdmin = session?.user?.role === "superadmin";
  const role = session?.user?.role;
  const canSeeWorkspaceSwitcher = !isSuperAdmin && (!isMember || role === "admin");

  useEffect(() => {
    if (company?.name) {
      setCompanyName(company.name);
      setCompanyIndustry(company.industry);
      return;
    }

    if (isMember || isSuperAdmin) return;

    fetch("/api/company")
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) {
          setCompanyName(data.name);
          setCompanyIndustry(data.industry ?? "");
        }
      })
      .catch(() => {});
  }, [company, isMember, isSuperAdmin]);

  useEffect(() => {
    if (isMember && role === "sales_rep") return;

    fetch("/api/teams")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setWorkspaceOptions(data.map((item) => ({ id: item.id, name: item.name })));
        }
      })
      .catch(() => {});
  }, [isMember, role]);

  const navItems = isSuperAdmin
    ? superAdminNav
    : role === "sales_rep"
      ? repNav
      : role === "lead_gen"
        ? leadGenNav
        : role === "sales_lead" || role === "admin"
          ? leadAdminNav
          : ownerNav;

  function handleLogout() {
    reset();
    signOut({ callbackUrl: "/login" });
  }

  return (
    <aside className="flex h-full w-[280px] max-w-[85vw] flex-col overflow-y-auto border-r border-[#E8E2D9] bg-[#FAF9F6] px-4 py-5 dark:border-white/10 dark:bg-[#101010] lg:px-5">

      <div className="mb-8 flex items-center justify-between px-2">
        <div>
          <p className="font-mono text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">
            lead<span className="text-[#D4622A]">IQ</span>
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[#9B8E7E] dark:text-[#A99C8B]">
            Workspace Hub
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[#9B8E7E] hover:text-[#1A1714] dark:text-[#A99C8B] dark:hover:text-white lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isMember ? (
        <div className="mb-6 rounded-2xl border border-[#E8E2D9] bg-white px-4 py-3 shadow-[0_12px_30px_-24px_rgba(26,23,20,0.45)] dark:border-white/10 dark:bg-[#171717]">
          <p className="truncate text-xs font-medium text-[#1A1714] dark:text-[#F5F1EB]">{session?.user?.name}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#9B8E7E] dark:text-[#A99C8B]">
            {session?.user?.role ?? "Sales Rep"}
          </p>
        </div>
      ) : companyName ? (
        <div className="mb-6 rounded-2xl border border-[#E8E2D9] bg-gradient-to-br from-white via-[#FFF8F2] to-[#F4EEE7] px-4 py-3 shadow-[0_12px_30px_-24px_rgba(212,98,42,0.45)] dark:border-white/10 dark:from-[#171717] dark:via-[#1c1714] dark:to-[#211914]">
          <p className="truncate text-xs font-medium text-[#1A1714] dark:text-[#F5F1EB]">{companyName}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#9B8E7E] dark:text-[#A99C8B]">
            {companyIndustry || "workspace"}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-[#6E6253] dark:text-[#B8ADA0]">
            One place for founders to manage sales, marketing, operations, and support.
          </p>
        </div>
      ) : null}

      {canSeeWorkspaceSwitcher && (
        <div className="mb-6 rounded-2xl border border-[#E8E2D9] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#171717]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9B8E7E] dark:text-[#A99C8B]">Workspace switch</p>
            <Link href="/dashboard/team?tab=teams&newWorkspace=1" onClick={onClose} className="text-[10px] font-mono text-[#D4622A] hover:underline">
              + Add workspace
            </Link>
          </div>
          <div className="relative mt-3">
            <select
              value={activeWorkspace}
              onChange={(e) => setActiveWorkspace(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#E8E2D9] bg-[#FAF9F6] px-3 py-2.5 text-sm text-[#1A1714] outline-none dark:border-white/10 dark:bg-[#101010] dark:text-[#F5F1EB]"
            >
              <option value="all">All workspaces</option>
              <option value="founder">Founder view</option>
              {workspaceOptions.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#C4B9A8] dark:text-[#8E8377]">
              v
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[#7D7264] dark:text-[#B8ADA0]">
            Switch between founder view and team workspaces from the same dashboard shell.
          </p>
        </div>
      )}

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
                  ? "bg-[#1A1714] text-[#FAF9F6] shadow-[0_10px_30px_-22px_rgba(26,23,20,0.9)]"
                  : "text-[#7D7264] hover:bg-white hover:text-[#1A1714] dark:text-[#B8ADA0] dark:hover:bg-[#1A1A1A] dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {!isSuperAdmin && !isMember ? (
        <SidebarPlanCard />
      ) : (
        <div className="mb-3 rounded-2xl border border-dashed border-[#E8E2D9] bg-[#F4EFE8] px-3 py-3 dark:border-white/10 dark:bg-[#171717]">
          <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#C4B9A8] dark:text-[#8E8377]">
            {isSuperAdmin ? "Super Admin" : session?.user?.role}
          </p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#9B8E7E] transition-all duration-150 hover:bg-white hover:text-[#1A1714] dark:text-[#A99C8B] dark:hover:bg-[#1A1A1A] dark:hover:text-white"
      >
        <LogOut className="w-4 h-4" />
        Log out
      </button>
    </aside>
  );
}
