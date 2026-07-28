-- Billing: trial + Stripe subscription tracking on User
CREATE TYPE "PlanStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED');

ALTER TABLE "User"
  ADD COLUMN "plan" "PlanStatus" NOT NULL DEFAULT 'TRIALING',
  ADD COLUMN "trialEndsAt" TIMESTAMP(3),
  ADD COLUMN "stripeCustomerId" TEXT,
  ADD COLUMN "stripeSubscriptionId" TEXT;

CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");
