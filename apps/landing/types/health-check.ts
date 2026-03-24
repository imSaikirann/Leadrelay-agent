
export type ServiceStatus = "ok" | "degraded" | "down";


export type HealthCheck = {
  status: ServiceStatus;
  latency_ms: number;
  error?: string;
};

export type HealthResponse = {
  status: ServiceStatus;
  timestamp: string;
  uptime_s: number;
  services: {
    database: HealthCheck;
    redis: HealthCheck;
  };
};