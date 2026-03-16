import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

async function getCompany(userId: string) {
  return prisma.company.findUnique({ where: { userId } });
}

// GET /api/form — get all forms for company
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = await getCompany(session.user.id);
  if (!company) return NextResponse.json({ error: "No company" }, { status: 404 });

  const forms = await prisma.leadForm.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } } },
  });

  return NextResponse.json(forms);
}

// POST /api/form — create new form
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = await getCompany(session.user.id);
  if (!company) return NextResponse.json({ error: "No company" }, { status: 404 });

  const { name, fields } = await req.json();

  const slug = (name ?? "untitled")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // Make slug unique if duplicate
  const existing = await prisma.leadForm.count({
    where: { companyId: company.id, slug },
  });
  const finalSlug = existing > 0 ? `${slug}-${Date.now()}` : slug;

  const form = await prisma.leadForm.create({
    data: {
      companyId: company.id,
      name: name ?? "Untitled Form",
      slug: finalSlug,
      fields: fields ?? [],
    },
  });

  return NextResponse.json(form);
}