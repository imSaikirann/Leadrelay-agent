"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu, X } from "lucide-react";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(244,201,171,0.35),_transparent_34%),linear-gradient(180deg,_#fbfaf7_0%,_#f6f1ea_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(212,98,42,0.12),_transparent_28%),linear-gradient(180deg,_#0b0b0b_0%,_#121212_100%)]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-[#1A1714]/20 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 z-30 h-full transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-[#E8E2D9] bg-[#FAF9F6]/95 px-4 py-4 dark:border-white/10 dark:bg-[#111111]/95 lg:hidden">
          <div>
            <p className="font-mono text-sm font-medium text-[#1A1714] dark:text-[#F5F1EB]">
              Found<span className="text-[#D4622A]">hub</span>
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.26em] text-[#9B8E7E] dark:text-[#A99C8B]">
              Founder control center
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-[#E8E2D9] bg-white p-2 text-[#9B8E7E] hover:text-[#1A1714] dark:border-white/10 dark:bg-[#191919] dark:text-[#B8ADA0] dark:hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden shrink-0 lg:block">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto dark:bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
