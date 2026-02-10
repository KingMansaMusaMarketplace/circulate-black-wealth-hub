
# Mansa Stays: Vacation + Monthly Rentals in One

## The Vision

Mansa Stays currently only supports nightly vacation rentals. By adding monthly rental support, you create a dual-market platform that covers both short-term travelers and long-term renters (relocating professionals, travel nurses, HBCU visitors on extended stays, etc.) -- all under one roof. This is a significant competitive advantage over both Airbnb (short-term focused) and FurnishedFinder (long-term only).

## What Changes

### 1. Database: New Columns on `vacation_properties`

Add three new columns to support monthly pricing:

- **`listing_mode`** (text, default `'nightly'`): Values are `'nightly'`, `'monthly'`, or `'both'`. Determines how the property is listed and searchable.
- **`base_monthly_rate`** (numeric, nullable): The monthly rental price (e.g., $2,500/month).
- **`weekly_rate`** (numeric, nullable): Optional weekly rate for mid-length stays.

This approach keeps everything in one table -- no data duplication, no new tables. A host simply toggles their listing mode and sets a monthly rate.

### 2. TypeScript Types Update

Update `VacationProperty`, `PropertySearchFilters`, and `PricingBreakdown` in `src/types/vacation-rental.ts`:

- Add `listing_mode`, `base_monthly_rate`, and `weekly_rate` to `VacationProperty`
- Add a `listingMode` filter to `PropertySearchFilters` (so guests can filter for "Monthly Rentals" vs "Nightly Stays" vs "All")
- Extend `PricingBreakdown` to handle monthly calculations

### 3. Pricing Logic Update

Update `calculatePricing()` in `src/lib/services/vacation-rental-service.ts`:

- If stay is 28+ nights and property has a monthly rate, automatically apply the monthly rate instead of nightly
- If stay is 7-27 nights and property has a weekly rate, apply the weekly rate
- Show the savings compared to nightly pricing in the breakdown

### 4. Search and Filter UI Updates

**Search bar** (`PremiumPropertySearchBar.tsx`): Add a stay type toggle (e.g., "Nightly" | "Monthly" | "All") so guests can find monthly rentals quickly.

**Filters panel** (`PropertyFiltersPanel.tsx`): Add a "Listing Type" filter section with the same options.

**Active filters bar** (`ActiveFiltersBar.tsx`): Show the active listing mode filter as a removable badge.

### 5. Property Card Updates

Update `PropertyCard.tsx` to show:
- Monthly rate when `listing_mode` is `'monthly'` or `'both'` (e.g., "$2,500/mo")
- Nightly rate for nightly listings (existing behavior)
- Both rates when mode is `'both'`

### 6. Host Property Form

Update the host listing form to include:
- A "Listing Mode" selector (Nightly, Monthly, or Both)
- Monthly rate input field (shown when mode is `'monthly'` or `'both'`)
- Optional weekly rate input
- Min/max nights auto-adjusts (monthly mode sets min_nights to 28)

### 7. Booking Flow

Update `useVacationBooking.ts` and the booking edge function:
- When booking a monthly rental, calculate using the monthly rate
- Adjust the PricingBreakdown display to show "1 month" or "X months" instead of nights
- Monthly bookings could optionally skip the cleaning fee (host configurable)

### 8. DB Mapper Update

Update `mapPropertyFromDB()` in the service file to include the new fields.

---

## Technical Details

### Migration SQL

```text
ALTER TABLE vacation_properties
  ADD COLUMN listing_mode text NOT NULL DEFAULT 'nightly'
    CHECK (listing_mode IN ('nightly', 'monthly', 'both')),
  ADD COLUMN base_monthly_rate numeric DEFAULT NULL,
  ADD COLUMN weekly_rate numeric DEFAULT NULL;
```

### Files to Modify

| File | Change |
|------|--------|
| New migration SQL | Add 3 columns to `vacation_properties` |
| `src/types/vacation-rental.ts` | Add new fields to types |
| `src/lib/services/vacation-rental-service.ts` | Update pricing logic, mapper, filters |
| `src/components/vacation-rentals/PropertyCard.tsx` | Show monthly/nightly rates |
| `src/components/vacation-rentals/PropertyFilters.tsx` | Add listing mode filter |
| `src/components/stays/PropertyFiltersPanel.tsx` | Add listing mode filter |
| `src/components/stays/PremiumPropertySearchBar.tsx` | Add stay type toggle |
| `src/components/stays/ActiveFiltersBar.tsx` | Handle new filter badge |
| `src/components/vacation-rentals/PricingBreakdown.tsx` | Show monthly pricing |
| `src/hooks/useVacationBooking.ts` | Handle monthly booking calculations |
| `src/integrations/supabase/types.ts` | Update generated types |
| Host listing form (if exists) | Add listing mode + monthly rate inputs |

### Pricing Logic

```text
if (nights >= 28 AND monthly_rate exists):
    total = ceil(nights / 30) * monthly_rate + fees
elif (nights >= 7 AND weekly_rate exists):
    total = ceil(nights / 7) * weekly_rate + fees
else:
    total = nights * nightly_rate + fees (existing)
```

This keeps the implementation lean -- one table, one booking flow, smart pricing that automatically gives guests the best rate.
