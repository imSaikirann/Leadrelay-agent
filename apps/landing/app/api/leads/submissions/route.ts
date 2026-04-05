import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { LEAD_PAGE_SIZE } from "@/lib/constants";
import { canViewLeadQueue, MEMBER_ROLE, resolveAccess } from "@/lib/access";
import { buildWorkspaceSubmissionWhere } from "@/lib/workspace";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const access = await resolveAccess(session);

  if (!access || !access.company || !canViewLeadQueue(access)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const rank = req.nextUrl.searchParams.get("rank");
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");

  const leadGenFormIds =
    access.role === MEMBER_ROLE.LEAD_GEN && access.member
      ? await prisma.leadForm.findMany({
          where: {
            companyId: access.company.id,
            createdByMemberId: access.member.id,
          },
          select: { id: true },
        })
      : null;

  const workspaceWhere = await buildWorkspaceSubmissionWhere(access.company.id, workspaceId);

  const where = {
    ...workspaceWhere,
    ...(rank === "pending" ? { rank: null } : rank ? { rank } : {}),
    ...(leadGenFormIds ? { formId: { in: leadGenFormIds.map((form) => form.id) } } : {}),
  };

  const [submissions, total] = await Promise.all([
    prisma.formSubmission.findMany({
      where,
      include: { form: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * LEAD_PAGE_SIZE,
      take: LEAD_PAGE_SIZE,
    }),
    prisma.formSubmission.count({ where }),
  ]);

  return NextResponse.json({ submissions, total, page, pageSize: LEAD_PAGE_SIZE });
}
