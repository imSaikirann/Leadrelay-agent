"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { CustomButton } from "./CustomButton";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
const pathname = usePathname();

if (pathname.startsWith("/f")) {
  return null;
}
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  const menuItems = [
    { label: "Company Profile", icon: "🏢", action: () => router.push("/dashboard/profile") },
    { label: "Settings", icon: "⚙️", action: () => router.push("/dashboard/settings") },
    { label: "Sign out", icon: "→", action: () => signOut({ callbackUrl: "/" }), danger: true },
  ];

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
        {session?.user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Avatar button — image only */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none rounded-full ring-2 ring-transparent hover:ring-[#D4622A] transition-all duration-200"
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "profile"}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#D4622A] flex items-center justify-center text-white text-sm font-medium">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-[#E8E2D9] bg-white shadow-lg overflow-hidden">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-[#E8E2D9] flex items-center gap-3">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#D4622A] flex items-center justify-center text-white text-xs">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#1A1714] truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-[#9B8E7E] truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { item.action(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#FAF9F6]"
                      style={{ color: item.danger ? "#ef4444" : "#1A1714" }}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="font-mono">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <CustomButton onClick={scrollToWaitlist}>
            get early access
          </CustomButton>
        )}
      </div>
    </nav>
  );
}