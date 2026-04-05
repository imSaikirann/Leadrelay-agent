"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Building, LogOut, SettingsIcon } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ALL_WORKSPACES_ID, FOUNDER_WORKSPACE_ID } from "@/lib/workspace";
import ThemeToggle from "@/components/common/ThemeToggle";

const pageTitles: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Dashboard", sub: "Overview of your leads today" },
  "/dashboard/leads": { title: "Leads", sub: "All inbound leads scored by AI" },
  "/dashboard/analytics": { title: "Analytics", sub: "Lead quality and team performance" },
  "/dashboard/team": { title: "Team", sub: "Run sales, marketing, support, and ops from one place" },
  "/dashboard/form": { title: "Embed Form", sub: "Drop your lead form anywhere" },
  "/dashboard/settings": { title: "Settings", sub: "Manage your workspace" },
  "/dashboard/profile": { title: "Workspace", sub: "Billing, plan, and company details" },
  "/dashboard/rep": { title: "My Leads", sub: "Assigned leads and response activity" },
  "/dashboard/admin": { title: "Team Admin", sub: "Roles, access, and workspace control" },
};

const menuItems = [
  { label: "Company Profile", href: "/dashboard/profile", icon: Building },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const company = useAppStore((s) => s.company);
  const activeWorkspace = useAppStore((s) => s.activeWorkspace);
  const [companyName, setCompanyName] = useState(company?.name ?? "");
  const [workspaceName, setWorkspaceName] = useState("All workspaces");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const page = pageTitles[pathname] ?? { title: "Foundhub", sub: "" };

  useEffect(() => {
    if (company?.name) {
      setCompanyName(company.name);
      return;
    }

    fetch("/api/company")
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) setCompanyName(data.name);
      })
      .catch(() => {});
  }, [company]);

  useEffect(() => {
    if (activeWorkspace === ALL_WORKSPACES_ID) {
      setWorkspaceName("All workspaces");
      return;
    }

    if (activeWorkspace === FOUNDER_WORKSPACE_ID) {
      setWorkspaceName("Founder view");
      return;
    }

    fetch("/api/teams")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!Array.isArray(data)) {
          setWorkspaceName("Workspace");
          return;
        }

        const selectedWorkspace = data.find(
          (item: { id: string; name: string }) => item.id === activeWorkspace
        );

        setWorkspaceName(selectedWorkspace?.name ?? "Workspace");
      })
      .catch(() => setWorkspaceName("Workspace"));
  }, [activeWorkspace]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-[#E8E2D9] bg-[#FAF9F6]/80 px-4 py-4 backdrop-blur-md dark:border-white/10 dark:bg-[#111111]/80 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <p className="mb-0.5 text-[11px] font-mono text-[#9B8E7E] dark:text-[#A99C8B]">
            {companyName || "Workspace"} · {workspaceName}
          </p>

          <h2
            className="text-lg leading-tight text-[#1A1714] dark:text-[#F5F1EB] sm:text-xl"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            {page.title}
          </h2>

          <p className="mt-0.5 hidden text-xs text-[#9B8E7E] dark:text-[#A99C8B] sm:block">{page.sub}</p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          <div className="hidden items-center gap-2 rounded-full border border-[#E8E2D9] bg-white px-4 py-2 dark:border-white/10 dark:bg-[#171717] xl:flex">
            <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
            <span className="text-[11px] font-mono text-[#6E6253] dark:text-[#D4C7B8]">
              Founder workspace, team, billing, and support in one dashboard
            </span>
          </div>

          {session?.user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((open) => !open)}
                className="rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-[#D4622A] focus:outline-none"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "profile"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4622A] text-sm font-medium text-white">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white shadow-lg dark:border-white/10 dark:bg-[#171717]">
                  <div className="flex items-center gap-3 border-b border-[#E8E2D9] px-4 py-3 dark:border-white/10">
                    {session.user.image ? (
                      <img src={session.user.image} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4622A] text-xs text-white">
                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-[#1A1714] dark:text-[#F5F1EB]">{session.user.name}</p>
                      <p className="truncate text-xs text-[#9B8E7E] dark:text-[#A99C8B]">{session.user.email}</p>
                    </div>
                  </div>

                  <div className="py-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#1A1714] transition-colors hover:bg-[#FAF9F6] dark:text-[#F5F1EB] dark:hover:bg-[#1F1F1F]"
                        >
                          <Icon className="size-4 opacity-60" />
                          <span className="font-mono">{item.label}</span>
                        </Link>
                      );
                    })}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut({ callbackUrl: "/login" });
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#FAF9F6]"
                      style={{ color: "#ef4444" }}
                    >
                      <LogOut className="size-4" />
                      <span className="font-mono">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
