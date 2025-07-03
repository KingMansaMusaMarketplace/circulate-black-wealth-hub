
# App Icons Guide for Mansa Musa Marketplace

## Required Icon Sizes for iOS App Store

### App Store
- **1024x1024** - App Store listing (PNG, no transparency, no rounded corners)

### iPhone
- **180x180** - iPhone App (iOS 14+)
- **120x120** - iPhone App (iOS 7-13) & iPhone Spotlight
- **87x87** - iPhone Settings (iOS 14+)
- **80x80** - iPhone Spotlight (iOS 7-13)
- **58x58** - iPhone Settings (iOS 7-13)
- **40x40** - iPhone Spotlight (iOS 7-10)
- **29x29** - iPhone Settings (iOS 5-6)
- **20x20** - iPhone Notification

### iPad
- **167x167** - iPad Pro App
- **152x152** - iPad App
- **76x76** - iPad App (iOS 7+)
- **40x40** - iPad Spotlight
- **29x29** - iPad Settings
- **20x20** - iPad Notification

## Design Guidelines

### Brand Colors (from your project)
- **Primary Blue:** #0F2876 (mansablue)
- **Primary Gold:** #DBA53A (mansagold)
- **Light Blue:** #19A7CE (mansablue-light)
- **Light Gold:** #F8E3A3 (mansagold-light)

### Icon Design Recommendations
1. **Background:** Use gradient from mansablue to mansablue-light
2. **Symbol:** Golden "M" or crown symbol representing Mansa Musa
3. **Style:** Modern, professional, easily recognizable at small sizes
4. **Text:** Avoid small text - focus on symbolic representation

### Tools for Creating Icons
- **Figma** (free) - Web-based design tool
- **Sketch** (Mac) - Professional design tool
- **Canva** (free/paid) - Template-based design
- **App Icon Generator** - Online tools to generate all sizes

## File Naming Convention
- AppIcon-1024.png (1024x1024)
- AppIcon-180.png (180x180)
- AppIcon-152.png (152x152)
- etc.

## Implementation Steps
1. Create master 1024x1024 icon
2. Generate all required sizes
3. Add to iOS project via Xcode
4. Test on device to ensure clarity at all sizes

## Next Steps
After creating icons:
1. Add to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Update Contents.json in Xcode
3. Build and test on device
