# App Store Resubmission Guide - Critical Fixes

## Issues Fixed

### 1. Blank Page on iPad Launch (Guideline 2.1)
**Problem**: App was trying to load from external Lovable preview URL instead of local build files.

**Solution**: Removed `server.url` configuration from `capacitor.config.ts`. The production app now loads from the local `dist` folder.

**Steps to rebuild**:
```bash
# 1. Pull latest code
git pull

# 2. Install dependencies
npm install

# 3. Build production version
npm run build

# 4. Sync to native platforms
npx cap sync

# 5. Open in Xcode and test on iPad
npx cap open ios
```

**Important**: Test on iPad Air (5th generation) with iPadOS 26.0.1 or similar to verify the blank page is fixed.

### 2. Support URL (Guideline 1.5)
**Problem**: Support URL pointing to non-functional domain.

**Solution**: Support page exists at `/support` route and is fully functional.

**Required Action in App Store Connect**:
1. Go to App Store Connect → Your App → App Information
2. Update Support URL to your actual production domain:
   - If using custom domain: `https://yourdomain.com/support`
   - If using Lovable deployment: `https://[your-app].lovable.app/support`
3. The support page includes:
   - Email support: support@mansamusamarketplace.com
   - Phone support: 312.709.6006
   - Live chat availability
   - FAQs
   - Contact information

## Testing Checklist

Before resubmitting to App Store:

- [ ] Remove or comment out `server.url` in capacitor.config.ts
- [ ] Run `npm run build` to create production build
- [ ] Run `npx cap sync` to sync changes
- [ ] Test app launch on iPad Air or similar device
- [ ] Verify app loads correctly without blank screen
- [ ] Navigate to all main screens to ensure no blank pages
- [ ] Update Support URL in App Store Connect to production domain
- [ ] Verify support page is accessible at production domain/support
- [ ] Archive and submit new build through Xcode

## App Review Notes

Include this in your App Store Connect review notes:

```
RESOLVED ISSUES:

1. Blank Page on Launch (Guideline 2.1):
   - Fixed: Removed external URL configuration
   - App now loads from local build files
   - Tested on iPad Air (5th generation) - confirmed working

2. Support URL (Guideline 1.5):
   - Updated Support URL to: [INSERT YOUR PRODUCTION URL]/support
   - Support page includes email, phone, and live chat options
   - Full FAQ and contact information available

The app is now ready for review. All issues from previous submission have been resolved.
```

## Production Domain Setup

You need to determine your production domain:

**Option 1: Custom Domain**
- If you have a custom domain (mansamusamarketplace.com), deploy to it via Lovable
- Support URL: `https://mansamusamarketplace.com/support`

**Option 2: Lovable Domain**
- Use Lovable's free deployment domain
- Support URL: `https://[your-project].lovable.app/support`

**To deploy and get your production URL:**
1. Click "Publish" button in Lovable editor
2. Your app will be deployed to a lovable.app subdomain
3. Use that URL + `/support` as your Support URL in App Store Connect

## Critical Notes

⚠️ **PRODUCTION BUILDS MUST NOT USE DEVELOPMENT SERVER URL**
- The `server.url` in capacitor.config.ts is only for development
- Production builds MUST load from local files
- This is what was causing the blank page on iPad

✅ **After making these changes:**
1. Create a new archive in Xcode
2. Submit to App Store
3. Update Support URL in App Store Connect metadata
4. The app should pass both Guideline 2.1 and 1.5
