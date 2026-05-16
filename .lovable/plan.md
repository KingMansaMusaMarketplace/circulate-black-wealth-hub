
# Plan: Enable Stays + Rideshare Bookings on iOS (Stripe, 0% Apple fee)

## Goal
Unblock Stripe payment flows on iOS **only** for real-world services:
- **Noire Rideshare** (ride bookings)
- **Mansa Stays** (lodging bookings)

These are physical/real-world services, so per Apple Guideline 3.1.5(a) they MUST use Stripe (or any non-IAP processor) — Apple takes **0%**.

All other Stripe UI on iOS stays blocked (already in place from the prior IAP work).

## What I'll change (code only — small, ~3 files)

### 1. `src/utils/platform-utils.ts`
Add a new helper for "real-world service" payment flows that bypass the iOS block:

```ts
/**
 * Returns true if Stripe payment UI for a real-world service
 * (rideshare, lodging, etc.) should be ALLOWED on iOS.
 * Apple Guideline 3.1.5(a): physical goods/services use Stripe at 0% fee.
 */
export type RealWorldService = 'rideshare' | 'stays';

export const shouldAllowStripeForService = (service: RealWorldService): boolean => true;
```

Plus a small `<StripePaymentBlocker service="rideshare|stays">` pattern (see #2). The existing `shouldHideStripePayments()` stays unchanged so it still hides Stripe for everything else on iOS.

### 2. New component: `src/components/platform/RealWorldServiceGate.tsx`
Thin wrapper that always renders children (used to make the intent explicit at booking call sites — so future code reviewers see "this is a real-world service, iOS is allowed"). Optional but recommended for clarity.

### 3. Booking call sites — wrap the checkout buttons
Identified call sites to update so they bypass the iOS payment block:
- **Rideshare**: `src/pages/noir/BookRidePage.tsx`, `src/components/HomePage/NoirRideCTA.tsx`
- **Stays**: `src/pages/PropertyDetailPage.tsx`, `src/pages/GuestBookingsPage.tsx` (any "Book / Reserve / Pay" buttons currently wrapped in `IOSPaymentBlocker` or guarded by `shouldHideStripePayments()`)

For each: either unwrap `IOSPaymentBlocker` for that specific button, or wrap with `<RealWorldServiceGate service="...">`. I'll audit each file before editing to make sure I'm not unblocking subscription UI by mistake.

## What I will NOT touch
- Apple IAP for Essentials & Starter subscriptions (already working)
- Pro / Enterprise web-only flow (stays blocked on iOS)
- Subscription UI blockers anywhere else
- QR loyalty payments / corporate sponsorship checkout (stays blocked on iOS — those are digital and not in scope)
- Backend / edge functions (the Stripe booking edge functions already work — they don't care which platform calls them)

## App Store review note (for your submission)
> "Booking flows for Mansa Stays (lodging) and Noire Rideshare (transportation) use Stripe in compliance with Guideline 3.1.5(a), as they are real-world goods and services consumed outside the app. Digital subscription tiers (Essentials, Starter) use Apple In-App Purchase per Guideline 3.1.1."

## Open question (one)
**Do you want the iOS user to see the same exact booking UI as web** (same prices, same Stripe checkout redirect), or do you want a **slightly different mobile-optimized flow** (e.g. Apple Pay button via Stripe instead of card form)?

My recommendation: **same flow as web for now** — fastest to ship, Apple Pay can be added later as a Stripe payment method without code changes. Confirm and I'll implement.
