

### Plan: Add depth halo + slow pulse to 4s

**File: `src/components/Hero.tsx`**

Update the logo glow wrapper to have two stacked glow layers and a slower pulse:

1. **Outer halo** (existing) — keep `bg-mansagold/60 blur-3xl`, change pulse duration from `3s` → `4s`.
2. **Inner core** (new) — add a second `div` with `bg-mansagold/80 blur-2xl scale-75` for a tighter, brighter center, also pulsing at `4s` (same timing so they breathe together).

**Result:** The logo gets a layered "core + halo" radiance — the tight inner glow makes it feel like the logo itself is emitting light, while the wider outer glow softens into the background. Both pulse in sync at a slower, more luxurious 4s rhythm.

### Out of scope
- No color shift (stays pure `mansagold`).
- No size changes to the logo.
- No changes to other hero elements.

