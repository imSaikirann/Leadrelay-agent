import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canManageWorkspace, resolveAccess } from "@/lib/access";


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);
  if (!access || !access.company || !canManageWorkspace(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const member = await prisma.teamMember.findFirst({
    where: { id, companyId: access.company.id },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const updated = await prisma.teamMember.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string } >}) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);
  if (!access || !access.company || !canManageWorkspace(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const member = await prisma.teamMember.findFirst({
    where: { id, companyId: access.company.id },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
