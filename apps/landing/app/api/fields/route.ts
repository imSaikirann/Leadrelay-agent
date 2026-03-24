import { compose } from "@/lib/compose";
import { withAuth } from "@/lib/middlewares/auth.middleware";
import { withCompany } from "@/lib/middlewares/company.middleware";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const use = compose(withAuth, withRateLimit("authenticated"), withCompany);

// GET — fetch company's fields for form builder / lead view
export const GET = use(async ({ company }) => {
  const fields = await prisma.businessField.findMany({
    where: { companyId: company!.id, isDeleted: false },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(fields);
});

// POST — add a new custom field
export const POST = use(async ({ req, company }) => {
  const { key, label, type, options, isRequired, order } = await req.json();

  if (!key || !label || !type) {
    return NextResponse.json({ error: "key, label, type required" }, { status: 400 });
  }

  const field = await prisma.businessField.create({
    data: {
      companyId: company!.id,
      key: key.toLowerCase().replace(/\s+/g, "_"),
      label,
      type,
      options: options ?? null,
      isRequired: isRequired ?? false,
      order: order ?? 0,
    },
  });

  return NextResponse.json(field, { status: 201 });
});