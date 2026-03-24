
import { RateLimiterKey, rateLimiters } from "@/config/rate-limit";
import { NextRequest, NextResponse } from "next/server";


function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

export async function checkRateLimit(
  req: NextRequest,
  type: RateLimiterKey,
 
  identifier?: string
): Promise<NextResponse | null> {
  const id = identifier ?? getIP(req);
  const { success, limit, remaining, reset } = await rateLimiters[type].limit(id);

  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    );
  }

  return null; // no block
}