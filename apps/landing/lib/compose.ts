// lib/compose.ts
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { Company } from "@prisma/client";

// ── Extend this as you add middlewares ───────────────────────────────────────
export type AppContext = {
  req: NextRequest;
 
  session?: Session;
  company?: Company;
  params?: Record<string, string>;  
}

export type Middleware = (
  ctx: AppContext,
  next: () => Promise<NextResponse>
) => Promise<NextResponse>;

export type AppHandler = (ctx: AppContext) => Promise<NextResponse>;

export function compose(...middlewares: Middleware[]) {
  return (handler: AppHandler) => {
    return async (req: NextRequest): Promise<NextResponse> => {
      const ctx: AppContext = { req };

      const run = (index: number): Promise<NextResponse> => {
        if (index === middlewares.length) return handler(ctx);
        return middlewares[index](ctx, () => run(index + 1));
      };

      return run(0);
    };
  };
}