import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { resolveAccess } from "@/lib/access";

export async function requireSuperAdminAccess() {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access?.isSuperAdmin) return null;

  return access;
}
