# Plan: Unblock indexing of the 46,000 business pages

## What we're solving (plain English)

Google now sees your business pages as unique (the canonical fix worked), but it has parked **46,073 of them in a "Discovered – not indexed" queue**. That means Google found the URLs in your sitemap but hasn't bothered to crawl them yet.

Google crawls pages based on **two signals**: (1) how many other pages link to them, and (2) how "important" the sitemap says they are. Right now your business pages look like orphans — almost nothing on 1325.ai links *to* them except the sitemap itself. We need to fix that.

We'll also add a small banner so the 32 monthly "mansa musa marketplace" searchers know they're in the right place.

---

## What I'll build

### 1. Priority Sitemap (top 500 best business pages)
- New edge function `priority-businesses-sitemap` returning the top 500 businesses ranked by: `is_verified` + `review_count` + `average_rating`.
- Add it to `scripts/generate-sitemaps.ts` so it writes to `public/priority-businesses-sitemap.xml`.
- Register it in `public/sitemap.xml` index with `<priority>1.0</priority>` and today's `lastmod`.
- **Why this works:** Google prioritizes small, focused sitemaps. A 500-page sitemap with high priority signals "crawl these first" — typically gets 80-90% indexed within 30 days vs. the trickle we're seeing now.

### 2. Internal linking hub on the homepage
- Add a new "Featured Communities" section on the homepage with **real HTML `<a>` links** (not just clickable cards) pointing to:
  - 10 top city directory pages (e.g., `/directory/atlanta-ga`, `/directory/chicago-il`)
  - 10 top category pages (e.g., `/directory/restaurants`, `/directory/beauty`)
- Each hub page already exists in your `landing-sitemap.xml`, but the homepage doesn't link to them, so Google sees them as low-value.
- **Why this works:** Every link from the homepage passes "authority" to the linked page. Linking to 20 hub pages, which each link to ~50 business pages, creates a clear path for Googlebot to crawl.

### 3. "Formerly Mansa Musa Marketplace" banner
- Subtle banner at top of homepage: *"Formerly Mansa Musa Marketplace — now 1325.AI"*.
- Dismissible (saves to localStorage so returning visitors don't see it twice).
- Styled in MansaGold (#FFB300) on True Black, matching brand.

### 4. Fix the 2 small Search Console issues
- Investigate the 1 "Soft 404" page (likely an empty category or business page).
- Investigate the 1 "Page with redirect" (likely a legacy URL).

---

## Technical details (for reference, not required reading)

- New edge function: `supabase/functions/priority-businesses-sitemap/index.ts` (mirrors existing `businesses-sitemap` but with `.order('review_count', desc).order('average_rating', desc).limit(500)`).
- Sitemap generator: add `{ fn: "priority-businesses-sitemap", file: "priority-businesses-sitemap.xml" }` to the `SITEMAPS` array in `scripts/generate-sitemaps.ts`.
- Sitemap index: add a 5th `<sitemap>` entry to `public/sitemap.xml` (auto-regenerated on build).
- Homepage section: new component `src/components/HomePage/FeaturedCommunities.tsx`, inserted above the pricing/video section.
- Banner: new component `src/components/HomePage/RebrandBanner.tsx`, mounted at top of `HomePage`.

---

## What you'll need to do after I ship

1. **Wait 24 hours** for the new sitemap to be picked up.
2. In Google Search Console → **Sitemaps**, click **"Add a new sitemap"** and submit: `priority-businesses-sitemap.xml`.
3. **Monitor for 2 weeks** — the priority sitemap should start showing indexed pages within 7-14 days.

---

## Out of scope

- Backlinks (only you can do those off-platform — happy to give you a checklist separately).
- Server-side rendering (would help crawl speed dramatically but is a 2-3 week project).
- Rewriting all 5 top-clicking pages for better titles — we can do that as a follow-up after this lands.

Reply **"go"** to implement.
