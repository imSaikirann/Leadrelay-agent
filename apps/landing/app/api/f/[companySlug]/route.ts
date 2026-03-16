import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest";

async function getForm(companySlug: string, formSlug?: string) {
  const companies = await prisma.company.findMany({
    include: { leadForm: true },
  });
  const company = companies.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === companySlug
  );
  const form = formSlug
    ? company?.leadForm?.find((f) => f.slug === formSlug)
    : company?.leadForm?.[0];
  return { company, form };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ companySlug: string }> }
) {
  const { companySlug } = await params;
  const formSlug = req.nextUrl.searchParams.get("form") ?? undefined;
  const { company, form } = await getForm(companySlug, formSlug);
  if (!company || !form) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ companyName: company.name, formName: form.name, fields: form.fields });
}


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ companySlug: string }> }
) {
  const { companySlug } = await params;
  const formSlug = req.nextUrl.searchParams.get("form") ?? undefined;
  const { company, form } = await getForm(companySlug, formSlug);
  if (!company || !form) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = await req.json();

  console.log("💾 Saving submission...");
  const submission = await prisma.formSubmission.create({
    data: { formId: form.id, companyId: company.id, data },
  });
  console.log("✅ Saved submission ID:", submission.id);

  try {
    console.log("🚀 Sending inngest event...");
    const result = await inngest.send({
      name: "lead/submitted",
      data: { submissionId: submission.id, companyId: company.id },
    });
    console.log("✅ Inngest sent:", JSON.stringify(result));
  } catch (err) {
    console.error("❌ Inngest send failed:", err);
  }

  return NextResponse.json({ success: true });
}