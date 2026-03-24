
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "standardwebhooks";
import { prisma } from "@/lib/prisma";
import { addMonths } from "date-fns";

// Dodo uses standardwebhooks spec — base64-encoded secret
const wh = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_SECRET!);

// Disable Next.js body parsing — we need raw text for signature verification
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const headersList = headers();

  // ── Verify signature ──────────────────────────────────────────────────────
  try {
    await wh.verify(rawBody, {
      "webhook-id": (await headersList).get("webhook-id") ?? "",
      "webhook-signature": (await headersList).get("webhook-signature") ?? "",
      "webhook-timestamp": (await headersList).get("webhook-timestamp") ?? "",
    });
  } catch (err) {
    console.error("[dodo webhook] Invalid signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventType: string = payload.type ?? payload.event_type ?? "";
  const data = payload.data ?? payload;

  console.log(`[dodo webhook] Event: ${eventType}`, data);

  try {
    switch (eventType) {

      // ── Subscription activated (first payment or renewal) ────────────────
      case "subscription.active": {
        const dodoSubId: string = data.subscription_id;
        const companyId: string = data.metadata?.companyId ?? await resolveCompanyId(dodoSubId);
        if (!companyId) break;

        const now = new Date();
        await prisma.subscription.update({
          where: { companyId },
          data: {
            status: "active",
            currentPeriodStart: now,
            currentPeriodEnd: addMonths(now, 1),
            dodoSubscriptionId: dodoSubId,
          },
        });

        // Log payment
        await logPayment({
          companyId,
          dodoSubId,
          amount: data.recurring_pre_tax_amount ?? 0,
          status: "success",
          dodoPaymentId: data.payment_id ?? null,
          paidAt: now,
        });

        break;
      }

      // ── Subscription on hold (payment failed, retrying) ──────────────────
      case "subscription.on_hold": {
        const dodoSubId: string = data.subscription_id;
        const companyId = data.metadata?.companyId ?? await resolveCompanyId(dodoSubId);
        if (!companyId) break;

        await prisma.subscription.update({
          where: { companyId },
          data: { status: "past_due" },
        });
        break;
      }

      // ── Subscription cancelled ───────────────────────────────────────────
      case "subscription.cancelled": {
        const dodoSubId: string = data.subscription_id;
        const companyId = data.metadata?.companyId ?? await resolveCompanyId(dodoSubId);
        if (!companyId) break;

        await prisma.subscription.update({
          where: { companyId },
          data: { status: "cancelled", cancelledAt: new Date() },
        });
        break;
      }

      // ── Subscription expired ─────────────────────────────────────────────
      case "subscription.expired": {
        const dodoSubId: string = data.subscription_id;
        const companyId = data.metadata?.companyId ?? await resolveCompanyId(dodoSubId);
        if (!companyId) break;

        await prisma.subscription.update({
          where: { companyId },
          data: { status: "expired" },
        });
        break;
      }

      // ── Payment succeeded (renewal) ──────────────────────────────────────
      case "payment.succeeded": {
        const dodoSubId: string = data.subscription_id ?? "";
        const companyId = data.metadata?.companyId ?? await resolveCompanyId(dodoSubId);
        if (!companyId) break;

        await logPayment({
          companyId,
          dodoSubId,
          amount: data.total_amount ?? 0,
          status: "success",
          dodoPaymentId: data.payment_id ?? null,
          paidAt: new Date(data.created_at ?? Date.now()),
        });

        // Extend billing period on renewal
        const now = new Date();
        await prisma.subscription.update({
          where: { companyId },
          data: {
            status: "active",
            currentPeriodStart: now,
            currentPeriodEnd: addMonths(now, 1),
          },
        });
        break;
      }

      // ── Payment failed ───────────────────────────────────────────────────
      case "payment.failed": {
        const dodoSubId: string = data.subscription_id ?? "";
        const companyId = data.metadata?.companyId ?? await resolveCompanyId(dodoSubId);
        if (!companyId) break;

        await logPayment({
          companyId,
          dodoSubId,
          amount: data.total_amount ?? 0,
          status: "failed",
          dodoPaymentId: data.payment_id ?? null,
          paidAt: null,
        });
        break;
      }

      default:
        console.log(`[dodo webhook] Unhandled event: ${eventType}`);
    }
  } catch (err) {
    console.error("[dodo webhook] Handler error:", err);
    // Return 200 so Dodo doesn't retry — log and investigate separately
  }

  return NextResponse.json({ received: true });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Fallback: look up companyId by dodoSubscriptionId if metadata wasn't passed
async function resolveCompanyId(dodoSubId: string): Promise<string | null> {
  if (!dodoSubId) return null;
  const sub = await prisma.subscription.findFirst({
    where: { dodoSubscriptionId: dodoSubId },
    select: { companyId: true },
  });
  return sub?.companyId ?? null;
}

async function logPayment({
  companyId,
  dodoSubId,
  amount,
  status,
  dodoPaymentId,
  paidAt,
}: {
  companyId: string;
  dodoSubId: string;
  amount: number;
  status: string;
  dodoPaymentId: string | null;
  paidAt: Date | null;
}) {
  const sub = await prisma.subscription.findUnique({
    where: { companyId },
    select: { id: true },
  });
  if (!sub) return;

  await prisma.payment.create({
    data: {
      subscriptionId: sub.id,
      amount,
      currency: "INR",
      status,
      gateway: "dodo",
      gatewayOrderId: dodoSubId,
      gatewayPaymentId: dodoPaymentId,
      paidAt,
    },
  });
}