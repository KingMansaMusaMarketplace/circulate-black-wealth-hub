# App Review Business Model Response

## Copy-Paste Response for App Store Connect

Dear App Review Team,

Thank you for your inquiry regarding our business model. Please find detailed answers to your questions below:

### 1. Who are the users that will use the paid subscriptions in the app?

Our paid subscriptions are exclusively for:

**A) Business Owners** - Black-owned businesses that want to:
- List their business on the marketplace
- Access loyalty program features
- Receive customer analytics
- Get enhanced visibility

**B) Sponsors/Partners** - Organizations that want to:
- Support Black-owned businesses
- Gain community visibility
- Access partnership opportunities
- Contribute to economic empowerment initiatives

**Regular customers use the app completely free until January 2026** - they can discover businesses, earn loyalty points, and redeem rewards without any payment. This free customer access is funded by business subscription revenue.

### 2. Where can users purchase the subscriptions that can be accessed in the app?

**On iOS devices**: ALL subscriptions are purchased exclusively through Apple's In-App Purchase system. We have fully implemented StoreKit and comply with Apple's IAP requirements.

**On web**: Subscriptions are purchased through our website using Stripe payment processing.

**Important**: The iOS app does NOT contain any links to external payment methods, does NOT bypass Apple's IAP, and does NOT offer alternative payment options within the app.

### 3. What specific types of previously purchased subscriptions can a user access in the app?

Users can access the following subscription tiers based on their purchases:

**For Businesses:**
- **Basic Business ($29.99/month)**: Business listing, basic analytics, loyalty program
- **Premium Business ($79.99/month)**: Enhanced visibility, priority support, advanced analytics
- **Enterprise Business ($199.99/month)**: Multiple locations, custom branding, API access

**For Sponsors:**
- **Community Sponsor ($99.99/month)**: Community badge, basic visibility
- **Corporate Sponsor ($499.99/month)**: Premium placement, full analytics, partnership tools

All subscription status is verified server-side through our backend, which checks:
- Apple App Store purchase receipts (for iOS purchases)
- Stripe subscription status (for web purchases)

### 4. What paid content, subscriptions, or features are unlocked within your app that do not use in-app purchase?

**NONE on iOS**. Every paid feature accessible in the iOS app requires an active Apple In-App Purchase subscription.

On our web platform, users can subscribe via Stripe, but these are separate business-to-business services for marketplace listing and analytics - not digital content consumed on iOS.

The iOS app properly recognizes both purchase sources (Apple IAP and web Stripe) but only offers Apple IAP for new purchases within the app.

### 5. Are the enterprise services in your app sold to single users, consumers, or for family use?

Our subscriptions are **B2B (Business-to-Business) services** sold to:

- **Individual business owners** operating their own companies
- **Business managers** managing multiple locations for a parent company
- **Corporate sponsors** representing organizations

These are NOT consumer/family subscriptions. They are professional services that provide:
- Business listing and management tools
- Analytics dashboards
- Customer relationship features
- Marketing and visibility services

Each subscription is tied to a single business entity or sponsoring organization, not to individual consumers or families.

---

## Additional Context

Our app's mission is to create an economic ecosystem supporting Black-owned businesses. The free customer-facing features (business discovery, loyalty points) are funded by subscription revenue from businesses and sponsors.

**Revenue Model Summary:**
- Customers: 100% FREE until January 2026 (browse, loyalty points, rewards)
- Businesses: PAY for listing, analytics, visibility
- iOS: All payments through Apple IAP (30% to Apple)
- Web: Processed through Stripe for B2B services

**Customer Access:** All customer-facing features are free until at least January 2026. This allows us to build community adoption before considering any premium customer features. Business subscriptions fund the entire platform during this period.

We are fully committed to Apple's guidelines and have implemented proper IAP integration for all iOS purchases.

Please let us know if you need any additional clarification.

Best regards,
Mansa Musa Marketplace Team
