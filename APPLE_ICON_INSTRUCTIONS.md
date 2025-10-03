# iOS App Icon Setup Instructions

## Issue #1: Guideline 2.3.8 - App Icons Must Be Final (Not Placeholders)

Your Mansa Musa king image has been saved to `public/app-icon-source.png`.

## Required Steps to Fix:

### Option 1: Use AppIcon.co (RECOMMENDED - Easiest)
1. Go to https://www.appicon.co
2. Upload `public/app-icon-source.png`
3. Select "iOS" only
4. Click "Generate"
5. Download the generated icon set
6. After exporting to GitHub:
   - Extract the downloaded ZIP file
   - Navigate to `ios/App/App/Assets.xcassets/`
   - Replace the entire `AppIcon.appiconset` folder with the one from the download
   - Open the project in Xcode
   - Clean build folder (Product → Clean Build Folder)
   - Rebuild

### Option 2: Use Xcode Asset Catalog (Manual)
1. Export project to GitHub
2. Open the project in Xcode
3. Navigate to `ios/App/App/Assets.xcassets/AppIcon.appiconset`
4. Select "AppIcon" in the left sidebar
5. Drag and drop `public/app-icon-source.png` into each size slot:
   - 20pt (2x, 3x): 40x40, 60x60
   - 29pt (2x, 3x): 58x58, 87x87
   - 40pt (2x, 3x): 80x80, 120x120
   - 60pt (2x, 3x): 120x120, 180x180
   - 76pt (1x, 2x): 76x76, 152x152
   - 83.5pt (2x): 167x167
   - App Store: 1024x1024

### Option 3: Use Online Icon Generator
Other tools that work well:
- https://icon.kitchen
- https://easyappicon.com
- https://makeappicon.com

## Apple's Requirements for App Icons:
✅ Must be square (1:1 aspect ratio)
✅ Must have NO transparency
✅ Must be PNG format
✅ Must be consistent across all sizes
✅ Should be high quality and recognizable
✅ Cannot include Apple product images
✅ Cannot include religious symbols that might be offensive

## Your Icon Is:
✅ Regal Mansa Musa image with gold and purple
✅ Consistent with your brand theme
✅ Professional and recognizable
✅ Appropriate for all markets

## After Updating Icons:
1. Clean build in Xcode
2. Archive the app (Product → Archive)
3. Upload to App Store Connect
4. In your rejection response, mention:
   "We have replaced all placeholder icons with our final, custom-designed app icon featuring our brand's Mansa Musa logo. All icon sizes are now consistent and meet Apple's requirements."

## Verification:
Before resubmitting, verify:
- [ ] All icon slots in Xcode have the icon (no yellow warnings)
- [ ] Icons look good on device home screen
- [ ] Icons are recognizable at small sizes
- [ ] App Store icon (1024x1024) is set correctly
