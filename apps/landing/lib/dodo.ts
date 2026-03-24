// lib/dodo.ts
import DodoPayments from "dodopayments";

if (!process.env.DODO_PAYMENTS_API_KEY) {
  throw new Error("DODO_PAYMENTS_API_KEY is not set");
}

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  // Switch to "live_mode" in production via env
  environment: (process.env.DODO_PAYMENTS_ENV as "test_mode" | "live_mode") ?? "test_mode",
});