"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, slide in when open */}
      <div
        className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#E8E2D9] lg:hidden">
          <p className="font-mono text-sm font-medium text-[#1A1714]">
            lead<span className="text-[#D4622A]">IQ</span>
          </p>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#9B8E7E] hover:text-[#1A1714] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

    </div>
  );
}