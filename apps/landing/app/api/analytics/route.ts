// app/api/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compose } from "@/lib/compose";
import { withAuth } from "@/lib/middlewares/auth.middleware";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { withCompany } from "@/lib/middlewares/company.middleware";
import { AppContext } from "@/lib/compose";
import { buildWorkspaceSubmissionWhere } from "@/lib/workspace";

const use = compose(withAuth, withRateLimit("authenticated"), withCompany);

export const GET = use(async ({ req, company }: AppContext) => {
  const workspaceId = new URL(req.url).searchParams.get("workspaceId");
  const where = await buildWorkspaceSubmissionWhere(company!.id, workspaceId);
  const submissions = await prisma.formSubmission.findMany({
    where,
    select: { rank: true, assignedTo: true, rankedAt: true, createdAt: true },
  });

  const total = submissions.length;
  const hot = submissions.filter((s) => s.rank === "hot").length;
  const warm = submissions.filter((s) => s.rank === "warm").length;
  const cold = submissions.filter((s) => s.rank === "cold").length;
  const unranked = submissions.filter((s) => !s.rank).length;

  // Hot assigned
  const hotLeads = submissions.filter((s) => s.rank === "hot");
  const hotAssigned = hotLeads.filter((s) => s.assignedTo).length;

  // Avg score time (rankedAt - createdAt) in seconds
  const ranked = submissions.filter((s) => s.rankedAt && s.createdAt);
  const avgScoreMs =
    ranked.length > 0
      ? ranked.reduce((acc, s) => {
          return acc + (new Date(s.rankedAt!).getTime() - new Date(s.createdAt).getTime());
        }, 0) / ranked.length
      : 0;
  const avgScoreSeconds = (avgScoreMs / 1000).toFixed(1);

  return NextResponse.json({
    total,
    hot,
    warm,
    cold,
    unranked,
    hotAssigned,
    hotTotal: hotLeads.length,
    avgScoreSeconds,
    hotRate: total > 0 ? Math.round((hot / total) * 100) : 0,
  });
});
