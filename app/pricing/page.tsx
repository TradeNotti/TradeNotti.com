import type { Metadata } from "next";
import Link from "next/link";
import { currentUserSafe, getOrCreateUser } from "@/lib/session";
import {
  hasAccess,
  PRO_PRICE_USD,
  PRO_PRICE_WEEKLY_USD,
  MAX_ACCOUNTS_TRIAL,
  MAX_ACCOUNTS_PRO,
  TRIAL_DAYS,
} from "@/lib/billing";
import { Icon, BrandLogo } from "@/components/ui";
import { StartTrialButton } from "./start-trial-button";
import { ProPrice } from "./pro-price";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing — TradeNotti",
  description: `${TRIAL_DAYS}-day free trial, then $${PRO_PRICE_USD}/mo for TradeNotti Pro.`,
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const cu = await currentUserSafe();
  const user = cu ? await getOrCreateUser(cu) : null;
  const alreadySubscribed = user ? hasAccess(user) : false;

  return (
    <div className="pp-stage" style={{ height: "auto", minHeight: "100vh", overflow: "visible" }}>
      <header className="pp-utilbar">
        <div className="pp-brand">
          <BrandLogo size={18} />
        </div>
        <div className="pp-right">
          <Link href="https://app.tradenotti.com/login">Sign in</Link>
          <Link href="https://app.tradenotti.com/signup" className="oa-btn oa-btn-accent oa-btn-md">
            Get started
          </Link>
        </div>
      </header>

      <div className="pp-landing" style={{ overflowY: "visible" }}>
        <div className="pp-pricing">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 40px" }}>
            <span className="overline" style={{ color: "var(--gold-deep)" }}>
              Pricing
            </span>
            <h1 style={{ marginTop: 10 }}>Simple pricing. Serious trading results.</h1>
            <p className="pp-hero-sub" style={{ margin: "14px auto 0" }}>
              Start with a {TRIAL_DAYS}-day free trial and experience the complete TradeNotti workflow. No charges
              until your trial ends, and you can cancel anytime.
            </p>
          </div>

          <div className="pp-plans">
            <div className="pp-plan-card">
              <div className="pp-plan-name">Free trial</div>
              <div className="pp-plan-price">
                {TRIAL_DAYS}
                <span className="pp-plan-per"> days</span>
              </div>
              <div className="pp-plan-sub">Full access to try TradeNotti before you&rsquo;re charged.</div>
              <ul className="pp-plan-feats">
                <li>
                  <Icon name="check" size={16} /> Journal, notebook &amp; analytics
                </li>
                <li>
                  <Icon name="check" size={16} /> {MAX_ACCOUNTS_TRIAL} broker account
                </li>
                <li>
                  <Icon name="check" size={16} /> Daily AI insight
                </li>
              </ul>
            </div>

            <div className="pp-plan-card featured">
              <div className="pp-plan-name">Pro</div>
              <ProPrice monthlyUsd={PRO_PRICE_USD} weeklyUsd={PRO_PRICE_WEEKLY_USD} />
              <div className="pp-plan-sub" style={{ marginTop: 8 }}>
                What your trial becomes once it ends.
              </div>
              <ul className="pp-plan-feats">
                <li>
                  <Icon name="check" size={16} /> Everything in the trial
                </li>
                <li>
                  <Icon name="check" size={16} /> Up to {MAX_ACCOUNTS_PRO} broker accounts
                </li>
                <li>
                  <Icon name="check" size={16} /> Cancel anytime
                </li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: 40, textAlign: "center" }}>
            {alreadySubscribed ? (
              <Link href="/today" className="oa-btn oa-btn-accent oa-btn-md">
                Go to your dashboard <Icon name="arrow-right" size={16} />
              </Link>
            ) : cu ? (
              <StartTrialButton />
            ) : (
              <Link href="https://app.tradenotti.com/signup" className="oa-btn oa-btn-accent oa-btn-md">
                Start your free trial <Icon name="arrow-right" size={16} />
              </Link>
            )}
            <p className="pp-plan-foot" style={{ marginTop: 16 }}>
              Founding-member pricing.
            </p>
          </div>
        </div>

        <div className="pp-foot">
          <span>© 2026 TradeNotti</span>
          <Link href="/terms" style={{ color: "inherit" }}>
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
