# City + Category SEO Landing Pages

## Goal
Capture the ~50,000+ monthly Google searches for terms like "black owned restaurants near me" and "black hair salons near me" by creating dedicated pages for every city × category combination.

## What gets built

### 1. New route pattern
`/black-owned/:category/:city` — examples:
- `/black-owned/restaurants/chicago`
- `/black-owned/hair-salons/atlanta`
- `/black-owned/restaurants/houston`
- `/black-owned/barbers/detroit`

Plus a category index: `/black-owned/:category` (all cities)
And a city index: `/black-owned-near-me/:city` (all categories in that city)

### 2. Page contents (SEO-optimized)
Each page includes:
- **H1**: "Black Owned Restaurants in Chicago" (exact target keyword)
- **Intro paragraph**: 80-120 words with the keyword + supporting terms
- **Filtered business grid**: pulls from existing directory data, filtered by category + city
- **Map view** of those businesses
- **FAQ section**: "Are these all verified Black-owned?", "How do I add my business?" — captures question-keyword traffic
- **Related cities** ("Black-owned restaurants in Atlanta, Houston, Detroit…") — internal linking
- **CTA** to claim/add business
- **Schema.org JSON-LD**: `ItemList` of `LocalBusiness` items — helps Google show rich results
- **Meta title / description** with the exact keyword
- **Canonical URL**

### 3. Sitemap
Auto-generate a new `cities-sitemap.xml` containing every category × city URL (~10 categories × top 50 US cities = 500 high-intent landing pages). Submit to Google Search Console.

### 4. Internal linking
- Add a "Browse by city" section to the homepage and existing `/directory` page
- Footer links to top 5 cities × top 3 categories

## Target categories (initial 8)
Restaurants, Hair Salons, Barbers, Beauty, Health, Retail, Services, Cafes

## Target cities (initial 25)
Chicago, Atlanta, Houston, Detroit, New York, Los Angeles, Philadelphia, Washington DC, Dallas, Memphis, Baltimore, Charlotte, New Orleans, Oakland, Brooklyn, Miami, Phoenix, Seattle, Cleveland, St. Louis, Birmingham, Jackson, Nashville, Newark, Milwaukee

That's **200 landing pages on day one** (8 categories × 25 cities).

## What you'll need to do
- Approve this plan
- After build: visit one of the new URLs to confirm it looks good (e.g., `/black-owned/restaurants/chicago`)
- Submit `cities-sitemap.xml` in Google Search Console (or I can do this via the connector)

## Technical details

**New files**
- `src/pages/CityCategoryLanding.tsx` — the SEO landing page template
- `src/lib/seo/cities-categories.ts` — config of cities + categories + slug mapping
- `src/lib/seo/landing-content.ts` — generator for unique intro text per page (avoids duplicate-content penalty)
- `public/cities-sitemap.xml` — generated sitemap (built by `scripts/generate-sitemaps.ts`)

**Edited files**
- `src/App.tsx` — register the 3 new routes (lazy-loaded)
- `scripts/generate-sitemaps.ts` — add city × category URL generation
- `public/sitemap.xml` (or sitemap index) — reference the new sitemap
- `src/pages/Directory.tsx` (or similar) — add "Browse by city" section linking to landing pages

**Reused**
- Existing business data from Supabase (filtered by category + city)
- Existing `BusinessCard`, `MapView`, design tokens
- Existing `react-helmet-async` for meta tags

**Out of scope (can add later)**
- Per-business pages (you already have these)
- Auto-generating new city pages when a new business is added
- A/B testing different intro copy
