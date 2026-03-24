
import { redis } from "@/lib/redis";
import { Ratelimit } from "@upstash/ratelimit";



export const rateLimiters = {
  // Unauthenticated / public endpoints (form submissions)
  public: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"),
    prefix: "rl:public",
    analytics: true,
  }),

  // Authenticated API calls (dashboard, imports)
  authenticated: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    prefix: "rl:auth",
    analytics: true,
  }),

  // Heavy endpoints (Excel import, AI scoring trigger)
  heavy: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: "rl:heavy",
    analytics: true,
  }),

  // Auth endpoints (login, register) — brute force protection
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "rl:auth-login",
    analytics: true,
  }),
} as const;

export type RateLimiterKey = keyof typeof rateLimiters;