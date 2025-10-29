# How to Take App Store Screenshots (No Pricing Text)

## Quick Start

1. **Enable Screenshot Mode**
   - Look for the "Screenshot Mode" button in the bottom-right corner
   - Click it to hide all pricing text (FREE, discounts, etc.)
   - A blue indicator will show when active

2. **Take Your Screenshots**
   - Navigate to each page you want to capture
   - All pricing references will be hidden
   - Screenshots will be clean and App Store compliant

3. **Disable When Done**
   - Click the X button on the blue indicator
   - Or add `?screenshot=false` to URL

---

## Recommended Pages to Screenshot

### Screenshot 1: Hero/Home Page
- **URL:** `/?screenshot=true`
- **Content:** Main hero section with value proposition
- **Text to Highlight:** "Save Money & Support Black-Owned Businesses"

### Screenshot 2: Business Directory
- **URL:** `/directory?screenshot=true`
- **Content:** Browse businesses with search/filter
- **Text to Highlight:** "Discover Local Black-Owned Businesses"

### Screenshot 3: QR Scanner
- **URL:** `/qr-scanner?screenshot=true`
- **Content:** QR code scanning interface
- **Text to Highlight:** "Scan. Shop. Save. Build Wealth Together."

### Screenshot 4: Business Profile
- **URL:** `/business/[any-business-id]?screenshot=true`
- **Content:** Detailed business page with reviews
- **Text to Highlight:** "Verified Business with Real Reviews"

### Screenshot 5: Dashboard (Use Demo Account)
- **URL:** `/dashboard?screenshot=true` (after logging in)
- **Login:** testuser@example.com / TestPass123!
- **Content:** Business owner dashboard
- **Text to Highlight:** "Track Your Business Growth"

---

## Device Screenshot Sizes

### iPhone
- **6.7"** (iPhone 14 Pro Max): 1290 x 2796 px
- **6.5"** (iPhone 11 Pro Max): 1242 x 2688 px
- **5.5"** (iPhone 8 Plus): 1242 x 2208 px

### iPad
- **iPad Pro (6th Gen)**: 2048 x 2732 px
- **iPad Pro (2nd Gen)**: 2048 x 2732 px

---

## Tools for Taking Screenshots

### Option 1: Browser DevTools (Easiest)
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device size (e.g., "iPhone 14 Pro Max")
4. Add `?screenshot=true` to URL
5. Take screenshot (Ctrl+Shift+P → "Capture screenshot")

### Option 2: iOS Simulator (Most Accurate)
1. Open Xcode
2. Run: `npx cap run ios`
3. Select device (iPhone 14 Pro Max, iPad Pro)
4. Navigate to pages with `?screenshot=true`
5. Press Cmd+S to save screenshot

### Option 3: Android Emulator
1. Open Android Studio
2. Run: `npx cap run android`
3. Select device size
4. Navigate and screenshot

### Option 4: Screenshot Tools
- **Figma:** Import screenshots and add polish
- **Sketch:** Professional editing
- **Screenshot.rocks:** Add device frames automatically

---

## What Screenshot Mode Hides

✅ **Hidden Elements:**
- "FREE GROWTH" banner
- "100% FREE" badges
- "Free until Jan 2026" text
- Discount percentages
- "$0" pricing
- "No cost" language
- Free pricing cards

✅ **Kept Elements:**
- Main hero headline
- Value propositions
- Feature descriptions
- Business listings
- QR code functionality
- Review ratings
- Dashboard data

---

## Checklist Before Submission

- [ ] All 5 screenshots per device taken
- [ ] No "FREE" text visible
- [ ] No discount percentages shown
- [ ] No "$0" or pricing amounts
- [ ] Screenshots show actual app functionality
- [ ] Device frames added (optional but recommended)
- [ ] Text overlays added with benefit statements
- [ ] All screenshots uploaded to App Store Connect

---

## Example Screenshot Captions

Use these for your App Store screenshot descriptions:

1. **"Discover Black-Owned Businesses Near You"**
2. **"Browse by Category, Location & Ratings"**
3. **"Scan QR Codes & Earn Rewards"**
4. **"Read Reviews from Real Customers"**
5. **"Grow Your Business with Powerful Tools"**

---

## Troubleshooting

**Screenshot mode not working?**
- Check URL has `?screenshot=true`
- Refresh the page after enabling
- Clear browser cache if issues persist

**Still seeing pricing text?**
- Make sure you clicked "Screenshot Mode" button
- Check the blue indicator is showing
- Try incognito/private browsing mode

**Need to test?**
- Take a test screenshot first
- Review it carefully for any price references
- Fix any issues before doing all screenshots

---

**Ready to resubmit once screenshots are updated! 🎉**

Last Updated: October 29, 2025
