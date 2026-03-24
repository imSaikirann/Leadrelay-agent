
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Middleware } from "@/lib/compose";

export const withCompany: Middleware = async (ctx, next) => {
  const user = await prisma.user.findUnique({
    where: { email: ctx.session!.user!.email! },
    include: { company: true },
  });
  if (!user?.company) {
    return NextResponse.json({ error: "No company found" }, { status: 403 });
  }
  ctx.company = user.company;
  return next();
};