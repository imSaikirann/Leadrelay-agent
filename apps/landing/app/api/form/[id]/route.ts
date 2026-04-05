import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canManageForms, MEMBER_ROLE, resolveAccess } from "@/lib/access";

async function getScopedForm(id: string, access: NonNullable<Awaited<ReturnType<typeof resolveAccess>>>) {
  return prisma.leadForm.findFirst({
    where: {
      id,
      companyId: access.company!.id,
      ...(access.role === MEMBER_ROLE.LEAD_GEN && access.member
        ? { createdByMemberId: access.member.id }
        : {}),
    },
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canManageForms(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const form = await getScopedForm(id, access);

  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(form);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canManageForms(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const form = await getScopedForm(id, access);

  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.leadForm.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: String(body.name).trim() || form.name } : {}),
      ...(body.fields !== undefined ? { fields: body.fields } : {}),
      ...(body.teamId !== undefined ? { teamId: body.teamId || null } : {}),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canManageForms(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const form = await getScopedForm(id, access);

  if (!form) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.leadForm.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
