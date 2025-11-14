# App Store Connect Response - Third Rejection

**Copy and paste this into App Store Connect "Reply to App Review" section**

---

Dear App Review Team,

Thank you for your detailed feedback. We have addressed all three issues from the November 14, 2025 review:

## 1. Guideline 3.1.1 - In-App Purchase Compliance ✅ RESOLVED

We have **completely removed** all subscription, payment features, AND pricing information from the iOS app to ensure full compliance with Apple's IAP guidelines.

**Changes Implemented:**
- Removed all Stripe checkout flows from iOS
- Blocked subscription management pages on iOS (redirects to informational page)
- Blocked business registration flows on iOS (redirects to web)
- Removed ALL pricing text: no "$4.99/month", no "$10/month", no "$100/month" anywhere in iOS app
- No payment buttons, no subscription upgrade prompts, no external payment links

**How the App Works Now:**
- **Free Users (Customers):** Can browse Black-owned businesses, earn loyalty points, scan QR codes, and redeem rewards - 100% free, no payments required
- **Existing Business Subscribers:** Can log in and access all features (analytics, bookings, customer management) that they paid for via web
- **New Business Subscriptions:** Must be purchased at mansamusamarketplace.com via Stripe (not accessible on iOS)

**Business Model Clarification:**
Our subscriptions are B2B services (business marketplace listings and analytics tools), not digital content consumed on iOS. However, to ensure compliance, we have removed ALL subscription purchase capabilities AND pricing information from the iOS app per guideline 3.1.1.

---

## 2. Guideline 2.3.10 - Android References ✅ RESOLVED

We have removed all user-facing references to Android and Google Play from the app.

**Changes Made:**
- Removed "Google Play" billing reference from Privacy Policy
- Removed Android-specific instructions from Support page
- Removed "iOS/Android" text from Native Features Showcase page
- Updated help documentation to be iOS-only
- App now presents as iOS-native with no competing platform mentions

**Note:** Technical platform detection code remains for functionality but is not visible to users.

---

## 3. Guideline 2.1 - Search Field Bug ✅ RESOLVED

We identified and fixed the placeholder text visibility issue on iPad Air (5th generation).

**Root Cause:** iOS Safari on iPad was not rendering placeholder text in search input fields.

**Fix Applied:** Added iOS-specific CSS property (`WebkitTextFillColor: inherit`) to all search input components.

**Pages Fixed:**
- Business Directory search (primary page tested by reviewers)
- Business Discovery page
- Feature Guide search
- Help Center search
- All other search implementations

**Testing Performed:**
- iPad Air (5th gen) simulator running iPadOS 26.1 ✓
- iPhone 13 mini simulator running iOS 26.1 ✓
- Physical device testing completed ✓
- Placeholder text now fully visible when typing

---

## Summary

All three guideline violations have been resolved:
- ✅ No IAP violations - all payments AND pricing removed from iOS
- ✅ No Android references - iOS-only experience
- ✅ Search field works - placeholder text visible on iPad

The app has been thoroughly tested on the exact devices mentioned in your review (iPad Air 5th gen, iPadOS 26.1) and is ready for resubmission.

Thank you for your patience and guidance through this process.

Best regards,
Mansa Musa Marketplace Team

---

**Testing Notes for Reviewers:**
- To test search: Go to Business Directory page → Type in search field → Text should be visible
- To verify iOS blocking: Try accessing /subscription → Should show "Feature Not Available on iOS" page
- To test free features: Browse businesses, tap QR scanner, check loyalty page → All should work without payment prompts
