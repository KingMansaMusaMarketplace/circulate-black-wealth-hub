# Self-Service Subscription Management

Two improvements to remove the biggest post-signup friction points for paid subscribers.

## 1. Stripe Customer Portal

The frontend already calls `supabase.functions.invoke('customer-portal', ...)` in `subscription-service.ts`, but the edge function was never created — so any "Manage Subscription" click currently 404s.

**Create `supabase/functions/customer-portal/index.ts`:**
- Authenticates the caller via Supabase JWT
- Looks up the Stripe customer by email
- Creates a `billingPortal.sessions` session with `return_url` → `/profile`
- Includes `x-csrf-token` in CORS headers (per project rule)
- Returns `{ url }` for the client to redirect to

This unlocks: cancel subscription, swap plan, update card, download invoices, view billing history — all handled by Stripe's hosted portal.

**Register in `supabase/config.toml`** so it deploys.

**Wire a "Manage Subscription" button** on the profile/subscription page that opens the portal URL in a new tab.

## 2. Payment-Failed / Trial-Ended Banner

Today, if Stripe fails to charge a card after a trial, the user silently loses access. We need to surface that.

**Extend `check-subscription` edge function** to also return:
- `status` — the raw Stripe sub status (`active`, `trialing`, `past_due`, `unpaid`, `canceled`, `incomplete`)
- `trial_end` — for "trial ends in N days" messaging

**Persist `status` to the `subscribers` table** (migration: add `status text` column).

**Update `SubscriptionContext`** to expose `status` and `trial_end`.

**Create `<SubscriptionAlertBanner />`** mounted in the authenticated layout. It shows a sticky top banner when:
- `status === 'past_due'` or `'unpaid'` → red: "Your payment failed. Update your card to keep access." → button opens Customer Portal
- `status === 'trialing'` and `trial_end < 3 days` → amber: "Your trial ends in N days." → button opens Customer Portal
- `status === 'canceled'` and `subscription_end > now` → blue: "Subscription canceled. Access ends [date]." → button to reactivate via Pricing

Hidden on iOS native (per existing payment-UI rule).

## Technical details

```text
Files created:
  supabase/functions/customer-portal/index.ts
  src/components/subscription/SubscriptionAlertBanner.tsx

Files edited:
  supabase/config.toml                              # register customer-portal
  supabase/functions/check-subscription/index.ts    # return status + trial_end, persist status
  src/contexts/SubscriptionContext.tsx              # expose status + trial_end
  src/App.tsx                                       # mount <SubscriptionAlertBanner />
  src/pages/SubscriptionPage.tsx (or ProfilePage)   # wire "Manage Subscription" button

Database migration:
  ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS status text;
  ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS trial_end timestamptz;
```

Approve to proceed.
