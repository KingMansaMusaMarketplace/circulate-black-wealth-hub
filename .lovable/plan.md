# Redesign Slide 6: 17 Revenue Streams, Grouped by Strategic Priority

## Goal
Update the pitch deck's Slide 6 (`src/components/pitch-deck/PitchSlide6BusinessModel.tsx`) so it accurately reflects all **17 revenue streams** — but visually grouped to show investor discipline rather than chaos.

## What changes

**Headline:**
- Change "8 Revenue Streams" → "17 Revenue Streams"
- New subtitle: "3 Launch Wedges · 14 Expansion Layers"

**New two-section layout:**

### Section 1 — Launch Wedge (Years 1–2) — 3 streams, prominent
Larger cards, gold border, "WEDGE" badge:
1. **Business Subscriptions** — $19–$899/mo tiers, $355 blended ARPU
2. **Kayla AI Subscriptions** — 33 agentic employees, $12K+/mo overhead replaced
3. **Corporate Sponsors** — $250K–$1M annually, non-dilutive runway

### Section 2 — Expansion Layer (Year 2+) — 14 streams, compact grid
Smaller cards, muted border, labeled "EXPANSION":
4. B2B Transaction Fees (1–3%)
5. Featured Proximity Ads (CPM)
6. Agent Commissions (referral network)
7. White-Label Licensing (tenant-branded)
8. Premium API / Developer Platform
9. Loyalty Program Fees
10. Marketplace Listing Boosts
11. Data & Insights Licensing
12. Event Sponsorships & Tickets
13. Certifications & Training
14. Embedded Financing / Capital Access
15. Mansa Stays (vacation rental commissions)
16. Noire Rideshare (ride commissions)
17. Gemini Enterprise Add-On ($25K setup + $8K/mo)

**Bottom strip — keep the existing metrics bar but update:**
- "Revenue Diversification = Resilience" → "Disciplined Wedge → 17-Stream Platform"
- Keep: 86% Gross Margin · 142% NRR · 2.8-mo CAC Payback · $2.4M 2026 ARR · $355 ARPU

## Files touched
- `src/components/pitch-deck/PitchSlide6BusinessModel.tsx` (only file edited)

## What I will NOT touch
- Slides 9, 10, 13 (already-correct roadmap, market, ask slides)
- `siteConfig`, pricing logic, IAP tiers, edge functions
- The downloadable investor PDF (separate ask if you want it regenerated after)

## Design notes
- Stays on-brand: True Black bg, MansaGold (#FFB300) accents for wedge, muted white/10 for expansion
- Wedge cards: ~2x visual weight (larger icon, larger title, gold border-2)
- Expansion grid: 14 cards in a 7×2 or responsive grid, small icon + 2-line label
- All within one slide — no scrolling, fits 1920×1080

## After you approve
Once I'm in build mode I'll:
1. Rewrite the slide component
2. Verify it renders cleanly in the preview at the pitch-deck route
3. Ask if you want the downloadable PDF regenerated to match

## Open question (answer in chat, no rebuild needed)
The 14 expansion streams above are my best read of your business. If any are **wrong** or you'd swap one for something I missed (e.g., affiliate revenue, white-label app store, accelerator fees), tell me now and I'll fix the list before building.