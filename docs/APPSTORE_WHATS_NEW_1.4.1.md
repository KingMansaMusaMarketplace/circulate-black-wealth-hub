# App Store Connect — What's New in 1325.AI v1.4.1

## Release Notes (max 4,000 chars, public-facing)

**1325.AI — The Global Directory of Black-Owned Businesses**

Welcome to the new Front Door experience.

This update brings our latest web design to the iOS app, so the look, feel, and messaging you see on 1325.ai is now the same in your pocket.

What's new:
- Brand-new home experience centered on Kayla and the 42 Agentic AI Employees.
- Clearer path to discover, verify, and support Black-owned businesses across all 50 states.
- In-app subscription options for Essentials and Starter tiers, fully managed through Apple.
- Faster directory loading and improved navigation.
- The latest security, privacy, and performance improvements.

Thank you for supporting the mission.

---

## App Review Reply (private, for reviewer context)

Hello Apple Review Team,

Thank you for reviewing 1325.AI v1.4.1 (build 26).

This submission addresses the prior rejection feedback and aligns the app with our updated web experience:

1. **In-App Purchase compliance**: We now offer two subscription tiers through Apple IAP only:
   - Essentials Monthly — $19.99
   - Starter Monthly — $79.99
   These are configured as `PAID_SUBSCRIPTION` products in App Store Connect with the following IDs:
   - `com.mansamusa.essentials.monthly`
   - `com.mansamusa.starter.monthly`
   Higher tiers (Pro, Enterprise, etc.) are not sold inside the app and remain available only on the web at 1325.ai.

2. **Native differentiation**: The iOS app uses native Capacitor lifecycle hooks, haptic feedback, local/push notifications, and Apple StoreKit purchase flows. It is not simply a web wrapper.

3. **No payment routing outside StoreKit**: The app does not link to or complete payment for any subscription tier outside of Apple's IAP system for the two tiers listed above.

4. **Demo account**: A sandbox demo account is available with the credentials provided in the App Review Information section.

Please let us know if anything else is needed.

Best regards,  
1325.AI Team
