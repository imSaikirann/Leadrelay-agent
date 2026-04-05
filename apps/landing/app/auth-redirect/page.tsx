// app/auth-redirect/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { MEMBER_ROLE, resolveAccess } from "@/lib/access";

export default async function AuthRedirect() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const access = await resolveAccess(session);
  if (!access) redirect("/login");

  if (access.isSuperAdmin) redirect("/admin");
  if (access.role === MEMBER_ROLE.SALES_REP) redirect("/dashboard/rep");
  if (access.role === MEMBER_ROLE.LEAD_GEN) redirect("/dashboard/form");
  if (access.company) redirect("/dashboard");

  redirect("/onboarding");
}
