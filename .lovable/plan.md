# Plan: New iOS Build with Apple In-App Purchases Enabled

## Goal
Ship a new build to App Store Connect where iOS users can subscribe **inside the app** via Apple In-App Purchase (IAP). Apple takes their 15–30% cut. This replaces the current behavior, which hides all payment UI on iOS and tells users to subscribe at 1325.ai.

## What's already in place (good news)
- `src/lib/services/apple-iap-service.ts` — full Apple IAP service using `cordova-plugin-purchase`, with server-side receipt validation via the `validate-apple-receipt` edge function. Already wired for two products:
  - `com.mansamusa.essentials.monthly` ($19/mo)
  - `com.mansamusa.starter.monthly` ($79/mo)
- `useSubscriptionActions.ts` already routes iOS purchases through `appleIAPService.purchase(...)` for those two tiers.
- Pro / Enterprise are intentionally web-only and show a "Subscribe at 1325.ai" notice on iOS.

## What needs to change

### 1. Flip the iOS payment block OFF (code)
- **`src/utils/platform-utils.ts`** → `shouldHideStripePayments()` currently returns `true` on iOS. Update so that:
  - For tiers sold via Apple IAP (Essentials, Starter) → payment UI is **shown** on iOS (so the Apple IAP purchase button appears).
  - For web-only tiers (Pro, Enterprise) → still show the "Subscribe at 1325.ai" notice (Apple does not allow linking out, but a plain-text mention is compliant).
- **`src/components/platform/IOSPaymentBlocker.tsx`** → make it tier-aware so it only blocks the web-only tiers, not the IAP tiers.
- **`src/hooks/useCorporateCheckout.ts`** → leave blocked (corporate Stripe checkout stays web-only).

### 2. App Store Connect setup (you, manual — outside code)
Before the build is useful, the two products **must exist and be in "Ready to Submit" state** in App Store Connect → My Apps → Subscriptions:
- Create subscription group "Mansa Musa Subscriptions" (if not already)
- Product 1: `com.mansamusa.essentials.monthly` — $19.99/mo (closest Apple price tier to $19)
- Product 2: `com.mansamusa.starter.monthly` — $79.99/mo
- Add localized display name, description, and one promotional screenshot per product
- Sign the **Paid Apps Agreement** in App Store Connect → Agreements (required before IAP works at all)
- Add banking + tax info

### 3. Xcode capability (you, manual)
- Open Xcode → App target → Signing & Capabilities → **+ Capability → In-App Purchase**
- This adds an entitlement; commit the updated `App.entitlements`.

### 4. Build & submit
- Run `scripts/clean-rebuild-ios.sh` (already exists — installs deps, builds web, syncs iOS)
- Increment build number in Xcode
- Archive → Upload to App Store Connect
- In the review notes, tell Apple:
  > "This build enables In-App Purchase for monthly subscriptions (Essentials $19.99, Starter $79.99). Higher business tiers (Pro, Enterprise) remain web-only as they are sold to businesses, not consumers, per guideline 3.1.3(b) Multiplatform Services."

## Technical details (for the implementer)

```text
Files to edit:
 src/utils/platform-utils.ts        ← add isAppleIAPTier(tier) helper, narrow shouldHideStripePayments
 src/components/platform/IOSPaymentBlocker.tsx  ← accept a `tier` prop, only block web-only tiers
 (call sites of IOSPaymentBlocker)  ← pass the tier prop where known

No backend changes — validate-apple-receipt edge function already exists.
No new packages — cordova-plugin-purchase is already installed.
```

## What I will NOT touch
- Stripe web checkout (untouched — still works at 1325.ai)
- Pro / Enterprise tier flow (still web-only)
- The Apple IAP service itself (already correct)

## Open questions for you

1. **Pricing confirmation** — Apple's price tiers don't include exact $19 or $79. Closest are $19.99 and $79.99. OK to use those, or do you want a different tier?
2. **Do you also want Pro available via IAP?** Today only Essentials + Starter are IAP. Adding Pro would mean creating a 3rd App Store product and giving Apple 15–30% of that revenue too. My recommendation: **keep Pro web-only** (it's a business tier, qualifies for guideline 3.1.3(b)).
3. **Have you already signed the Paid Apps Agreement** in App Store Connect? If not, that's blocker #1 — nothing IAP-related works until it's signed.

Once you confirm, I'll make the code changes (small, ~2 files) and you handle the App Store Connect + Xcode steps in parallel.
