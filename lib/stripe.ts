import Stripe from "stripe";

// Constructed lazily — `new Stripe("")` throws immediately (even just
// importing a module that does it at the top level blows up every route
// that imports it), so this can't run at module load when the key is unset
// (local dev without billing configured, preview deploys, etc).
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured.");
    client = new Stripe(key);
  }
  return client;
}
