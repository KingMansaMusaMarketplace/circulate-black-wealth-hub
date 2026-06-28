
# Stripe Subscription Audit

Plain-English read on what works today, what's broken right now, and what to harden before you let a real customer pay.

---

## 🚨 CRITICAL — broken yesterday by the security fix

Yesterday I moved 3 Stripe ID columns into private tables for security:
- `featured_placements.stripe_customer_id` → moved to `featured_placements_private`
- `featured_placements.stripe_subscription_id` → moved to `featured_placements_private`
- `job_postings.stripe_session_id` → moved to `job_postings_private`

**But 4 places in the code still try to write to the old columns.** Any customer who pays for a Featured Placement or a Job Posting today will be charged by Stripe but their listing **will NOT activate** (webhook write will silently fail). I missed this when I made the security change.

| File | Line | What breaks |
|---|---|---|
| `supabase/functions/stripe-webhook/index.ts` | 391-392 | Featured placement won't flip to `active` after payment |
| `supabase/functions/stripe-webhook/index.ts` | 446 | Job posting won't flip to `active` after payment |
| `supabase/functions/create-featured-placement-checkout/index.ts` | 85 | Pending featured-placement row insert errors |
| `supabase/functions/create-job-post-checkout/index.ts` | 101 | Pending job-posting update errors |

**Fix:** route those writes to the new `_private` tables (`featured_placements_private` keyed by `placement_id`, `job_postings_private` keyed by `job_id`). Subscription tiers (`kayla_*`, `business_*`, `corporate_*`) are **not affected** — those write to `subscribers` / `corporate_subscriptions`, which I did not touch.

---

## ⚠️ HIGH — Stripe webhook is not wired to all subscription tiers

The main `stripe-webhook` handles BHM, corporate, featured placements, verifications, job posts, and marketing top-ups. It does **NOT** insert a row into `subscribers` for Kayla / Business tier checkouts. Those tiers rely on `check-subscription` being called from the frontend after redirect to mark them subscribed.

**Risk:** if the redirect fails (closed tab, network blip, app crash, mobile back-button), the user paid but the app thinks they are not subscribed until the next time they log in and the periodic `check-subscription` runs. That's usually fine but not ideal.

**Fix:** add a `checkout.session.completed` branch that, when `metadata.tier` is a Kayla/Business tier, upserts into `subscribers` so the app knows immediately without waiting for the frontend.

---

## ⚠️ MEDIUM — webhook secret is single-purpose

You have one `STRIPE_WEBHOOK_SECRET` configured. Stripe lets you register multiple endpoints (live + test, plus the corporate one which uses `STRIPE_CORPORATE_WEBHOOK_SECRET`). 

**Action item for you (no code):** in the Stripe Dashboard → Developers → Webhooks, confirm:
1. There is exactly one endpoint pointed at `…/functions/v1/stripe-webhook` and its signing secret matches `STRIPE_WEBHOOK_SECRET`.
2. The corporate endpoint points at `…/functions/v1/stripe-webhook-corporate` and matches `STRIPE_CORPORATE_WEBHOOK_SECRET`.
3. The events selected include: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.payment_succeeded`.

---

## ✅ What's solid

- **Checkout creation** (`create-checkout`): input validation, rate limiting, CORS allowlist, hardcoded Kayla price-IDs, trial-day logic — all good.
- **Subscription check** (`check-subscription`): handles `active`, `trialing`, and surfaces `past_due` / `unpaid` / `canceled`. Auto-refresh on login and every minute is wired in `SubscriptionContext`.
- **Customer portal** (`customer-portal` + `create-portal-session`): standard Stripe Billing Portal flow — cancel, change card, upgrade/downgrade all work through Stripe's hosted UI.
- **Price IDs**: all 11 tier price IDs are stored as secrets, not hardcoded in client code (except Kayla, which is in the edge function — that's fine).
- **iOS in-app purchase split**: Kayla Essentials and Starter monthly go through Apple StoreKit on iOS native; everything else stays web. Already implemented per memory rule.

---

## 📋 Proposed fix order

1. **(critical)** Patch the 4 files above to use the new `_private` tables. No DB migration needed — tables already exist with proper RLS.
2. **(high)** Add a Kayla/Business `subscribers` upsert branch to `stripe-webhook` so paid tier activation doesn't depend on the user landing on `/payment-success`.
3. **(you do, no code)** Verify Stripe Dashboard webhook endpoints and events as listed above.
4. **(optional polish)** Add a one-time idempotency guard on webhook event IDs so retried webhooks don't double-write.

---

## Technical detail

The `_private` tables are keyed by `placement_id` / `job_id` referencing the parent row's `id`, with their own RLS scoped to the owner or admin. The patched writes will look like:

```
// Featured placement webhook
await supabaseClient.from('featured_placements_private').upsert({
  placement_id, owner_user_id, stripe_customer_id, stripe_subscription_id
}, { onConflict: 'placement_id' });

// Job posting webhook  
await supabaseClient.from('job_postings_private').upsert({
  job_id, poster_user_id, stripe_session_id
}, { onConflict: 'job_id' });
```

The matching `create-*-checkout` functions get the same treatment at creation time (insert/upsert into the private table after the parent row is created).
