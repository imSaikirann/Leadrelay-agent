import { prisma } from "@/lib/prisma";
import { withCompany } from "@/lib/middlewares/company.middleware";
import { compose } from "@/lib/compose";
import { withAuth } from "@/lib/middlewares/auth.middleware";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { NextResponse } from "next/server";
import { LEAD_RANK } from "@/lib/constants";
import { buildWorkspaceSubmissionWhere } from "@/lib/workspace";

const use = compose(withAuth, withRateLimit("authenticated"), withCompany);

export const GET = use(async ({ req, company }) => {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  const where = await buildWorkspaceSubmissionWhere(company!.id, workspaceId);

  const submissions = await prisma.formSubmission.findMany({
    where,
  });

  const total = submissions.length;

  const hot = submissions.filter((s) => s.rank === LEAD_RANK.HOT).length;
  const warm = submissions.filter((s) => s.rank === LEAD_RANK.WARM).length;
  const cold = submissions.filter((s) => s.rank === LEAD_RANK.COLD).length;

  const conversionRate = total
    ? Math.round((hot / total) * 100)
    : 0;


  const recentLeads = await prisma.formSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json({
    stats: { total, hot, warm, cold, conversionRate },
    recentLeads,
  });
})
