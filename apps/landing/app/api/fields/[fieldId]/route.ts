import { compose } from "@/lib/compose";
import { withAuth } from "@/lib/middlewares/auth.middleware";
import { withCompany } from "@/lib/middlewares/company.middleware";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


const use = compose(withAuth, withRateLimit("authenticated"), withCompany);

export const PATCH = use(async ({ req, company, params }) => {
  const fieldId = params?.fieldId;
  
    const workspaceId = req.nextUrl.searchParams.get("workspaceId");
    if (!workspaceId)
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  
  const { label, options, isRequired, order } = await req.json();

  const field = await prisma.businessField.updateMany({
    where: { id: fieldId, companyId: company!.id },
    data: { label, options, isRequired, order },
  });

  return NextResponse.json(field);
});

export const DELETE = use(async ({ company, params }) => {
  const fieldId = params?.fieldId;
  
  await prisma.businessField.updateMany({
    where: { id: fieldId, companyId: company!.id },
    data: { isDeleted: true },
  });

  return NextResponse.json({ ok: true });
});