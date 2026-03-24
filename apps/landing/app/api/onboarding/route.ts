
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compose } from "@/lib/compose";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { withAuth } from "@/lib/middlewares/auth.middleware";
import { seedFieldsForCompany } from "@/lib/seed-fields";
import { FieldCategory } from "@/lib/field-templates";

const withUser = compose(withAuth, withRateLimit("authenticated"));
const withHeavy = compose(withAuth, withRateLimit("heavy"));

export const GET = withUser(async ({ session }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: session!.user!.email! },
      select: { id: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const company = await prisma.company.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        website: true,
        industry: true,
        size: true,
        subscription: {
          select: {
            status: true,
            trialEnd: true,
            currentPeriodEnd: true,
            plan: {
              select: {
                name: true,
                priceMonthly: true,
                trialDays: true,
              },
            },
          },
        },
      },
    });

    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    return NextResponse.json(company);
  } catch (err) {
    console.error("GET /company error:", err);
    return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 });
  }
});

export const POST = withHeavy(async ({ req, session }) => {
  const { name, email, website, industry, size, category } = await req.json();

  if (!name || !email || !industry) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session!.user!.email! },
      select: { id: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const existing = await prisma.company.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    const company = await prisma.company.upsert({
      where: { userId: user.id },
      update: { name, email, website, industry, size },
      create: { userId: user.id, name, email, website, industry, size },
    });

    if (!existing) {
      // Seed fields based on industry category
      await seedFieldsForCompany(
        company.id,
        (category ?? industry ?? "edtech") as FieldCategory
      );

      const plan = await prisma.plan.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      });

      if (plan) {
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + plan.trialDays);

        await prisma.subscription.create({
          data: {
            companyId: company.id,
            planId: plan.id,
            trialStart: new Date(),
            trialEnd,
            status: "trial",
          },
        });
      }
    }

    return NextResponse.json({ company });
  } catch (err) {
    console.error("POST /company error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
});