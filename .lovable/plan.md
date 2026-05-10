# Three New Revenue Streams

Implementing the top 3 monetization opportunities from the audit. All three are net-new revenue surfaces that complement existing subscriptions and don't disturb consumer-free promises.

---

## 1. QR Transaction Fee (1% platform fee)

**What it does:** Every paid QR-loyalty transaction routed through `process-qr-transaction` already calculates a 7.5% commission. We will:
- Add a configurable `platform_fee_percentage` field on the businesses/subscriptions side (default 1%, overridable per tier — Pro/Enterprise get 0.5%).
- Persist each fee in `platform_transactions` (table already exists).
- Add an admin revenue widget at `/admin/revenue` showing total QR fees collected, count, MRR contribution.
- Surface "Platform fee: X%" transparently in `QRPaymentButton` so businesses see what's deducted.

**Files:**
- Edit `supabase/functions/process-qr-transaction/index.ts` — read fee % from business tier, default 1%.
- Edit `src/components/qr/QRPaymentButton.tsx` — show dynamic fee instead of hardcoded 7.5%.
- New `src/pages/admin/PlatformRevenuePage.tsx` — aggregated view of QR fees + transactions.

---

## 2. Featured Directory Placement

**What it does:** Paid promotion to pin a business at the top of category/city searches and on the spotlight carousel. $20–$200/mo tiers.

**DB migration:**
- New table `featured_placements` (business_id, tier, category, city, starts_at, ends_at, status, stripe_subscription_id, priority_score).
- RLS: businesses can read/insert their own; public read for active rows.
- Index on (category, city, status, ends_at).

**Edge functions:**
- New `create-featured-placement-checkout` — Stripe Checkout subscription for 4 tiers (Bronze $20, Silver $50, Gold $100, Platinum $200).
- Reuse existing stripe-webhook to activate/expire placements.

**UI:**
- New `src/pages/business/FeaturedPlacementPage.tsx` — tier selector, category/city scope, checkout.
- Edit directory sort logic (`src/utils/businessSorting` or wherever spotlight pulls) to give featured rows top priority with a "Featured" badge.
- Add "Promote your business" CTA on business dashboard.

---

## 3. Data & Insights API (institutional)

**What it does:** Tiered API for banks, foundations, CRA-compliant institutions to query anonymized circulation, demographic, and dollar-velocity data. Patent-protected ledger already exists.

**DB migration:**
- New table `api_clients` (org_name, contact_email, tier, monthly_quota, api_key_hash, status, created_at).
- New table `api_usage_logs` (client_id, endpoint, queried_at, response_ms, status_code).
- RLS: admin-only writes; clients identified via API key in edge function.

**Edge functions:**
- New `data-insights-api` — public endpoint, validates `Authorization: Bearer <api_key>`, enforces quota, returns anonymized aggregates:
  - `/circulation` — dollar velocity by city/category
  - `/demographics` — anonymized signup counts, no PII
  - `/business-density` — verified business counts by region
- New `provision-api-client` — admin-only, generates API key, hashes it, returns one-time plaintext.

**UI:**
- New `src/pages/InstitutionalAPIPage.tsx` — public marketing page with tiers ($99 Starter / $499 Pro / $999 Enterprise), "Request Access" form.
- New `src/pages/admin/APIClientsPage.tsx` — admin manages clients, sees usage.
- New `src/pages/developer/APIDocsPage.tsx` — endpoint docs, code samples.

---

## Order of execution

1. DB migrations (combined: `featured_placements`, `api_clients`, `api_usage_logs`).
2. QR fee tweak (smallest, fastest win).
3. Featured Placement (checkout + sort logic + UI).
4. Data API (edge functions + marketing page + admin + docs).

## Out of scope

- iOS native UI for any of these (per platform constraint, payment UI hidden on iOS).
- Refund / cancellation flows beyond Stripe defaults.
- Webhook automation for usage-based API overage billing (flat tiers only for v1).

Ready to build — confirm and I'll start with the migration.