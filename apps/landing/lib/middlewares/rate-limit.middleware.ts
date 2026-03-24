
import { NextResponse } from "next/server";

import { Middleware } from "@/lib/compose";
import { checkRateLimit } from "../with-rate-limit";
import { RateLimiterKey } from "@/config/rate-limit";

export const withRateLimit = (type: RateLimiterKey): Middleware =>
  async (ctx, next) => {
    
    const identifier = ctx.session?.user?.email ?? undefined;
    const blocked = await checkRateLimit(ctx.req, type, identifier);
    if (blocked) return blocked;
    return next();
  };