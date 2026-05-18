# Mansa Stays — Yearly Leasing (v1)

## Confirmed decisions

- **Fee:** Flat **$99** per successful lease
- **Who pays:** **Landlord pays** (charged on tenant confirmation)
- **Trigger:** Both landlord + tenant confirm the lease in-app
- **Refund window:** **7 days, no questions asked.** After day 7, fee is final.
- **Pro-manager onboarding:** Self-serve **CSV import** (12-column template + AI cleanup)
- **Tech scope:** Nationwide
- **Marketing focus:** **Chicago + Atlanta** for first 90 days
- **Legal posture:** Listing platform only — no lease signing, no escrow, no deposit handling, Fair Housing Act compliant

---

## What gets built

### 1. Database (one migration)
Extend `vacation_properties` with lease fields:
- `listing_mode` adds `'yearly_lease'`
- `monthly_rent`, `lease_term_months` (default 12), `security_deposit_amount`, `pet_deposit`, `utilities_included` (text[]), `section_8_accepted` (bool), `min_credit_score`, `min_income_multiplier` (e.g. 3x), `available_from` (date), `furnished` (bool)

New tables:
- `lease_inquiries` — tenant interest, contact, move-in date, message
- `lease_agreements` — links property + landlord + tenant, status (`pending_landlord_confirm`, `pending_tenant_confirm`, `confirmed`, `cancelled`, `refunded`), `confirmed_at`, `fee_charged_at`, `refund_eligible_until` (confirmed_at + 7 days), `stripe_payment_intent_id`
- `lease_fee_refunds` — audit trail

RLS: landlords see their own, tenants see their own, admins see all.

### 2. Edge functions
- `charge-lease-success-fee` — Stripe Checkout, $99 one-time, landlord pays, fires when both parties confirm
- `refund-lease-fee` — full refund if within 7-day window
- `import-lease-listings-csv` — pro-manager bulk upload, AI cleanup of messy rows

### 3. Pages & UI
- `/stays/lease` — search page with filters (beds, rent range, city, pets, Section 8, move-in date, furnished)
- `/stays/lease/:id` — lease listing detail (separate template from nightly — shows monthly rent, term, deposit, screening criteria)
- `/stays/host/lease/new` — create lease listing wizard (separate from nightly wizard, includes Fair Housing disclosures)
- `/stays/host/lease/import` — pro-manager CSV import with template download + AI cleanup
- `/stays/host/lease/:id/confirm-lease` — landlord clicks "I leased to [tenant name]"
- `/stays/tenant/confirm-lease/:token` — tenant clicks email/SMS link to confirm
- Host dashboard: new "Lease Listings" tab + lease pipeline (inquiries → confirmed leases)
- Refund button visible to landlord during 7-day window

### 4. Legal & compliance copy
- "Mansa Stays is a listing platform, not a real estate broker" footer on every lease page
- Fair Housing Act statement on listing form (no filters by race, religion, family status, etc.)
- "We don't handle lease signing, escrow, or security deposits" disclosure on landlord checkout
- 7-day refund policy clearly stated before $99 charge
- Section 8 toggle (source-of-income discrimination is illegal in many states)

### 5. Marketing surface (Chicago + Atlanta launch)
- Geo-detect: Chicago and Atlanta visitors see "Now live in your city" hero on `/stays/lease`
- SEO landing pages: `/stays/lease/chicago`, `/stays/lease/atlanta` (+ neighborhood pages for top 10 in each)
- Other cities show "Coming soon — list your property now" (still accept listings nationwide)

---

## What you'll need to do

1. Approve this plan — I'll then create the database migration (you'll see one approval prompt for SQL)
2. Confirm the **$99 lease fee Stripe product** should be created (I'll do it via tool, no action needed from you)
3. After launch: provide Chicago + Atlanta neighborhood lists for SEO pages (optional, I can seed defaults)

---

## What v1 explicitly does NOT include

- ❌ Lease signing / e-signature (use DocuSign separately)
- ❌ Tenant background checks (link out to TransUnion SmartMove or similar)
- ❌ Rent collection / escrow
- ❌ Yardi/AppFolio integration (CSV only until 5+ pro managers ask)
- ❌ Featured/boosted listings (Phase 2 once 500+ listings exist)
- ❌ Tenant-side fees

---

Reply **"go"** to start the migration, or tell me what to change.