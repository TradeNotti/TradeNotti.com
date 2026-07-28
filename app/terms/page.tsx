import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/ui";
import { TRIAL_DAYS, PRO_PRICE_DISPLAY, MAX_ACCOUNTS_TRIAL, MAX_ACCOUNTS_PRO } from "@/lib/billing";

export const metadata: Metadata = {
  title: "Terms of Service — TradeNotti",
  alternates: { canonical: "/terms" },
};

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
        {n}. {title}
      </h2>
      <div style={{ marginTop: 10, color: "var(--fg-2)", fontSize: 14.5, lineHeight: 1.65 }}>{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="pp-stage" style={{ height: "auto", minHeight: "100vh", overflow: "visible" }}>
      <header className="pp-utilbar">
        <div className="pp-brand">
          <BrandLogo size={18} />
        </div>
        <div className="pp-right">
          <Link href="/pricing">Pricing</Link>
          <Link href="https://app.tradenotti.com/login">Sign in</Link>
          <Link href="https://app.tradenotti.com/signup" className="oa-btn oa-btn-accent oa-btn-md">
            Get started
          </Link>
        </div>
      </header>

      <div className="pp-landing" style={{ overflowY: "visible" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 32px 96px" }}>
          <span className="overline" style={{ color: "var(--gold-deep)" }}>
            Legal
          </span>
          <h1 style={{ marginTop: 10 }}>Terms of Service</h1>
          <p style={{ color: "var(--fg-2)", fontSize: 14.5, marginTop: 12 }}>Last updated: July 28, 2026</p>

          <p style={{ marginTop: 24, color: "var(--fg-2)", fontSize: 14.5, lineHeight: 1.65 }}>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of TradeNotti (&ldquo;TradeNotti,&rdquo;
            &ldquo;we,&rdquo; or &ldquo;us&rdquo;) at tradenotti.com and app.tradenotti.com (the &ldquo;Service&rdquo;).
            By creating an account you agree to these Terms.
          </p>

          <Section n={1} title="Acceptance of Terms">
            <p>
              You must be at least 18 years old, or the age of majority in your jurisdiction, to use TradeNotti. By
              signing up you confirm you meet that requirement and agree to be bound by these Terms.
            </p>
          </Section>

          <Section n={2} title="Description of Service">
            <p>
              TradeNotti is a trading journal: it lets you log trades, notes, screenshots, and habits, and generates
              AI-assisted insights from the data you enter. It does not place trades, connect to your broker, or move
              money on your behalf.
            </p>
          </Section>

          <Section n={3} title="Eligibility &amp; Accounts">
            <p>
              You&rsquo;re responsible for the accuracy of the information you provide and for keeping your login
              credentials secure. You&rsquo;re responsible for all activity that happens under your account.
            </p>
          </Section>

          <Section n={4} title="Acceptable Use">
            <p>
              Don&rsquo;t misuse the Service: no attempting to disrupt or gain unauthorized access to it, no scraping
              or reverse engineering, no uploading unlawful content, and no using it to violate anyone else&rsquo;s
              rights.
            </p>
          </Section>

          <Section n={5} title="Your Content">
            <p>
              You own the trade notes, screenshots, and journal entries you create (&ldquo;Your Content&rdquo;). You
              grant us a license to store, process, and display Your Content solely to operate and improve the
              Service for you, including generating AI insights from it. We don&rsquo;t sell Your Content.
            </p>
          </Section>

          <Section n={6} title="Trading Data &amp; Broker Information">
            <p>
              Broker and account details you enter (name, balance, currency, etc.) are self-reported metadata you
              type in yourself — TradeNotti does not connect to or sync with your broker.
            </p>
          </Section>

          <Section n={7} title="Third-Party Services">
            <p>
              We use third-party providers to run TradeNotti, including Clerk (authentication), Stripe (billing), and
              OpenAI (AI insights). Your use of the Service is also subject to those providers processing data as
              needed to deliver their part of the Service.
            </p>
          </Section>

          <Section n={8} title="Intellectual Property">
            <p>
              TradeNotti, our logo, and the Service&rsquo;s design and code are our property or licensed to us. These
              Terms don&rsquo;t grant you any rights to our trademarks or branding.
            </p>
          </Section>

          <Section n={9} title="Disclaimers — Not Financial Advice">
            <p>
              TradeNotti is a journaling and analytics tool, not a financial advisor, broker, or signal provider.
              Nothing in the Service is investment advice. AI-generated insights are informational and may be wrong —
              you&rsquo;re solely responsible for your trading decisions. The Service is provided &ldquo;as is&rdquo;
              without warranties of any kind.
            </p>
          </Section>

          <Section n={10} title="Limitation of Liability">
            <p>
              To the maximum extent permitted by law, TradeNotti is not liable for indirect, incidental, or
              consequential damages, or for any trading losses, arising from your use of the Service. Our total
              liability for any claim is limited to the amount you paid us in the 12 months before the claim arose.
            </p>
          </Section>

          <Section n={11} title="Termination">
            <p>
              You can stop using the Service and cancel your subscription at any time. We may suspend or terminate
              accounts that violate these Terms. On termination, your right to use the Service ends, though Section 10
              and other terms that by their nature should survive will continue to apply.
            </p>
          </Section>

          <Section n={12} title="Free Trial">
            <p>
              New subscriptions start with a {TRIAL_DAYS}-day free trial. A valid payment card is required to start
              the trial, but you are not charged until the trial ends. During the trial you can connect up to{" "}
              {MAX_ACCOUNTS_TRIAL} broker account. If you cancel before the trial ends, you won&rsquo;t be charged.
            </p>
          </Section>

          <Section n={13} title="Billing &amp; Subscription">
            <p>
              When your trial ends, your card is automatically charged {PRO_PRICE_DISPLAY} for the TradeNotti Pro
              plan, which includes up to {MAX_ACCOUNTS_PRO} broker accounts, and renews monthly until canceled.{" "}
              {PRO_PRICE_DISPLAY} is our current launch price — we may change pricing for new or renewing
              subscriptions going forward, and we&rsquo;ll give you reasonable notice before any change takes effect
              on your account. Billing is processed by Stripe; we don&rsquo;t store your card details ourselves.
            </p>
          </Section>

          <Section n={14} title="Cancellation &amp; Refunds">
            <p>
              You can cancel anytime from Settings &rarr; Manage billing. Cancellation takes effect at the end of
              your current billing period, and you keep access until then. Payments already made are non-refundable
              except where required by law.
            </p>
          </Section>

          <Section n={15} title="Changes to These Terms">
            <p>
              We may update these Terms from time to time. If we make material changes, we&rsquo;ll notify you (e.g.
              by email or in-app notice) before they take effect. Continuing to use the Service after a change takes
              effect means you accept the updated Terms.
            </p>
          </Section>

          <Section n={16} title="Contact">
            <p>
              Questions about these Terms? Reach us at{" "}
              <a href="mailto:support@tradenotti.com" style={{ color: "var(--gold-deep)" }}>
                support@tradenotti.com
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="pp-foot">
          <span>© 2026 TradeNotti</span>
          <Link href="/" style={{ color: "inherit" }}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
