import { NextResponse } from "next/server";
import { currentUserSafe, getOrCreateUser } from "@/lib/session";
import { getStripe } from "@/lib/stripe";
import { mapStripeStatus } from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const runtime = "nodejs";

// Checkout success_url lands here. The webhook is the long-term source of
// truth for subscription changes, but reading the session back synchronously
// here means the user's plan is already up to date the instant they land on
// /today — no waiting on a webhook that may arrive a beat late.
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) return NextResponse.redirect(`${origin}/pricing`);

  const cu = await currentUserSafe();
  if (!cu) return NextResponse.redirect(`${origin}/login`);
  const user = await getOrCreateUser(cu);

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.client_reference_id !== user.id) {
      // Not this user's checkout session — don't let it update someone else's plan.
      return NextResponse.redirect(`${origin}/pricing`);
    }

    const subscription = session.subscription as Stripe.Subscription | null;
    if (subscription && typeof session.customer === "string") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: session.customer,
          stripeSubscriptionId: subscription.id,
          plan: mapStripeStatus(subscription.status),
          trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        },
      });
    }
  } catch (err) {
    // Webhook will still catch this up shortly — don't strand the user on an error page.
    console.error("[billing confirm] failed to sync checkout session:", err);
  }

  return NextResponse.redirect(`${origin}/today`);
}
