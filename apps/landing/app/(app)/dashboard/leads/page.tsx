import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LeadsClient from "./LeadsClient";
import { MEMBER_ROLE, resolveAccess } from "@/lib/access";

export default async function LeadsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const access = await resolveAccess(session);
  if (!access) redirect("/login");

  if (access.role === MEMBER_ROLE.SALES_REP) redirect("/dashboard/rep");
  if (!access.company) redirect("/onboarding");

  return <LeadsClient formId="" canAssign={access.isOwner || access.role === "admin" || access.role === "sales_lead"} />;
}
