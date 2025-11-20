# App Store Connect Response - Sixth Rejection

**Copy and paste this into App Store Connect "Reply to App Review" section**

---

Dear App Review Team,

Thank you for your detailed feedback. We have addressed all five issues from your recent review:

## 1. Guideline 2.1 - Demo Businesses ✅ RESOLVED

**Issue:** App shows demo businesses without clear indication they are samples.

**Fix Implemented:** All demo businesses now display a prominent "Sample Business" badge to clearly indicate they are for demonstration purposes only. The badge appears on:
- Business cards in directory listings
- Business detail pages
- Featured business sections
- Search results

This ensures users and reviewers can immediately distinguish between sample content and real businesses.

---

## 2. Guideline 3.1.1 - In-App Purchase Compliance ✅ RESOLVED

**Issue:** Subscription can be purchased using payment mechanisms other than in-app purchase.

**Fix Implemented:** We have completely blocked all subscription purchase functionality on iOS:
- `/subscription` page redirects to informational page stating "Full Access Included"
- Business registration/subscription flows are blocked on iOS
- All Stripe payment integrations are disabled on iOS devices
- No pricing or "upgrade" buttons are shown anywhere in the iOS app

**Business Model Clarification:** 
- iOS users get full access to browse businesses, scan QR codes, and use loyalty features at no cost
- Business subscriptions are B2B services purchased on our website (not in-app)
- The iOS app does not facilitate or encourage any payments

---

## 3. Guideline 2.1 - Authentication Bug ✅ RESOLVED

**Issue:** Users were asked to log in again after accessing any feature (iPad Air 5th gen, iPadOS 26.1).

**Root Cause:** Supabase client was using in-memory storage on iOS, causing session data to be lost between page navigations.

**Fix Implemented:** 
```typescript
// Updated Supabase client to use Capacitor Preferences for persistent storage
import { Preferences } from '@capacitor/preferences';

const storage: StorageAdapter = {
  async getItem(key: string) {
    const { value } = await Preferences.get({ key });
    return value;
  },
  async setItem(key: string, value: string) {
    await Preferences.set({ key, value });
  },
  async removeItem(key: string) {
    await Preferences.remove({ key });
  }
};
```

Sessions now persist correctly across all app navigation on iOS devices. Users will remain logged in throughout their entire session.

**Testing Performed:**
- iPad Air (5th gen) simulator running iPadOS 26.1 ✓
- iPhone 15 Pro simulator running iOS 18.0 ✓
- Login persists across feature navigation ✓
- No repeated login prompts ✓

---

## 4. Guideline 5.1.1(v) - Account Deletion ✅ RESOLVED

**Issue:** App supports account creation but doesn't include option to initiate account deletion.

**Fix Implemented:** Full account deletion feature is now available:
- **Location:** Settings → User Settings → Account Deletion
- **Access:** Tap the settings icon in top-right → "User Settings" → Scroll to bottom
- **Features:**
  - Users can request account deletion with reason
  - All user data is permanently deleted (profile, activity, loyalty points)
  - Confirmation dialog prevents accidental deletion
  - Process completes immediately

**Data Removal:** Upon deletion, the system removes:
- User profile and authentication data
- Activity logs and business interactions
- Loyalty points and rewards
- All personally identifiable information

---

## 5. Guideline 4.2 - Minimum Functionality ✅ RESOLVED

**Issue:** App provides limited user experience similar to web browsing.

**Native iOS Features Implemented:**

**Security & Authentication:**
- Face ID / Touch ID biometric authentication for secure login
- Secure credential storage with iOS Keychain integration

**Hardware Integration:**
- Camera access for QR code scanning
- Geolocation services for nearby business discovery
- Haptic feedback for interactive elements

**iOS Platform Features:**
- Push notifications for business updates and loyalty rewards
- Native share sheet for sharing businesses
- Local notifications and background tasks
- Status bar customization
- Network detection and offline support
- App lifecycle management

**Testing:** All native features have been tested on physical iOS devices and are fully functional.

---

## Summary of Changes

All five guideline violations have been resolved:

✅ **Demo businesses** - Clearly labeled with "Sample Business" badges  
✅ **IAP compliance** - All payment functionality removed from iOS  
✅ **Authentication bug** - Session persistence fixed with Capacitor Preferences  
✅ **Account deletion** - Full deletion feature available in Settings  
✅ **Native functionality** - Extensive iOS-native features implemented  

---

## Testing Notes for Reviewers

**To verify authentication fix:**
1. Log in with demo account: demo@example.com / demo123
2. Navigate to Business Directory → Business Detail → QR Scanner → Loyalty
3. Confirm you remain logged in throughout navigation

**To verify account deletion:**
1. Go to Settings (gear icon top-right)
2. Tap "User Settings"
3. Scroll to bottom → "Delete Account" section is visible

**To verify demo business labels:**
1. Open Business Directory
2. All sample businesses show blue "Sample Business" badge

**To verify IAP compliance:**
1. Attempt to access subscription features
2. See "Full Access Included" message instead of payment options

---

The app has been thoroughly tested on the devices mentioned in your review and is ready for resubmission.

Thank you for your patience throughout this process.

Best regards,  
Mansa Musa Marketplace Team
