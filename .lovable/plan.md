
# Brand Language Refinement: Strategic Audit and Update

## Overview

There are **2,800+ references** to "Black-owned," "Black business," "Black economic," "Black wealth," "Black community," and "Black dollar" across **266 files**. Rather than removing these terms, the strategy is to **keep them where they matter most** (SEO, mission pages, investor materials) and **soften them in consumer-facing UI** where the brand identity already communicates the mission.

## Approach: Three-Tier Language Strategy

### Tier 1: KEEP AS-IS (Mission-Critical)
These are pages/files where the terminology is essential for SEO, investor clarity, and legal/business documents:

- `src/config/site.ts` -- Core SEO description
- `src/utils/seoUtils.ts` -- Page-level SEO keywords and descriptions
- `src/components/SEO/` -- Structured data for Google
- `src/components/sponsorship/` -- Sponsor proposals and certificates
- `src/components/partner/marketing/VideoScriptGenerator.tsx` -- Marketing scripts
- `supabase/functions/generate-business-description/` -- AI prompts
- About page mission/vision sections
- How It Works history sections (Mansa Musa narrative)

### Tier 2: SOFTEN (Consumer UX)
Replace explicit "Black-owned" with aspirational language that implies the same thing. The brand name "Mansa Musa" already signals the audience:

| Current | Proposed |
|---------|----------|
| "Discover Black-owned businesses" | "Discover businesses in your community" |
| "Support Black businesses" | "Support your community" |
| "Black businesses buying from Black businesses" | "Our businesses buying from our businesses" |
| "Black economic power" | "Economic power" or "Community wealth" |
| "The Black dollar" | "Our dollar" or "Community dollar" |

**Files to update (Tier 2):**
- `src/components/Hero.tsx` -- Hero subheadline
- `src/components/HomePage/ThreePillars.tsx` -- B2B pillar description
- `src/components/HomePage/CirculationGap.tsx` -- "The Black dollar" line
- `src/components/HomePage/MissionPreview.tsx` -- "Black economic circulation"
- `src/components/HowItWorks/CTASection/CTASection.tsx` -- CTA copy
- `src/components/HowItWorks/MansaMusaHistory/InfoSection.tsx` -- Mission/Circulation cards
- `src/components/admin/DataSeeder.tsx` -- "5 diverse Black-owned businesses"
- `src/hooks/use-b2b.ts` -- UI-facing search label

### Tier 3: REPHRASE (Descriptive Business Labels)
In data/banner files like `src/utils/businessBanners.ts`, comments that say "Black-owned community bank" are internal code comments -- no user ever sees them. These can stay as-is since they don't affect the UI.

## Implementation Steps

1. **Hero and Homepage** (3 files) -- Soften the hero subheadline, ThreePillars B2B copy, and CirculationGap phrasing to use "community" and "our" language
2. **MissionPreview** -- Change "Black economic circulation" to "economic circulation" (the 1325.AI brand context already implies the audience)
3. **How It Works sections** -- Soften CTA and InfoSection cards to lead with "community" language
4. **SEO keywords** -- Keep "Black-owned" in keywords arrays (critical for search traffic) but soften user-facing descriptions where they appear in meta tags
5. **generateBusinessSEO** -- Keep "Black-owned" in fallback descriptions since this drives organic discovery

## What Changes (Summary)

- **~8-10 component files** get consumer-facing copy softened
- **SEO files stay intact** -- "Black-owned business" is a top search term
- **Investor/sponsor documents stay intact** -- Clarity is essential
- **Code comments stay intact** -- No user impact
- **Result**: The platform feels aspirational and inclusive on the surface, while the mission remains unmistakable through brand identity, SEO, and institutional materials

## Technical Details

All changes are text-only copy updates in TSX/TS files. No structural, routing, or logic changes. Each file edit is a simple string replacement using `lov-line-replace`.
