
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { withRateLimit } from "@/lib/middlewares/rate-limit.middleware";
import { compose } from "@/lib/compose";
import { HealthCheck, HealthResponse } from "@/types/health-check";



async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await prisma.$connect();
    return { status: "ok", latency_ms: Date.now() - start };
  } catch (err) {
    return {
      status: "down",
      latency_ms: Date.now() - start,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

async function checkRedis(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await redis.ping();
    return { status: "ok", latency_ms: Date.now() - start };
  } catch (err) {
    return {
      status: "down",
      latency_ms: Date.now() - start,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

const use = compose(withRateLimit("public"));
export const GET = use(async (): Promise<NextResponse<HealthResponse>> => {
  const [database, redis] = await Promise.allSettled([
    checkDatabase(),
    checkRedis(),
  ]);

  const db =
    database.status === "fulfilled"
      ? database.value
      : { status: "down" as const, latency_ms: 0 };

  const rd =
    redis.status === "fulfilled"
      ? redis.value
      : { status: "down" as const, latency_ms: 0 };

  const overallStatus =
    db.status === "down" || rd.status === "down"
      ? "down"
      : db.status === "degraded" || rd.status === "degraded"
      ? "degraded"
      : "ok";

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime_s: Math.floor(process.uptime()),
      services: {
        database: db,
        redis: rd,
      },
    },
    {
      status: overallStatus === "down" ? 503 : 200,
    }
  );
});