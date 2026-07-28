import { NextResponse } from "next/server";
import { currentUserSafe, getOrCreateUser } from "@/lib/session";
import { getStripe } from "@/lib/stripe";
import { TRIAL_DAYS } from "@/lib/billing";

export const runtime = "nodejs";

// Creates a Stripe Checkout Session that starts the 7-day trial. Checkout
// collects a card by default in subscription mode — that's the "card
// required" requirement, no extra config needed.
export async function POST(req: Request) {
  const cu = await currentUserSafe();
  if (!cu) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Billing isn't configured yet." }, { status: 500 });
  }

  const user = await getOrCreateUser(cu);
  const origin = new URL(req.url).origin;

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata: { userId: user.id },
    },
    client_reference_id: user.id,
    ...(user.stripeCustomerId
      ? { customer: user.stripeCustomerId }
      : { customer_email: user.email }),
    success_url: `${origin}/api/billing/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
  return NextResponse.json({ url: session.url });
}
