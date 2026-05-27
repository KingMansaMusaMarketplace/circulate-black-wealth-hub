# Homepage Clarity Pass (Phase 1 + 2)

Goal: fix the three problems all 3 reviewing AIs agreed on — slow/blocking load, unclear identity, and abstract claims — without touching navigation, routes, pricing, or the visual system.

## What changes (user-visible)

### 1. Loading experience
- Remove the full-screen "Loading 1325.AI" overlay on the homepage. Let the hero render immediately; any remaining assets load in the background.
- If a loader is ever needed (slow connection), show it as a thin top progress bar instead of a blocking screen.

### 2. Kayla voice widget
- Never auto-open on web. User must click to open.
- Keep the existing iOS-native hide rule untouched.

### 3. Hero section (consumer-weighted hybrid)
- **Eyebrow tag** (small, above headline):
  "1325 — the year Mansa Musa's pilgrimage reshaped global commerce"
- **Headline** (one sentence, clear):
  "Discover verified Black-owned businesses. Powered by AI."
- **Sub-headline** (concrete, not abstract):
  "~4 Roles Covered · $12,100+/mo savings" followed by 3 short capability examples (e.g. "Answers customers 24/7 · Books appointments · Posts to social").
- **Two CTAs only** (no choice paralysis):
  - Primary (larger, MansaGold): **Find Black-Owned Businesses** → directory
  - Secondary (outline): **Grow Your Business with AI** → business/Kayla page
- **Demote "Economic Operating System"** out of the hero. Move that language to the About page only.

### 4. Social proof strip (below hero)
- Add a single row showing real, verifiable signals: verified business count, a short testimonial or two, and any partner/press logos that exist today.
- If a metric isn't real yet, leave it out — no placeholder numbers.

### 5. Below-the-fold cleanup
- Shrink the Mansa Stays and Noire Rideshare beta banners and place them below the hero + social proof, so they no longer compete for first attention.
- Audit copy across the homepage for any remaining "28 AI Employees" or "FTEs Replaced" phrasing and replace with the committed "~4 Roles Covered · $12,100+/mo savings" framing.

## What is NOT changing this round
- Navigation structure (kept as-is; revisit after we see results)
- No new routes (`/discover`, `/ai-agents`, etc.)
- Pricing, tiers, and payment flows
- iOS native behavior
- Visual system (True Black, MansaBlue, MansaGold, Apple-minimal stays)
- Database, auth, edge functions

## Technical notes (for reference)
- Files likely touched: the homepage route component, the hero component, the loading-overlay component, the Kayla voice widget mount logic, and a small new SocialProof component.
- Frontend-only. No migrations, no edge function changes, no new dependencies expected.
- All color usage stays on semantic tokens from `index.css` / `tailwind.config.ts`.

## What you'll need to do
1. **Approve this plan** to switch me to build mode.
2. After I ship, **tell me which real numbers/testimonials/logos to put in the social proof strip** (or confirm you want me to leave it minimal until you have them).
3. Optional: after a few days of traffic, we revisit whether to do Phase 3 (nav cleanup).
