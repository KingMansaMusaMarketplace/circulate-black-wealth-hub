

# Hero Clarity Update — Keep Both Paths, Tighten for 3-Second Comprehension

## Problem
All three AI reviewers agree: strong vision, but a first-time visitor can't tell what to **do** within 3 seconds. The hero currently shows a tagline, brand name, subhead, dual CTAs, a directory link, stats, Kayla branding, and a scroll indicator — too many elements competing for attention.

## Changes

### 1. Hero.tsx — Restructure for instant clarity

**A. Add a search input directly in the hero** (the single biggest improvement all three recommended)
- Search bar with placeholder: `"Search businesses: restaurants, barbers, catering..."` 
- On submit → navigates to `/directory?search=...`
- Positioned between the subhead and the dual CTAs
- This gives visitors an **immediate action** regardless of which audience they are

**B. Tighten the subhead** to be more outcome-specific:
- Current: "Find verified community businesses. Earn loyalty rewards. Track your economic impact — all in one free platform."
- New: "12,000+ verified businesses. Loyalty rewards on every purchase. Always free for consumers."

**C. Move Kayla block below the fold**
- Remove the large "Kayla / Agentic AI Concierge" branding and "Talk to Kayla" button from the hero
- Move it to a new small section between hero and MissionPreview (or into MissionPreview itself)
- First-time visitors don't know who Kayla is — seeing her name before understanding the platform creates confusion

**D. Tighten the dual CTAs with micro-descriptions**
- "I'm a Consumer" → add subtitle: "Free forever · Earn rewards"
- "I'm a Business" → add subtitle: "28 AI employees · From $19/mo"
- This addresses the "what do I get?" question instantly for both paths

**E. Remove the "Or explore businesses in the directory →" link** — the search bar replaces it

### 2. MissionPreview.tsx — Add brand context + concrete outcome

- Add a one-liner explaining "1325": something like *"1325 — named for Mansa Musa's 1325 pilgrimage, the greatest act of wealth circulation in history."* (or the founder's actual origin story)
- Add one concrete proof point: e.g., *"Businesses using Kayla see 3x more repeat customers"*

### 3. index.html — SEO fallback content

- Add a `<noscript>` block in `<body>` with static text describing the platform for crawlers
- Ensure `<meta name="description">` is set with the core value prop

## Files Changed

| File | What |
|---|---|
| `src/components/Hero.tsx` | Add search input, tighten subhead, move Kayla below fold, add CTA micro-descriptions |
| `src/components/HomePage/MissionPreview.tsx` | Brand origin line + concrete outcome stat |
| `src/components/HomePage/HomePageSections.tsx` | Add Kayla CTA section between hero and mission (if needed) |
| `index.html` | Add noscript fallback + verify meta description |

## What stays the same
- Dual-path Consumer/Business strategy (both equal)
- Design system, colors, typography
- Pricing, Kayla capabilities, all other sections
- "Economic Operating System" positioning

