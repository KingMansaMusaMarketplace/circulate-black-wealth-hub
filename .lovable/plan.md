# 🛡️ BOARD CHECK — Mansa Stays Launch Hardening (5 Workstreams)

This is a large, multi-area change (DB + payments + legal + identity + marketing copy). Per Boardroom Mode, here's the plan for your "go" before I touch any code.

---

## 1. Host Approval Gate (Admin must approve listings before public)

**What changes**
- New `listing_status` column on properties: `draft` → `pending_review` → `approved` → `rejected`
- New hosts submit → status = `pending_review`, hidden from `/stays` and `/stays-lease`
- Admin sees a "Pending Approval" tab in Mansa Stays Admin with Approve / Reject + reason
- Host gets an in-app + email notification on decision
- Public queries filter to `listing_status = 'approved'`

**Files touched**
- Migration: add column + backfill existing properties to `approved`
- `MansaStaysAdmin.tsx` — new Pending tab
- `vacation-rental-service.ts` + lease service — filter approved only on public reads
- New edge function `notify-listing-decision` for the email

---

## 2. Stripe Refund Automation (7-day lease fee refund)

**What changes**
- New edge function `process-lease-refunds` that runs daily (cron)
- Logic: for each `lease_agreements` row where tenant cancelled within 7 days AND `fee_charged_at` is set AND `fee_refunded_at` is null → call Stripe refund → write `fee_refunded_at`
- Admin dashboard shows refund status badge (Refunded / Pending / Expired)
- Manual "Refund now" button on Lease Agreements tab as a safety net

**Files touched**
- New `supabase/functions/process-lease-refunds/index.ts`
- DB: add `fee_refunded_at`, `cancelled_at`, `stripe_payment_intent_id` columns to `lease_agreements`
- Cron schedule via `pg_cron` extension
- Admin UI: refund status column + manual refund button

---

## 3. Legal Documents (Hosting Agreement, Tenant Terms, Photo Consent)

**What changes**
- 3 new public pages at `/legal/hosting-agreement`, `/legal/tenant-terms`, `/legal/photo-consent`
- Checkboxes added to:
  - Host onboarding (list a property) → must accept Hosting Agreement + Photo Consent
  - Lease application flow → must accept Tenant Terms
  - Vacation booking checkout → must accept Tenant Terms (short version)
- Acceptance recorded in DB (`legal_acceptances` table) with timestamp + IP + document version

**Files touched**
- 3 new pages with placeholder legal copy (⚠️ you'll need a lawyer to review before going live in production)
- Migration: `legal_acceptances` table
- Checkboxes in PropertyEditor, LeaseApplicationForm, BookingCheckout

---

## 4. Host ID Verification (Stripe Identity)

**What changes**
- "Verify your identity" button on host dashboard before they can publish a listing
- Calls Stripe Identity → opens verification session in modal
- Webhook `stripe-identity-webhook` writes result to `profiles.identity_verified_at`
- Host's listing cannot move to `pending_review` until verified
- Cost: ~$1.50 per verification (you pay Stripe)

**Files touched**
- New edge function `create-identity-session`
- New edge function `stripe-identity-webhook`
- Migration: add `identity_verified_at`, `identity_session_id` to profiles
- Host dashboard: verification CTA + status badge

---

## 5. Marketing Landing for /stays (SEO + Host Recruitment)

**What changes**
- Upgrade `/stays` hero with SEO meta tags (title, description, OG image, JSON-LD for `LodgingBusiness`)
- New "List Your Property" CTA → goes to `/stays/become-a-host` page
- New `/stays/become-a-host` page: value props, earnings calculator, "Apply to Host" form
- Footer link: "Hosts" → become-a-host page

**Files touched**
- `VacationRentalsPage.tsx` — meta tags + CTA
- New `BecomeHostPage.tsx`
- New `apply-to-host` form → writes to `host_applications` table
- Migration: `host_applications` table

---

## Technical Details

### Database changes (one migration)
- `properties` / `lease_listings`: add `listing_status` enum
- `lease_agreements`: add `fee_refunded_at`, `cancelled_at`, `stripe_payment_intent_id`
- `profiles`: add `identity_verified_at`, `identity_session_id`
- New tables: `legal_acceptances`, `host_applications`
- RLS: hosts see own data, admins see all, public reads filter by `listing_status = 'approved'`

### New edge functions (4)
- `notify-listing-decision` (email host on approve/reject)
- `process-lease-refunds` (daily cron, Stripe refund)
- `create-identity-session` (start Stripe Identity)
- `stripe-identity-webhook` (record result)

### Secrets needed (already set if Stripe is configured)
- `STRIPE_SECRET_KEY` ✅ (assumed present)
- `STRIPE_WEBHOOK_SECRET_IDENTITY` (new — you'll add after webhook is registered)
- `RESEND_API_KEY` (for email — confirm present)

---

## Suggested Build Order (so you can ship incrementally)

```text
Phase A (foundation, ~1 reply):
  1. Migration: all schema changes in one shot
  2. Host Approval Gate (admin tab + public filter)

Phase B (revenue safety, ~1 reply):
  3. Stripe Refund Automation + Identity Verification

Phase C (legal + marketing, ~1 reply):
  4. Legal pages + acceptance checkboxes
  5. Become-a-Host page + SEO
```

---

## ⚠️ What you must do (non-coding next steps)

1. **Get legal copy reviewed** — I'll use sensible placeholder text for Hosting Agreement / Tenant Terms / Photo Consent, but you need an attorney to bless them before paid public launch (especially since leases vary by state).
2. **Enable Stripe Identity** in your Stripe dashboard → Settings → Identity → Activate (~5 min).
3. **Add webhook endpoint** in Stripe dashboard after I deploy the function — I'll give you the exact URL.
4. **Decide on host approval SLA** — how fast will you commit to reviewing new listings? (24h? 48h?) I'll put this in the host-facing copy.

---

## Risks / Open Questions

- **Refund cron timing**: Stripe refunds can take 5–10 business days to land on the tenant's card. Want me to send an email when the refund is issued?
- **Identity verification cost**: At $1.50/host, 100 hosts = $150. Acceptable for soft launch?
- **Listing reject reasons**: Should rejection reasons be free-text or a fixed list (bad photos / incomplete info / suspicious / other)?

Reply **"go"** to build all 5 in the 3-phase order above, or tell me which phase to start with / what to change.