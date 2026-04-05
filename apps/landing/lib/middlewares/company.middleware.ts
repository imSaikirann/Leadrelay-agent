import { NextResponse } from "next/server";
import { Middleware } from "@/lib/compose";
import { resolveAccess } from "@/lib/access";

export const withCompany: Middleware = async (ctx, next) => {
  const access = await resolveAccess(ctx.session ?? null);

  if (!access?.company) {
    return NextResponse.json({ error: "No company found" }, { status: 403 });
  }

  ctx.company = access.company;
  return next();
};
