## Goal

On `/pricing`, catch buyers at peak intent by putting the signup form **right after** the pricing cards (which end with "All included, no hidden fees"), instead of making them scroll past the ROI calculator first.

## Current order on Pricing page

1. Founding Member Offer
2. **PricingSection** (ends with "All included, no hidden fees")
3. ROI Calculator
4. Signup section (form + benefits column)

## New order

1. Founding Member Offer
2. **PricingSection**
3. **Signup section** ← moved up
4. ROI Calculator ← now acts as reinforcement for anyone who scrolled past

## What changes

**File:** `src/pages/PricingPage.tsx` — swap the order of `<ROICalculator />` and the `<section ref={signupRef}>` block. No other files touched. No copy changes, no styling changes, no logic changes.

The `signupRef` / `scrollToSignup` wiring keeps working because it's a `ref`, not a position.

## Why this is safe

- Pure layout reorder on one page.
- Doesn't touch the homepage's $50 Black History Month quick-listing box (different offer, stays where it is).
- Doesn't affect iOS payment flow, Stripe, or any tier logic.
- No database, no edge functions, no auth changes.

## What you'll see after

Scrolling `/pricing` top-to-bottom: Founding offer → pricing cards → **signup form** → ROI calculator. Total scroll-to-form distance drops by roughly one full screen on desktop.

## Next step for you

Switch to **build mode** and I'll make the swap. Takes one edit.
