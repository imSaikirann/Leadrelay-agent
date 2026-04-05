
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compose, AppContext } from "@/lib/compose";
import { withAuth } from "@/lib/middlewares/auth.middleware";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { withCompany } from "@/lib/middlewares/company.middleware";
import { LEAD_RANK } from "@/lib/constants";
import { buildWorkspaceSubmissionWhere } from "@/lib/workspace";

const use = compose(withAuth, withRateLimit("authenticated"), withCompany);

export const GET = use(async ({ req, company }: AppContext) => {
  const workspaceId = new URL(req.url).searchParams.get("workspaceId");
  const workspaceWhere = await buildWorkspaceSubmissionWhere(company!.id, workspaceId);
  const called = await prisma.formSubmission.findMany({
    where: {
      ...workspaceWhere,
      calledAt: { not: null },
      rank: LEAD_RANK.HOT,
    },
    select: { createdAt: true, calledAt: true },
  });

  const buckets = { under15: 0, from15to30: 0, from30to60: 0, over60: 0 };

  for (const s of called) {
    const diffMin = (new Date(s.calledAt!).getTime() - new Date(s.createdAt).getTime()) / 60000;
    if (diffMin < 15) buckets.under15++;
    else if (diffMin < 30) buckets.from15to30++;
    else if (diffMin < 60) buckets.from30to60++;
    else buckets.over60++;
  }

  return NextResponse.json([
    { range: "< 15 min", leads: buckets.under15, color: "#22c55e" },
    { range: "15–30 min", leads: buckets.from15to30, color: "#f59e0b" },
    { range: "30–60 min", leads: buckets.from30to60, color: "#f97316" },
    { range: "> 1 hour", leads: buckets.over60, color: "#ef4444" },
  ]);
});
