

## Consolidated Homepage Messaging Fix

All three AI reviews (OpenAI, Gemini, Perplexity) converge on the same core issues. Here's the unified plan:

### The Problem
The homepage looks great but doesn't communicate **what happens when you join** within the first 5 seconds. Too many ideas hit at once (directory + AI + economic system + rideshare + vacation rentals).

### Changes

**1. Hero.tsx — Add mission tagline + sharpen subhead**
- Add a small tag above "Mansa Musa Marketplace": `The Economic Operating System for Community Wealth`
- Replace current subhead with outcome-driven copy: *"Find verified community businesses. Earn loyalty rewards. Track your economic impact — all in one free platform."*
- Add a compact trust stat bar below CTAs showing live member/business counts (reusing existing `get_platform_stats` RPC)

**2. HomePageSections.tsx — Reorder + add sections**
- Move `MissionPreview` to position #1 (immediately after Hero)
- Add `CommunityWealthTicker` (already exists, just not on homepage) after ConsumerBenefits
- Add new `QuickHowItWorks` section between ticker and FeaturedBusinesses

**3. New: QuickHowItWorks.tsx — 3-step visual**
Compact section showing the user journey:
1. **Discover** — Find verified businesses near you
2. **Support** — Shop, scan QR codes, earn points
3. **Circulate** — Watch your dollars build community wealth

Styled to match existing dark theme, using the same card patterns as ConsumerBenefits.

**4. MissionPreview.tsx — Increase prominence**
Slightly larger heading text and add a one-line Kayla pitch beneath: *"One AI employee that handles reviews, marketing, and bookkeeping — so you can focus on the business."*

### New Section Order
1. MissionPreview (moved up)
2. ConsumerBenefits
3. CommunityWealthTicker (new to homepage)
4. QuickHowItWorks (new component)
5. FeaturedBusinesses
6. CTA
7. ThreePillars
8. MeetKayla
9. Pricing
10. VacationRentalsCTA
11. NoirRideCTA
12. CirculationGap

### Files
| File | Action |
|------|--------|
| `src/components/Hero.tsx` | Add tagline, update subhead, add trust stats |
| `src/components/HomePage/HomePageSections.tsx` | Reorder, add ticker + how-it-works |
| `src/components/HomePage/QuickHowItWorks.tsx` | Create new |
| `src/components/HomePage/MissionPreview.tsx` | Enlarge text, add Kayla pitch line |

### What stays unchanged
- Brand identity, colors, Kayla voice CTA — all validated by every review
- Dual-path Consumer/Business buttons — Gemini praised this
- CirculationGap section — Gemini called it a "compelling hook"
- All downstream sections (pricing, rideshare, vacation rentals)

