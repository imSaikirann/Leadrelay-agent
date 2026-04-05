import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { resolveAccess } from "@/lib/access";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!session?.user?.email || !access) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (access.isSuperAdmin) {
    return NextResponse.json({ error: "Super admin account cannot be deleted here" }, { status: 403 });
  }

  if (!access.isOwner || !access.owner?.id) {
    return NextResponse.json({ error: "Only the workspace owner can delete this account" }, { status: 403 });
  }

  await prisma.user.delete({
    where: { id: access.owner.id },
  });

  return NextResponse.json({ ok: true });
}
