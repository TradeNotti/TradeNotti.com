import { NextResponse } from "next/server";
import { currentUserSafe, getOrCreateUser } from "@/lib/session";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Stripe's hosted billing portal — where a subscriber manages their card,
// views invoices, or cancels. No custom UI needed for any of that.
export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Billing isn't configured yet." }, { status: 500 });
  }

  const cu = await currentUserSafe();
  if (!cu) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const user = await getOrCreateUser(cu);
  if (!user.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account yet." }, { status: 400 });
  }

  const origin = new URL(req.url).origin;
  const session = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${origin}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
