

## Reduce Blank Space Between Homepage Sections on Mobile

### Problem
On iPhone, there's too much empty blue space:
- Above the "Learn Our Full Story" button
- Below the "6 hours vs 28+ days" box
- Between sections all the way to the Mansa Stays box

The root cause is excessive vertical padding on each section, compounded by transparent backgrounds that expose the page's blue gradient, making the gaps feel even larger on mobile.

### Changes

**1. MissionPreview.tsx** — Tighten spacing
- Reduce section padding from `py-6` to `py-3 md:py-8` (mobile gets much less)
- Reduce margin above "Learn Our Full Story" from `mb-5` to `mb-3`
- Reduce header margin from `mb-5` to `mb-3 md:mb-6`

**2. ThreePillars.tsx** — Tighten mobile spacing
- Reduce section padding from `py-6 md:py-8` to `py-3 md:py-8`

**3. VacationRentalsCTA.tsx** — Tighten mobile spacing
- Reduce section padding from `py-8 md:py-10` to `py-3 md:py-10`

**4. HomePageSections.tsx** — Reduce skeleton fallback spacing
- Change skeleton `py-12 md:py-16` to `py-4 md:py-16` so loading placeholders don't create huge gaps on mobile

### Technical Details

All changes are CSS class adjustments only — no logic or layout structure changes. The `md:` breakpoint values stay the same so desktop is unaffected.

