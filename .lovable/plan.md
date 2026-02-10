
# Fix Critical Production Gaps in Mansa Stays

Six targeted fixes to make Mansa Stays production-ready. Ordered by severity.

---

## Fix 1: Edge Function Pricing (Critical)

The `create-vacation-booking` edge function (line 117) calculates `nights * nightlyRate` only. A guest booking a monthly property at $2,500/mo for 30 nights would be charged 30 x $150 = $4,500 instead of $2,500.

**Change:** Mirror the frontend `calculatePricing()` logic in the edge function. The property already has `listing_mode`, `base_monthly_rate`, and `weekly_rate` columns from the recent migration.

**File:** `supabase/functions/create-vacation-booking/index.ts` (lines 110-123)

Replace the simple `nights * nightlyRate` calculation with:
- If nights >= 28 and property has `base_monthly_rate` and `listing_mode` is not `'nightly'`: use `ceil(nights/30) * monthly_rate`
- Else if nights >= 7 and property has `weekly_rate` and `listing_mode` is not `'nightly'`: use `ceil(nights/7) * weekly_rate`
- Else: use `nights * nightlyRate` (existing behavior)

Also update the Stripe line item description (line 187) to say "X months" or "X weeks" instead of always "X nights."

---

## Fix 2: Search Bar Query Bug (Critical)

**File:** `src/components/stays/PremiumPropertySearchBar.tsx` (line 52)

The location autocomplete queries `.eq('status', 'active')` but the column is `is_active` (boolean). This returns zero results.

**Change:** Replace `.eq('status', 'active')` with `.eq('is_active', true)`.

---

## Fix 3: Hardcoded Stripe Key

**File:** `src/pages/PropertyDetailPage.tsx` (line 50)

A test Stripe publishable key is hardcoded in the source code.

**Change:** Replace the hardcoded key with `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY` and add a fallback or warning if the env var is missing.

---

## Fix 4: Booking Widget Rate Display

**File:** `src/pages/PropertyDetailPage.tsx` (lines 394-399)

The booking card always shows `$X / night` regardless of listing mode.

**Change:** Dynamically show the appropriate rate based on `property.listing_mode`:
- `'monthly'` or `'both'` with monthly rate: show `$X / month`
- `'nightly'` or no monthly rate: show `$X / night` (existing)
- If mode is `'both'`, show both rates

---

## Fix 5: Featured Property Spotlight Rate Display

**File:** `src/components/stays/FeaturedPropertySpotlight.tsx` (line 118)

The badge hardcodes `${property.base_nightly_rate}/night`.

**Change:** Same dynamic logic as Fix 4 -- show monthly rate for monthly/both properties, nightly for nightly properties.

---

## Fix 6: Edge Function Line Item Labels

When a monthly booking is created, the Stripe Checkout line item still says "X nights". Update the product name in the checkout session to reflect the pricing mode (e.g., "Property Name - 1 month" or "Property Name - 2 weeks").

---

## Technical Summary

| # | File | Change | Severity |
|---|------|--------|----------|
| 1 | `supabase/functions/create-vacation-booking/index.ts` | Add monthly/weekly pricing logic | Critical |
| 2 | `src/components/stays/PremiumPropertySearchBar.tsx` | Fix `.eq('status','active')` to `.eq('is_active', true)` | Critical |
| 3 | `src/pages/PropertyDetailPage.tsx` | Use env var for Stripe key | Medium |
| 4 | `src/pages/PropertyDetailPage.tsx` | Dynamic rate display in booking widget | Medium |
| 5 | `src/components/stays/FeaturedPropertySpotlight.tsx` | Dynamic rate display in spotlight badge | Low |
| 6 | `supabase/functions/create-vacation-booking/index.ts` | Fix Stripe line item labels for monthly/weekly | Low |

All fixes are contained within these 4 files. The edge function will need redeployment after changes.
