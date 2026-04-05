// app/api/analytics/trend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compose, AppContext } from "@/lib/compose";
import { withAuth } from "@/lib/middlewares/auth.middleware";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { withCompany } from "@/lib/middlewares/company.middleware";
import { startOfWeek, subDays, subMonths, format } from "date-fns";
import { buildWorkspaceSubmissionWhere } from "@/lib/workspace";

const use = compose(withAuth, withRateLimit("authenticated"), withCompany);

// groups submissions into buckets by day/week/month
function groupByPeriod(
  submissions: { createdAt: Date; rank: string | null }[],
  period: "daily" | "weekly" | "monthly"
) {
  const buckets: Record<string, { label: string; hot: number; warm: number; cold: number }> = {};

  for (const s of submissions) {
    const date = new Date(s.createdAt);
    let key: string;
    let label: string;

    if (period === "daily") {
      key = format(date, "yyyy-MM-dd");
      label = format(date, "EEE"); // Mon, Tue...
    } else if (period === "weekly") {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      key = format(weekStart, "yyyy-MM-dd");
      label = format(weekStart, "MMM d"); // Jan 6
    } else {
      key = format(date, "yyyy-MM");
      label = format(date, "MMM"); // Jan, Feb
    }

    if (!buckets[key]) {
      buckets[key] = { label, hot: 0, warm: 0, cold: 0 };
    }

    if (s.rank === "hot") buckets[key].hot++;
    else if (s.rank === "warm") buckets[key].warm++;
    else buckets[key].cold++;
  }

  return Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}

export const GET = use(async ({ req, company }: AppContext) => {
  const { searchParams } = new URL(req.url);
  const period = (searchParams.get("period") ?? "daily") as "daily" | "weekly" | "monthly";
  const workspaceId = searchParams.get("workspaceId");

  // Date range based on period
  const now = new Date();
  let since: Date;
  if (period === "daily") since = subDays(now, 7);       // last 7 days
  else if (period === "weekly") since = subDays(now, 56); // last 8 weeks
  else since = subMonths(now, 12);                        // last 12 months

  const workspaceWhere = await buildWorkspaceSubmissionWhere(company!.id, workspaceId);

  const submissions = await prisma.formSubmission.findMany({
    where: {
      ...workspaceWhere,
      createdAt: { gte: since },
    },
    select: { createdAt: true, rank: true },
  });

  const trend = groupByPeriod(submissions, period);

  return NextResponse.json({ period, trend });
});
