import crypto from "crypto";

export function generateLeadHash(data: Record<string, string>) {
  const email = (data.email || "").toLowerCase().trim();
  const phone = (data.phone || "").replace(/\D/g, "");
  const message = (data.message || "").toLowerCase().trim();

  const base = `${email}|${phone}|${message}`;

  return crypto.createHash("sha256").update(base).digest("hex");
}