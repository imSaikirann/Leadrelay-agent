import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { resolveAccess } from "@/lib/access";
import { Shield, Users, BarChart3, CreditCard, Activity, Layers3 } from "lucide-react";
import AdminHeaderActions from "@/components/admin/AdminHeaderActions";

const links = [
  { href: "/admin", label: "Overview", icon: Shield },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Activity },
  { href: "/admin/usage", label: "Usage", icon: BarChart3 },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
  { href: "/admin/plans", label: "Plans", icon: Layers3 },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access?.isSuperAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(212,98,42,0.16),_transparent_24%),linear-gradient(180deg,_#070707_0%,_#111111_100%)] text-white">
      <div className="border-b border-[#1e1e1e] px-4 py-4 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
         
          <h1 className="text-lg">Super Admin</h1>
          <p className="mt-1 text-sm text-[#777]">Users, billing, usage, and support-watch accounts in one view.</p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <nav className="flex flex-wrap items-center gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-[#1e1e1e] px-3 py-1.5 text-xs font-mono text-[#999] hover:border-[#333] hover:text-white"
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            )})}
          </nav>
          <AdminHeaderActions />
        </div>
      </div>
      </div>
      {children}
    </div>
  );
}
