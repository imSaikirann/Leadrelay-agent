// lib/middlewares/auth.middleware.ts — YOUR withAuth for API routes
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Middleware } from "@/lib/compose";

export const withAuth: Middleware = async (ctx, next) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  ctx.session = session;

  return next();
};