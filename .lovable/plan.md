
## Plan: Add Trust/Credibility Stat Strip

Insert a compact stat strip between **Consumer Benefits (#2)** and **Featured Businesses (#3)** to give cold traffic a quick credibility hit before the social proof carousel.

### What to build

A new lightweight section component: `src/components/HomePage/TrustStatStrip.tsx`

**Content (4 stats, horizontal strip):**
1. **$12,100+/mo** — Avg. business savings with Kayla
2. **~4 Roles Covered** — Sales, marketing, support, ops
3. **24/7** — AI employee uptime
4. **100%** — Black-owned & verified

(Stats #1 and #2 are required by Core memory rule. Stats #3 and #4 round out the strip with platform credibility.)

### Design

- Single-row strip on desktop (4 columns), 2x2 grid on mobile
- Dark glass treatment matching existing sections: `bg-slate-900/40 backdrop-blur-xl border-y border-white/10`
- MansaGold (#FFB300) for the stat numbers, white for labels
- Compact vertical padding (`py-8 md:py-10`) — meant as a *beat*, not a full section
- Subtle fade-in via `framer-motion` (matches `LiveImpactCounter` pattern already in codebase)
- No icons (keeps it lean — icons would make it compete with Consumer Benefits visually)
- No CTA, no card chrome — just numbers + labels on the page background

### Integration

Edit `src/components/HomePage/HomePageSections.tsx`:
- Add `lazy` import for `TrustStatStrip`
- Insert between `ConsumerBenefits` block and `FeaturedBusinesses` block
- Wrap in `SectionErrorBoundary` + `Suspense` with a thin skeleton (`h-24`)

### New homepage flow
1. Mission Preview
2. Consumer Benefits
3. **Trust Stat Strip** ← new
4. Featured Businesses
5. CTA
6. See The Impact
7. Pricing
8. Meet Kayla
9. Vacation Rentals CTA
10. Noir Ride CTA

### Files
- **Create:** `src/components/HomePage/TrustStatStrip.tsx`
- **Edit:** `src/components/HomePage/HomePageSections.tsx`

### Notes
- Numbers are static (no DB hookup) — matches the "marketing claim" intent. If you later want live data, we can wire it to `useCommunityImpact`.
- Honors Core memory: uses "~4 Roles Covered" (not "FTEs Replaced") and the $12,100+/mo figure.
