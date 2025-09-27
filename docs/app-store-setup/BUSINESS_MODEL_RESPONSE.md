# Business Model Response for Apple App Review

## Response to Guideline 2.1 - Information Needed

### App Review Team Questions & Responses

#### 1. Who are the users that will use the paid subscriptions in the app?

**Answer:** The paid subscriptions are used by two distinct user groups:

- **Business Owners**: Local Black-owned businesses who subscribe to list their businesses, manage QR codes, access analytics, and participate in the loyalty network
- **Sponsors/Partners**: Companies and organizations that sponsor community events, provide rewards, and support the Black business ecosystem through partnership subscriptions

Regular customers (individuals who scan QR codes and earn loyalty points) use the app completely free and never make any purchases through the app.

#### 2. Where can users purchase the subscriptions that can be accessed in the app?

**Answer:** All subscription purchases are handled through:

- **Apple App Store In-App Purchases** (for iOS users) - using StoreKit
- **External website billing** (https://mansamusamarketplace.com/subscriptions) for web users and business account management
- **Stripe payment processing** for web-based subscriptions with proper subscription management

No third-party payment systems are used within the iOS app. All iOS subscription purchases flow through Apple's In-App Purchase system according to App Store guidelines.

#### 3. What specific types of previously purchased subscriptions can a user access in the app?

**Answer:** Users can access the following subscription tiers purchased through proper channels:

**Business Subscriptions:**
- **Basic Business Plan** ($29.99/month): Business listing, basic QR codes, customer analytics
- **Premium Business Plan** ($79.99/month): Advanced QR codes, detailed analytics, priority support, marketing tools
- **Enterprise Business Plan** ($199.99/month): Multi-location support, API access, custom integrations

**Sponsor Subscriptions:**
- **Community Sponsor** ($99.99/month): Event sponsorship, community rewards program
- **Corporate Partner** ($299.99/month): Brand integration, sponsored rewards, promotional opportunities

All subscriptions provide access to their respective features within the app and are validated through secure server-side authentication.

#### 4. What paid content, subscriptions, or features are unlocked within your app that do not use in-app purchase?

**Answer:** **None.** All paid features accessible within the iOS app use Apple's In-App Purchase system exclusively.

The following clarifications apply:
- Business accounts created on our website can log into the app to manage their existing subscriptions
- No new subscriptions can be purchased within the app except through Apple IAP
- Web-based subscription management is separate and does not bypass App Store requirements
- Customer loyalty points and rewards are free features funded by business subscriptions

### Revenue Model Summary

Our revenue comes exclusively from business and sponsor subscriptions. The app serves as a bridge connecting:
- **Free Users**: Customers earning loyalty points at local businesses
- **Paying Subscribers**: Businesses and sponsors who pay for premium features and visibility

This creates a sustainable ecosystem where businesses pay to reach customers, while customers get free access to deals and rewards.

### Compliance Statement

This app fully complies with App Store guidelines by:
- Using only Apple IAP for iOS subscription purchases
- Not offering alternative payment methods within the app
- Properly managing subscription states and entitlements
- Providing clear subscription terms and cancellation policies

All business logic and payment processing follows Apple's recommended practices for subscription-based apps.