import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { mapStripeStatus } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Source of truth for plan state. We only need the subscription's own
// lifecycle events — Stripe always reflects a failed/succeeded charge as a
// status change (active <-> past_due) on the subscription, so there's no
// need to separately handle invoice.payment_succeeded/failed.
const HANDLED_EVENTS = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

async function syncSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return; // not one of ours (e.g. created manually in the dashboard)

  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  await prisma.user
    .update({
      where: { id: userId },
      data: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        plan: mapStripeStatus(subscription.status),
        trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      },
    })
    .catch((err) => {
      console.error(`[stripe webhook] failed to sync user ${userId}:`, err);
    });
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (HANDLED_EVENTS.has(event.type)) {
    await syncSubscription(event.data.object as Stripe.Subscription);
  }

  return NextResponse.json({ received: true });
}
