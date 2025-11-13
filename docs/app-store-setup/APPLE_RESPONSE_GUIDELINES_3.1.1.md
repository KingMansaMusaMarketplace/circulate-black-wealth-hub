# Response to Apple Review - Guideline 3.1.1 Issues

## Issue 1: Business Registration (Guideline 3.1.1)

**Apple's Concern:**
> "The app includes an account registration feature for businesses and organizations, which is considered access to external mechanisms for purchases or subscriptions to be used in the app."

### Our Response:

Dear Apple Review Team,

Thank you for your feedback. We have made the following changes to address Guideline 3.1.1:

**Changes Implemented:**

1. **Business Registration Removed from iOS App:**
   - Business registration is now completely hidden on the iOS version of the app
   - The account type selector in the signup form only shows "Customer" option on iOS
   - All business signup links and routes redirect to an informational page on iOS
   - Users attempting to access business features on iOS are redirected to our website

2. **No In-App Purchases or External Payment Links:**
   - Our app is a **free loyalty rewards platform** that connects customers with local Black-owned businesses
   - Business registration is FREE on our website (not a paid feature)
   - There are no in-app purchases, subscriptions, or payment mechanisms in the app
   - Customers use the app to scan QR codes at physical businesses and earn loyalty rewards - completely free

3. **Clarification on Business Registration:**
   - Business registration is an administrative process on our website (mansamusamarketplace.com)
   - It is NOT a paid service or subscription
   - It does not involve any financial transactions
   - Businesses register on our website to list their business in the directory and generate QR codes
   - This is similar to how restaurants register on Yelp or Google Business - it's free listing

**Technical Implementation:**
- iOS detection using Capacitor: `platform === 'ios'`
- Routes protected with `IOSProtectedRoute` component
- Business signup redirects to `/ios-blocked` page explaining feature is available on web
- Auth form automatically hides business account option on iOS

**Testing:**
You can verify this by:
1. Attempting to access `/business-signup` on iOS → redirects to blocked page
2. Creating a new account on iOS → only "Customer" account type is available
3. All footer and navigation links to business signup are hidden on iOS

---

## Issue 2: Subscription/Payment UI (Guideline 3.1.1 - First)

**Apple's Concern:**
> "Your app accesses digital content purchased outside the app, such as subscriptions, but that content isn't available to purchase using in-app purchase."

### Our Response:

Dear Apple Review Team,

**Important Clarification:**

Our app **does NOT have any subscriptions or paid digital content**. We believe there may have been a misunderstanding. Here's what our app actually does:

1. **No Subscriptions:**
   - The app is completely FREE for customers
   - There are NO subscription tiers, premium features, or paid content
   - All features are available to all users at no cost

2. **What the App Does:**
   - Customers scan QR codes at participating Black-owned businesses
   - They earn loyalty points and rewards
   - They can browse the business directory
   - All features are 100% free for customers

3. **Business Listings:**
   - Businesses register on our website (free of charge)
   - They get listed in the directory and can generate QR codes
   - This is NOT a subscription or paid service
   - It's a free business listing platform

4. **Changes Made to iOS App:**
   - We have hidden ALL business registration features on iOS
   - We have hidden ALL subscription-related UI/routes on iOS (if any were present)
   - The iOS app is now ONLY for customers to scan QR codes and earn rewards

**We respectfully request clarification** on which specific content or UI element appeared to be a subscription or external payment. We can provide screenshots or further explanations if needed.

---

## Summary of All Changes

✅ **Account Deletion Feature Added** (Guideline 5.1.1)
- Users can delete their account from Settings → Account
- Permanent deletion of all user data
- Confirmation dialog to prevent accidental deletion

✅ **Business Registration Hidden on iOS** (Guideline 3.1.1)
- Business signup completely removed from iOS app
- Routes protected and redirect to info page
- Only customer accounts can be created on iOS

✅ **No Subscriptions or Payments** (Guideline 3.1.1)
- App is completely free for customers
- No in-app purchases or external payment links
- Subscription pages hidden on iOS (if any existed)

---

## Demo Accounts (Updated)

**Customer Account:**
- Email: customer.demo@mansamusa.com
- Password: CustomerDemo123!

**Business Account (Web Only - Not accessible on iOS):**
- Email: demo@mansamusa.com
- Password: Demo123!

The business account can only be accessed via our website, not through the iOS app.

---

## Request for Guidance

If Apple reviewers still see subscription or payment-related content in the app, we kindly request specific details about:
1. Which screen or feature appears to be subscription-related
2. What specific UI elements need to be removed
3. Screenshots or examples of the concerning content

We are committed to full compliance with App Store guidelines and will immediately address any remaining issues.

Thank you for your patience and guidance.

Best regards,
Mansa Musa Marketplace Team
