# New Build Instructions for App Store Resubmission

## All Issues Fixed ✅

1. ✅ Demo businesses labeled with "Sample Business" badges
2. ✅ Auth persistence fixed with Capacitor Preferences
3. ✅ Account deletion feature available in settings
4. ✅ IAP blocking on iOS (subscription/payment pages)
5. ✅ Native functionality (biometrics, geolocation, etc.)

## Build Steps

### 1. Install Dependencies
```bash
npm install
```
This installs the new `@capacitor/preferences` package needed for auth persistence.

### 2. Build Web Assets
```bash
npm run build
```

### 3. Sync to iOS
```bash
npx cap sync ios
```

### 4. Open Xcode
```bash
npx cap open ios
```

### 5. In Xcode
1. **Clean Build Folder**: Product → Clean Build Folder (Cmd+Shift+K)
2. **Archive**: Product → Archive
3. **Distribute App**: Follow the App Store distribution flow

### 6. Update Build Number
- Increment the build number in Xcode (e.g., from 1 to 2)
- Keep version as 1.0.0 unless making a version bump

## Testing Before Submission

### Critical Tests on iOS Device
- [ ] Login and verify session persists after navigating between pages
- [ ] Verify "Sample Business" badges appear on demo businesses
- [ ] Confirm subscription page shows "Full Access Included" (no purchase buttons)
- [ ] Test account deletion flow in Settings
- [ ] Test biometric authentication (if available on device)

### What to Tell Apple

In your App Store Connect response, mention:

```
We have addressed all issues from the rejection:

1. Demo Businesses (Guideline 2.1): All demo businesses now display a clear "Sample Business" badge to indicate they are for demonstration purposes.

2. IAP Compliance (Guideline 3.1.1): The iOS app no longer shows any payment or subscription purchase options. Business subscriptions and payments are handled outside the app per Apple's guidelines.

3. Authentication Bug (Guideline 2.1): Fixed session persistence issue by implementing Capacitor Preferences for secure storage on iOS devices. Users will no longer be prompted to login repeatedly.

4. Account Deletion (Guideline 5.1.1(v)): Account deletion feature is available in Settings → Delete Account.

5. Minimum Functionality (Guideline 4.2): The app includes native iOS functionality including biometric authentication (Face ID/Touch ID), geolocation services, haptic feedback, local notifications, and camera access for QR scanning.
```

## Notes

- Build number must be higher than previous submission
- Test on physical iOS device, not just simulator
- Verify all permissions are requested properly (Camera, Location)
- Check that splash screen and app icons display correctly
