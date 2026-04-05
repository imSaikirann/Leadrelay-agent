import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const workspaceId = new URL(req.url).searchParams.get("workspaceId");

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
    include: {
      leadForm: {
        where:
          workspaceId && workspaceId !== "all" && workspaceId !== "founder"
            ? { teamId: workspaceId }
            : undefined,
        include: { _count: { select: { submissions: true } } },
      },
    },
  });

  if (!company) return NextResponse.json({ submissions: 0 });


  const total = company.leadForm.reduce(
    (sum, form) => sum + form._count.submissions,
    0
  );

  return NextResponse.json({ submissions: total });
}
