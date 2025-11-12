# App Store Connect Submission Text

## Copy and Paste This Into App Store Connect

### Demo Account Section

```
DEMO ACCOUNTS - FULL ACCESS PROVIDED

CUSTOMER ACCOUNT (Test Consumer Features):
Username: customer.demo@mansamusa.com
Password: CustomerDemo123!

BUSINESS ACCOUNT (Test Business Features):  
Username: demo@mansamusa.com
Password: Demo123!
```

### Review Notes Section

```
APPLE REVIEWER NOTES - IMPORTANT

Thank you for reviewing Mansa Musa Marketplace. We've addressed all previous concerns:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. DEMO ACCOUNTS (Guideline 2.1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We now provide TWO fully functional demo accounts:

CUSTOMER ACCOUNT:
• Email: customer.demo@mansamusa.com
• Password: CustomerDemo123!
• Access: Browse businesses, scan QR codes, earn points, leave reviews
• Pre-loaded: 750 loyalty points, favorite businesses

BUSINESS ACCOUNT:
• Email: demo@mansamusa.com
• Password: Demo123!
• Access: Complete business management, QR code generation, analytics
• Pre-loaded: 3 QR codes, 8 weeks analytics data, 4.8★ rating with reviews

Both accounts demonstrate the full app functionality without requiring any payment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. ACCOUNT DELETION (Guideline 5.1.1(v))
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Account deletion is now available in the app:
• Location: Settings → Account → Delete Account
• Process: User must type "DELETE" to confirm
• Action: Permanently deletes ALL user data including:
  - Profile and personal information
  - Reviews, ratings, and comments
  - Loyalty points and rewards
  - Subscriptions (if any)
  - All saved favorites and lists

This feature is available for ALL account types and complies fully with Apple's data deletion requirements.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. iOS PAYMENT COMPLIANCE (Guideline 3.1.1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We have completely removed ALL payment and subscription features from the iOS app:

WHAT'S HIDDEN ON iOS:
✗ All subscription pricing ($4.99/month, $29/month, etc.)
✗ All "Upgrade" or "Subscribe" buttons
✗ All Stripe payment UI and checkout flows
✗ All external payment links
✗ Business registration payment requirements
✗ Any mention of paid tiers or pricing

WHAT iOS USERS SEE:
✓ "Free Forever" for customer accounts
✓ "Free to Use" for business accounts
✓ Full app functionality without payment
✓ All features accessible without subscriptions
✓ No payment requirements for business registration

HOW WE IMPLEMENTED THIS:
• Platform detection using Capacitor
• All payment UI conditionally hidden on iOS
• All pricing text removed from iOS version
• Business registration works without payment on iOS
• Subscription features only available on web platform

RESULT: The iOS app is 100% functional with ZERO payment requirements or external payment references, fully complying with Apple's IAP guidelines.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. BUSINESS REGISTRATION (Guideline 3.1.1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Business registration on iOS:
• NO payment required
• NO subscription mentioned
• NO external payment links
• Full business features available
• Works completely free on iOS

Business owners can:
• Create complete business profile
• Generate unlimited QR codes
• Access analytics dashboard
• Manage customer reviews
• All features without payment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NATIVE iOS FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is NOT a simple web wrapper. Native features include:
• Native camera QR code scanning
• Push notifications for business updates
• Offline QR code generation and storage
• Location-based business discovery
• Native share functionality
• Haptic feedback on interactions
• Background app refresh for notifications

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TESTING CHECKLIST FOR REVIEWERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Customer Account Test (customer.demo@mansamusa.com):
□ Login successful
□ Browse business directory (100+ businesses)
□ Scan QR code (or tap test button)
□ View 750 loyalty points
□ Leave a review on any business
□ Save favorite businesses
□ NO payment prompts anywhere
□ NO subscription text visible

Business Account Test (demo@mansamusa.com):
□ Login successful
□ View complete business profile
□ See 3 pre-created QR codes
□ Access analytics dashboard (8 weeks data)
□ View customer reviews (4.8★ rating)
□ Generate new QR code
□ NO payment required
□ NO subscription prompts

Account Deletion Test (use either account):
□ Navigate to Settings → Account
□ Find "Delete Account" section
□ Click delete, type "DELETE"
□ Account permanently removed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISSION & IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mansa Musa Marketplace is a mission-driven platform focused on circulating Black wealth and empowering Black-owned businesses through technology. The platform combines:
• Business discovery and loyalty programs
• QR code-based customer engagement
• Community economic impact tracking
• Support for small business growth

We're committed to supporting the Black business community while maintaining full compliance with all Apple App Store guidelines.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have any questions or need additional information, please don't hesitate to contact us through App Review or at support@mansamusamarketplace.com

Thank you for your time and consideration.

The Mansa Musa Marketplace Team
```

---

## How to Submit

1. **Go to App Store Connect**
2. **Navigate to your app → TestFlight/App Store tab**
3. **Find the "App Review Information" section**
4. **Paste the Demo Account text into "Sign-In Required" section**
5. **Paste the Review Notes text into "Notes" section**
6. **Click Save**
7. **Submit for Review**

---

## Important Reminders

Before submitting:
- ✅ Test both demo accounts work
- ✅ Verify account deletion works
- ✅ Confirm NO payment UI shows on iOS device/simulator
- ✅ Test all native features work
- ✅ Check no console errors on iOS
- ✅ Screenshots don't show any pricing

---

**Last Updated:** November 2025
