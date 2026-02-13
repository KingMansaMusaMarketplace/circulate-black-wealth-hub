

## Enhance Hero Background Gradient

The goal is to make the dark gradient background in the Hero section feel more premium and more "on brand" for **Mansa Musa Marketplace** -- warmer, with more gold presence, while keeping the dark luxurious feel.

### What Changes

**File: `src/components/Hero.tsx`**

1. **Richer gradient base** -- Shift the background from pure blue-slate tones to include warmer undertones. Change `from-slate-950 via-blue-950 to-slate-900` to something like `from-slate-950 via-[#0a1628] to-[#1a1005]`, adding a subtle warm/gold edge.

2. **Stronger gold ambient glow** -- Increase the gold orb opacity from `bg-mansagold/10` to `bg-mansagold/15` and make it slightly larger so the gold warmth is more visible behind the headline.

3. **Add a subtle gold radial accent** -- Add a new soft radial glow positioned behind the text area using a warm amber/gold tone (`bg-gradient-to-t from-mansagold/8 to-transparent`) to give a "spotlight" effect on the headline.

4. **Subtle bottom gold edge** -- Add a faint gold-to-transparent gradient at the bottom of the hero to create a warm transition into the next section.

### Technical Details

All changes are CSS/Tailwind class adjustments in `src/components/Hero.tsx` only. No new dependencies or structural changes needed. The modifications:

- Background: `bg-gradient-to-br from-slate-950 via-[#0a1628] to-[#1a0d05]`
- Gold orb: increase opacity to `/15` and size to `w-[500px] md:w-[700px]`
- New center glow div: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-mansagold/8 rounded-full blur-[150px]`
- Bottom fade: `absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-mansagold/5 to-transparent`

