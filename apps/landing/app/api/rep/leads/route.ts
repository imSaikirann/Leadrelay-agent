// app/api/rep/leads/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.isMember)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const page   = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const status = req.nextUrl.searchParams.get("status"); // new | called | converted | lost

  const where = {
    assignedTo: session.user.id,
    ...(status ? { status } : {}),
  };

  const [submissions, total, member] = await Promise.all([
    prisma.formSubmission.findMany({
      where,
      include: { form: { select: { name: true } } },
      orderBy: { assignedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.formSubmission.count({ where }),
    prisma.teamMember.findUnique({
      where: { id: session.user.id },
      select: { name: true, role: true, leads: true, converted: true, activeLeads: true, avgResponseTime: true },
    }),
  ]);

  return NextResponse.json({ submissions, total, page, pageSize: PAGE_SIZE, member });
}

// Log a call
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.isMember)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { submissionId, note, status } = await req.json();
  if (!submissionId)
    return NextResponse.json({ error: "submissionId required" }, { status: 400 });

  // Verify this lead is assigned to this rep
  const submission = await prisma.formSubmission.findFirst({
    where: { id: submissionId, assignedTo: session.user.id },
  });
  if (!submission)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const updated = await prisma.formSubmission.update({
    where: { id: submissionId },
    data: {
      calledAt: new Date(),
      callNote: note ?? null,
      status:   status ?? "called",
    },
  });

  // Update member stats
  if (status === "converted") {
    await prisma.teamMember.update({
      where: { id: session.user.id },
      data: {
        converted:   { increment: 1 },
        activeLeads: { decrement: 1 },
        leads:       { increment: 1 },
      },
    });
  } else if (status === "lost") {
    await prisma.teamMember.update({
      where: { id: session.user.id },
      data: { activeLeads: { decrement: 1 }, leads: { increment: 1 } },
    });
  }

  return NextResponse.json({ success: true, submission: updated });
}