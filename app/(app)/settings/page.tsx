import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { maxAccountsFor, planLabel, trialDaysLeft, PRO_PRICE_DISPLAY } from "@/lib/billing";
import { Card, CardHeader } from "@/components/ui";
import { SettingsForm, AddAccountForm, ManageBillingButton } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const accounts = await prisma.account.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } });
  const maxAccounts = maxAccountsFor(user.plan);
  const daysLeft = trialDaysLeft(user.trialEndsAt);

  return (
    <div className="oa-page">
      <div className="oa-page-header">
        <div>
          <div className="overline">Settings</div>
          <h1 className="oa-page-title">Profile &amp; preferences</h1>
        </div>
      </div>

      <div className="oa-grid-12" style={{ gap: 16 }}>
        <div style={{ gridColumn: "span 7" }}>
          <Card>
            <CardHeader overline="Profile" title="You" />
            <div style={{ marginTop: 14 }}>
              <SettingsForm
                name={user.name ?? ""}
                theme={user.theme}
                accent={user.accentPalette}
                timezone={user.timezone}
                email={user.email}
                watchlist={user.watchlist}
              />
            </div>
          </Card>
        </div>

        <div style={{ gridColumn: "span 5" }}>
          <Card padding={0}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line-2)" }}>
              <div className="overline">Accounts</div>
              <h3 className="oa-card-title" style={{ marginTop: 4 }}>
                Trading accounts
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {accounts.map((a) => (
                <div key={a.id} className="oa-acct-item" style={{ gap: 12 }}>
                  <span className={`oa-acct-dot ${a.kind}`} />
                  <div style={{ flex: 1 }}>
                    <div className="oa-acct-name">{a.name}</div>
                    <div className="oa-acct-meta">
                      {a.broker} · {a.currency} · {a.balance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 16, borderTop: "1px solid var(--line-2)" }}>
              <AddAccountForm count={accounts.length} max={maxAccounts} />
            </div>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <CardHeader overline="Billing" title={planLabel(user)} />
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 13, color: "var(--fg-2)", margin: 0 }}>
                {user.plan === "ACTIVE"
                  ? `Pro — ${PRO_PRICE_DISPLAY}, up to ${maxAccounts} accounts.`
                  : user.plan === "TRIALING"
                    ? `Your trial ${daysLeft === 0 ? "ends today" : `ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`} — then ${PRO_PRICE_DISPLAY} on Pro.`
                    : user.plan === "PAST_DUE"
                      ? "We couldn't charge your card — update it to keep your subscription active."
                      : "Your trial has ended. Resubscribe to get back in."}
              </p>
              <ManageBillingButton />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
