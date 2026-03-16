import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, website, industry, size } = await req.json();

  if (!name || !email || !industry) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const company = await prisma.company.upsert({
      where: { userId: session.user.id },
      update: { name, email, website, industry, size },
      create: { userId: session.user.id, name, email, website, industry, size },
    });

    return NextResponse.json({ company });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}