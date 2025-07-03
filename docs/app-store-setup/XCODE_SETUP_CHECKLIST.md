
# Xcode Setup Checklist for App Store

## 1. Project Settings
- [ ] Bundle Identifier: `app.lovable.circulateblackwealthhub`
- [ ] Display Name: "Mansa Musa Marketplace"
- [ ] Version: 1.0.0
- [ ] Build Number: 1

## 2. Signing & Capabilities
- [ ] Apple Developer Team selected
- [ ] Automatically manage signing enabled
- [ ] Provisioning profile configured
- [ ] Required capabilities added:
  - [ ] Camera (for QR scanning)
  - [ ] Location Services (for nearby businesses)
  - [ ] Push Notifications (optional)

## 3. App Icons
- [ ] All required icon sizes added to Assets.xcassets
- [ ] Icons display correctly in simulator
- [ ] Icons tested on physical device

## 4. Launch Screen
- [ ] Launch screen configured (already done in capacitor.config.ts)
- [ ] Splash screen displays correctly
- [ ] Brand colors applied (#1B365D background, #F5A623 spinner)

## 5. Privacy Permissions
- [ ] Camera usage description: "This app needs access to camera to scan QR codes for loyalty rewards"
- [ ] Location usage description: "We need your location to show you businesses nearby and process QR code scans"

## 6. Build Settings
- [ ] Release configuration selected
- [ ] Minimum iOS version: 13.0 (recommended)
- [ ] Supported device orientations configured
- [ ] Architecture settings optimized

## 7. Testing Checklist
- [ ] App launches without crashing
- [ ] Camera permission request works
- [ ] Location permission request works
- [ ] QR scanner functions properly
- [ ] Business directory loads
- [ ] Authentication flow works
- [ ] No console errors in release build

## 8. Archive & Upload
- [ ] Archive created successfully
- [ ] Upload to App Store Connect completed
- [ ] Build appears in App Store Connect
- [ ] No processing errors

## Common Issues & Solutions

### Build Failures
- Check for TypeScript errors
- Verify all dependencies are installed
- Clean build folder (Product → Clean Build Folder)

### Signing Issues
- Verify Apple Developer account status
- Check provisioning profiles
- Ensure certificates are valid

### Permission Issues
- Verify usage descriptions in Info.plist
- Test permission requests on device
- Check capabilities in project settings
