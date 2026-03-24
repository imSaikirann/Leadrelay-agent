

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { LEAD_PAGE_SIZE } from "@/lib/constants";
import { compose } from "@/lib/compose";
import { withAuth } from "@/lib/middlewares/auth.middleware";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { withCompany } from "@/lib/middlewares/company.middleware";


const use = compose(withAuth, withRateLimit("heavy"), withCompany);
export const GET = use(async ({ req, session }) => {


  const user = await prisma.user.findUnique({
    where: { email: session?.user.email },
    include: { company: true },
  });

  if (!user?.company) return NextResponse.json({ submissions: [], total: 0 });

  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const rank = req.nextUrl.searchParams.get("rank"); 

  const where = {
    companyId: user.company.id,
    ...(rank === "pending" ? { rank: null } : rank ? { rank } : {}),
  };

  const [submissions, total] = await Promise.all([
    prisma.formSubmission.findMany({
      where,
      include: { form: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) *LEAD_PAGE_SIZE ,
      take: LEAD_PAGE_SIZE,
    }),
    prisma.formSubmission.count({ where }),
  ]);

  return NextResponse.json({ submissions, total, page, pageSize: LEAD_PAGE_SIZE });
})