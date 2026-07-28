import type { PlanStatus, User } from "@prisma/client";
import type Stripe from "stripe";

export const TRIAL_DAYS = 7;

// Launch/founding price — expect this to move to $15-17/mo once the trial
// cohort matures. This is the one place the number lives; the pricing page,
// terms page, and Checkout Session description all read from here. The
// amount actually charged comes from Stripe's Price (STRIPE_PRICE_ID) — keep
// that in sync with this constant when it changes.
export const PRO_PRICE_USD = 9.99;
export const PRO_PRICE_DISPLAY = `$${PRO_PRICE_USD.toFixed(2)}/mo`;

// Weekly framing of the same monthly price (monthly ÷ 4), shown on the
// pricing page as a toggle. This is display-only — billing itself is still
// monthly (STRIPE_PRICE_ID); a real weekly-billed subscription would need
// its own Stripe Price before this could be an actual checkout option.
export const PRO_PRICE_WEEKLY_USD = Math.round((PRO_PRICE_USD / 4) * 100) / 100;
export const PRO_PRICE_WEEKLY_DISPLAY = `$${PRO_PRICE_WEEKLY_USD.toFixed(2)}/wk`;

export const MAX_ACCOUNTS_TRIAL = 1;
export const MAX_ACCOUNTS_PRO = 2;

// PAST_DUE keeps access — Stripe already retries the charge and emails the
// customer; a temporarily declined card shouldn't lock someone out mid-review.
// CANCELED, and TRIALING past its trialEndsAt, do not.
export function hasAccess(user: Pick<User, "plan" | "trialEndsAt" | "stripeSubscriptionId">): boolean {
  if (!user.stripeSubscriptionId) return false; // never completed Checkout
  if (user.plan === "ACTIVE" || user.plan === "PAST_DUE") return true;
  if (user.plan === "TRIALING") return !user.trialEndsAt || user.trialEndsAt.getTime() > Date.now();
  return false; // CANCELED
}

export function maxAccountsFor(plan: PlanStatus): number {
  return plan === "ACTIVE" ? MAX_ACCOUNTS_PRO : MAX_ACCOUNTS_TRIAL;
}

export function trialDaysLeft(trialEndsAt: Date | null): number | null {
  if (!trialEndsAt) return null;
  const ms = trialEndsAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export function planLabel(user: Pick<User, "plan" | "trialEndsAt">): string {
  switch (user.plan) {
    case "ACTIVE":
      return "Pro";
    case "PAST_DUE":
      return "Payment past due";
    case "CANCELED":
      return "Trial ended";
    case "TRIALING": {
      const days = trialDaysLeft(user.trialEndsAt);
      return days === null ? "Trial" : `Trial · ${days}d left`;
    }
  }
}

// Collapses Stripe's subscription statuses to the four states the app acts on.
export function mapStripeStatus(status: Stripe.Subscription.Status): PlanStatus {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
      return "PAST_DUE";
    default:
      // canceled, incomplete, incomplete_expired, paused
      return "CANCELED";
  }
}
