# Consumer-First Homepage Variant

## Goal
Build a testable homepage version that leads with the consumer benefit ("Find and support Black-owned businesses") and uses the infrastructure story as proof of scale, rather than putting the investor headline first.

## What we will do

1. **Audit current homepage copy and layout**
   - Read `src/pages/HomePage.tsx` and `src/components/HomePage/HeroSection.tsx` (or equivalent hero component).
   - Confirm the current TAM strip, CTAs, and section order.

2. **Create a consumer-first variant**
   - Add a new route or toggleable state so we can preview the alternative without breaking the live homepage.
   - Reorder the hero so the top headline speaks to the consumer first.
   - Keep the investor proof points (TAM strip, patent, MCP endpoint) but position them as credibility below the consumer promise.
   - Preserve the three CTAs but adjust their prominence so "Shop Black-Owned" is primary.

3. **Ensure design system compliance**
   - Use existing tokens for colors, type, spacing, and gradients.
   - No hardcoded colors.

4. **Verify and preview**
   - Run the build check.
   - Test the variant route in the preview.
   - Confirm the original `/` remains unchanged until you approve the switch.

## After this plan

You will be able to open the new variant, compare it side-by-side with the current homepage, and choose which one becomes the default.