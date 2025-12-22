# App Store Resubmission Response - Guideline 2.1 Performance

**To:** Apple App Review Team  
**Re:** Mansa Musa Marketplace - Resubmission v1.1 Build 4 (Guideline 2.1 - Sign-In Error)  
**Date:** December 22, 2025  
**Build Version:** 1.1 (4)

---

## Dear App Review Team,

Thank you for your continued review. We have identified and fixed the sign-in error reported on iPad Air (5th generation) running iPadOS 26.2.

---

## Issue Addressed: Guideline 2.1 - Performance - App Completeness

**Previous Issue:**  
> "An error message appears when user attempts to sign in."  
> **Tested on:** iPad Air (5th generation) running iPadOS 26.2

---

## Root Cause Analysis

After investigating the sign-in flow, we identified that:
1. The Profile tab in the bottom navigation was pointing to `/dashboard/profile`
2. This route does not exist in the app - the correct route is `/user-profile`
3. After successful sign-in, users were redirected to a non-existent page, causing a 404 error

---

## Fix Implemented (Build 4)

### Navigation Route Correction
**Files Updated:**
- `src/components/mobile/BottomTabBar.tsx`
- `src/components/Layout.tsx`

**Change Made:**
- Profile tab navigation path changed from `/dashboard/profile` to `/user-profile`

**Before:**
```javascript
{ icon: User, label: 'Profile', path: '/dashboard/profile' }
```

**After:**
```javascript
{ icon: User, label: 'Profile', path: '/user-profile' }
```

---

## Testing Performed

Tested on:
- ✅ iPad Air (5th generation) - iPadOS 26.2 (Simulator)
- ✅ iPhone 17 Pro Max - iOS 26.2 (Simulator)
- ✅ Sign-in with email/password
- ✅ Profile navigation after sign-in
- ✅ Bottom tab bar navigation

**Result:** Sign-in completes successfully and users are navigated to the correct profile page without errors.

---

## What Reviewers Will Experience

1. **Sign In:** Tap Profile tab or sign-in button
2. **Enter Credentials:** Use demo account or create new account
3. **Success:** User is signed in and can access their profile
4. **Navigation:** All bottom tab bar links work correctly

**Demo Account:**
```
Email: testuser@example.com
Password: TestPass123!
```

---

## Summary of Changes in Build 4

| Issue | Fix |
|-------|-----|
| Sign-in error on iPad | Corrected Profile tab route from `/dashboard/profile` to `/user-profile` |
| Navigation after login | Users now reach the correct profile page |

---

## Confidence Level

This was a simple routing misconfiguration. The profile page exists and functions correctly at `/user-profile`. The fix ensures the navigation points to the correct route.

---

Thank you for your time and consideration.

**Contact Information:**  
Email: support@mansamusamarketplace.com

**Demo Account:**  
Email: testuser@example.com  
Password: TestPass123!
