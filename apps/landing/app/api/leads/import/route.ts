
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest";
import { generateLeadHash } from "@/lib/hash";
import { REQUIRED_FIELDS } from "@/lib/constants";
import { compose } from "@/lib/compose";
import { withAuth } from "@/lib/middlewares/auth.middleware";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { withCompany } from "@/lib/middlewares/company.middleware";

const REQUIRED_COLUMN = REQUIRED_FIELDS.MESSAGE;
const use = compose(withAuth, withRateLimit("heavy"), withCompany);
export const POST = use(async ({ req, session, params }) => {

 



  let body: { formId?: string; rows: Record<string, string>[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { formId, rows } = body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "rows[] are required" }, { status: 400 });
  }

  const firstRowKeys = Object.keys(rows[0] ?? {}).map((k) => k.toLowerCase());
  if (!firstRowKeys.includes(REQUIRED_COLUMN)) {
    return NextResponse.json(
      { error: `Missing required column: "message"` },
      { status: 422 }
    );
  }


  const user = await prisma.user.findUnique({
    where: { email: session?.user.email },
    include: { company: true },
  });

  if (!user?.company) {
    return NextResponse.json({ error: "No company found for this user" }, { status: 403 });
  }


  let resolvedFormId: string | null = null;

  if (formId) {
    const form = await prisma.leadForm.findFirst({
      where: { id: formId, companyId: user.company.id },
    });
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }
    resolvedFormId = form.id;
  }


  const created: string[] = [];


for (const row of rows) {
  const data: Record<string, string> = {};

  for (const [k, v] of Object.entries(row)) {
    data[k.toLowerCase()] = String(v ?? "").trim();
  }

  const hash = generateLeadHash(data);

  const existing = await prisma.formSubmission.findFirst({
    where: {
      companyId: user.company.id,
      hash,
    },
  });

  if (existing) {
    console.log("⚠️ Duplicate lead skipped:", data.email);
    continue;
  }

  
  let isSpam = false;

  const message = data.message?.toLowerCase() || "";

  if (
    message.length < 5 ||
    message.includes("buy now") ||
    message.includes("free money") ||
    message.includes("http://") ||
    message.includes("https://")
  ) {
    isSpam = true;
  }

  const submission = await prisma.formSubmission.create({
    data: {

      companyId: user.company.id,
      data,
      hash,           
      rank: null,
      rankReason: null,
    },
  });


  if (!isSpam) {
    await inngest.send({
      name: "lead/submitted",
      data: { submissionId: submission.id, companyId: user.company.id },
    });
  }

  created.push(submission.id);
}

  return NextResponse.json({ imported: created.length }, { status: 200 });
})