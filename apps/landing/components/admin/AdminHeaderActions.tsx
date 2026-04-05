"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function AdminHeaderActions() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      {session?.user && (
        <div className="hidden items-center gap-3 rounded-full border border-[#1e1e1e] bg-[#0f0f0f] px-3 py-2 sm:flex">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name ?? "profile"}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4622a] text-sm font-medium text-white">
              {session.user.name?.[0]?.toUpperCase() ?? "S"}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm text-white">{session.user.name ?? "Super Admin"}</p>
            <p className="truncate text-xs font-mono text-[#8d8d8d]">{session.user.email}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={async () => {
          setLoading(true);
          await signOut({ callbackUrl: "/login" });
        }}
        className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#151515] px-4 py-2 text-sm font-mono text-white transition-colors hover:border-[#3f3f3f] hover:bg-[#1c1c1c]"
        disabled={loading}
      >
        <LogOut className="h-4 w-4" />
        {loading ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}
