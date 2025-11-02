# iPad Screenshot Guide - Native Resolution

## Required iPad Screenshot Sizes

### iPad Pro 12.9" (6th Gen)
- **Resolution:** 2048 x 2732 pixels
- **Aspect Ratio:** 3:4
- **Device:** iPad Pro 12.9" (2022)

### iPad Pro 12.9" (2nd Gen)  
- **Resolution:** 2048 x 2732 pixels
- **Aspect Ratio:** 3:4
- **Device:** iPad Pro 12.9" (2017)

## Important: Native iPad Screenshots Only

❌ **DO NOT:**
- Stretch iPhone screenshots to iPad size
- Use generic mockups
- Resize iPhone layouts

✅ **DO:**
- Use actual iPad simulator or device
- Show iPad-optimized layouts
- Capture at native 2048x2732 resolution
- Display iPad-specific features (split view, multi-column)

## Recommended Screenshots (5 total)

### Screenshot 1: Home/Discovery
**Title:** "Discover Black-Owned Businesses"
- Show iPad's side-by-side layout
- Featured businesses in multi-column grid
- Large hero section with search
- iPad-optimized spacing

### Screenshot 2: Interactive Map
**Title:** "Find Businesses Near You"
- Full-screen map view
- Business markers
- Location details sidebar
- iPad's large screen advantage

### Screenshot 3: Business Directory
**Title:** "Browse Complete Directory"
- Multi-column grid layout (3-4 columns)
- Category filters visible
- Search bar prominent
- iPad-optimized card sizes

### Screenshot 4: Business Profile
**Title:** "Detailed Business Information"
- Split view layout
- Business details on left
- Reviews/photos on right
- iPad-specific two-column design

### Screenshot 5: QR Scanner & Dashboard
**Title:** "Earn Rewards, Track Impact"
- Full-screen QR scanner interface
- Loyalty points dashboard
- Transaction history
- iPad-optimized stats display

## How to Capture iPad Screenshots

### Option 1: iPad Simulator (Recommended)

```bash
# Open Xcode
# Navigate to: Xcode > Open Developer Tool > Simulator

# Select Device:
# Hardware > Device > iPad Pro 12.9" (6th generation)

# Run your app in simulator
# Navigate to desired screen

# Capture screenshot:
# File > New Screen Shot (Cmd + S)
# Or use: xcrun simctl io booted screenshot screenshot.png

# Screenshots saved to Desktop at 2048x2732 automatically
```

### Option 2: Physical iPad Device

1. Connect iPad Pro 12.9" via USB
2. Open Xcode > Window > Devices and Simulators
3. Select your iPad
4. Click "Take Screenshot" button
5. Screenshots saved at native resolution

### Option 3: Browser DevTools (For Web View)

```javascript
// Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Cmd + Shift + M)
3. Select "iPad Pro 12.9" 
4. Set resolution: 2048 x 2732
5. Capture screenshot: Cmd + Shift + P > "Capture screenshot"
```

## Design Requirements

### Layout Optimization
- Use iPad's 2048px width for multi-column layouts
- Increase padding and spacing for tablet
- Show more content per screen
- Utilize side-by-side views

### Text Overlays
- Clear, readable fonts (min 32pt for iPad)
- High contrast text
- Consistent brand colors (#0F2876 blue, #DBA53A gold)
- Maximum 2 lines of text per overlay

### Device Frames
- Use official Apple iPad Pro frames
- Maintain aspect ratio
- No distortion or stretching
- Professional appearance

## Verification Checklist

Before uploading to App Store Connect:

- [ ] All screenshots are 2048 x 2732 pixels
- [ ] Screenshots show native iPad interface
- [ ] Layouts are iPad-optimized (not stretched iPhone)
- [ ] Text is readable at iPad size
- [ ] Brand colors consistent
- [ ] Device frames are correct iPad Pro models
- [ ] All 5 required screenshots included
- [ ] No pricing information visible (if using screenshot mode)

## Common Mistakes to Avoid

❌ **Stretching iPhone Screenshots**
- Apple will reject stretched images
- Always use native iPad layouts

❌ **Wrong Resolution**
- Must be exactly 2048 x 2732 pixels
- No other sizes accepted for 12.9" iPad

❌ **Generic Mockups**
- Must show actual app interface
- No marketing materials that don't reflect actual UI

❌ **Login Screens Only**
- Show app in use with real functionality
- Login screens don't demonstrate value

## Tools

### Screenshot Capture
- **Xcode Simulator** - Native resolution, automatic
- **Physical iPad** - Most accurate representation
- **Browser DevTools** - Quick for web-based testing

### Editing & Frames
- **Figma** - Professional editing and device frames
- **Sketch** - Design and frame mockups  
- **Screenshot Pro** - Add overlays and text
- **Apple Design Resources** - Official device templates

## App Store Connect Upload

1. Login to App Store Connect
2. Go to: App > Version > App Store > iPad Screenshots
3. Click "View All Sizes in Media Manager"
4. Select "iPad Pro (6th Gen) 12.9 Display"
5. Upload all 5 screenshots at 2048x2732px
6. Add captions for each screenshot
7. Save changes

## Support

If you encounter issues:
- Verify resolution with: `file screenshot.png`
- Should show: `2048 x 2732`
- Check aspect ratio: 3:4
- Ensure file format: PNG or JPEG
- Max file size: 8MB per screenshot
