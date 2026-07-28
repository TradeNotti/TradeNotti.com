import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { hasAccess, planLabel } from "@/lib/billing";
import { AppShell, type AccountVM } from "@/components/app-shell";
import { ThemeApplier } from "@/components/theme-applier";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  // No permanent free tier: brand-new users land here straight from signup
  // with no subscription yet, and a lapsed trial/canceled subscription loses
  // access the same way — both send them to /pricing to (re)start Checkout.
  if (!hasAccess(user)) redirect("/pricing");

  const accountRows = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const accounts: AccountVM[] = accountRows.map((a) => ({
    id: a.id,
    name: a.name,
    broker: a.broker,
    currency: a.currency,
    kind: a.kind,
    balance: a.balance,
  }));

  return (
    <>
      <ThemeApplier theme={user.theme} accent={user.accentPalette} />
      <AppShell
        accounts={accounts}
        currentId={accounts[0]?.id}
        user={{ name: user.name || "Trader", email: user.email, plan: planLabel(user) }}
      >
        {children}
      </AppShell>
    </>
  );
}
