
## Plan: Add Founding Sponsor tier to /sponsor-pricing page

### What's wrong
The `/sponsor-pricing` page (`CorporateSponsorshipPricingPage.tsx`) still shows only **4 tiers** (Bronze/Silver/Gold/Platinum). When we updated pricing on Apr 17, we added the **Founding Sponsor — $1,750/mo** entry tier to `SponsorshipTiersSection.tsx` and to Stripe (price_id `price_1TNLUlAsptTW1mCm7rLwOuCq`), but the standalone `/sponsor-pricing` page was missed. That's the page the user is currently looking at.

### Changes

**1. `src/pages/CorporateSponsorshipPricingPage.tsx`**
- Widen the `tier` union type to include `'founding'`
- Prepend a new tier object to the `tiers` array:
  - **Founding Sponsor** — $1,750/month
  - Description: "Entry tier for regional brands building a community footprint"
  - Icon: `Star` (already imported), gradient `from-emerald-500 via-teal-500 to-cyan-600`
  - Features (matching `SponsorshipTiersSection.tsx` for consistency):
    - Logo in platform footer
    - Quarterly impact summary email
    - Social media mention (1x/quarter)
    - Founding Sponsor certificate
    - Newsletter inclusion
    - Locked rate for 12 months
  - CTA: "Become a Founding Sponsor"
- Use a different icon for **Bronze** (`Sparkles` → no, keep `Star` for Founding and swap Bronze icon to `Gem` or keep Star; recommend giving Founding `Star` and Bronze a distinct icon like `Award` to avoid duplication — minor visual touch)
- Update the existing 4-column grid to handle 5 cards: change `xl:grid-cols-4` → `xl:grid-cols-5` and tighten gap to `gap-5 lg:gap-6` so all 5 fit on desktop without crowding (viewport is 1833px wide, plenty of room)
- Update share text: "Choose from Founding, Bronze, Silver, Gold, or Platinum sponsorship tiers..."

**2. `supabase/functions/create-corporate-checkout/index.ts`**
- Add `founding` to the `priceIds` map: hardcode the live Stripe price ID `price_1TNLUlAsptTW1mCm7rLwOuCq` (already created), or read from `STRIPE_CORPORATE_FOUNDING_PRICE_ID` env var with the live ID as the fallback so checkout works immediately.
- Redeploy the function.

**3. `src/pages/CorporateSponsorshipPricingPage.tsx` SEO meta**
- Update meta description to mention "Founding, Bronze, Silver, Gold, or Platinum" tiers.

### Files
- **Edit:** `src/pages/CorporateSponsorshipPricingPage.tsx`
- **Edit + Deploy:** `supabase/functions/create-corporate-checkout/index.ts`

### Not changing
- `SponsorshipTiersSection.tsx` — already has all 5 tiers correctly.
- Memory file — already accurate.
- Stripe products — Founding Sponsor price already exists and is live.

### Result
The user reloads `/sponsor-pricing` and sees a 5-card row: **Founding $1,750 → Bronze $5k → Silver $15k → Gold $25k (Most Popular) → Platinum $50k**. Founding Sponsor checkout works end-to-end via the existing Stripe price.
