## The real problem (in plain English)

Google **found** 46,073 business pages from your sitemap, but chose **not to index** them. This almost never means "Google missed them." It means Google looked at the cost vs. value and decided to wait. Three things are causing that on 1325.ai right now:

1. **The pages are JavaScript-rendered.** When Googlebot fetches `/business/joellen-s-tallahassee-...`, the HTML it gets back is essentially blank — the business name, description, address, and reviews only appear after React runs. Google can render JavaScript, but it puts these pages in a slow second-pass queue and deprioritizes them when there are 44,000 of them. This is the #1 cause.
2. **The pages look thin and templated.** Same layout, often a short description, no structured data identifying it as a real business. Google's quality classifier sees 44K near-identical shells and concludes "low value, skip."
3. **The pages have almost no internal links pointing at them.** Google discovered them through the sitemap, but a sitemap is a hint, not a vote. Without category pages or city pages linking to individual businesses, every page looks orphaned.

A site with a brand-new domain (verified Jan 2026), 155 clicks/month, and 44K URLs is asking Google for a lot of trust very fast. We have to **earn** the indexing by making each page individually crawl-worthy.

## What to build

### 1. Pre-render business detail pages as static HTML at build time

The single highest-impact fix. We add a build step (`scripts/prerender-businesses.ts`) that:
- Reads all businesses from the same source the `/business/:businessId` route uses.
- For each business, generates a real `.html` file under `dist/business/<slug>/index.html` containing the business name, description, category, city, address, hours, and a `<script type="application/ld+json">` block.
- Lovable hosting serves the static HTML when it exists, and falls back to the SPA for routes that don't. Googlebot sees a fully-formed page on first fetch — no JS render needed.

To keep build times sane we batch in chunks of 1,000 and skip businesses whose data hasn't changed (cached by `id+updated_at`).

### 2. Add `LocalBusiness` JSON-LD to every business page

Inside each pre-rendered page, emit structured data that tells Google "this is a real business with a name, address, phone, category." This is how directory sites like Yelp get individual listings indexed. Schema:

```text
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "...",
  "description": "...",
  "address": { "@type": "PostalAddress", "addressLocality": "...", "addressRegion": "..." },
  "url": "https://1325.ai/business/<slug>",
  "image": "...",
  "telephone": "..."
}
```

### 3. Add per-page `<link rel="canonical">` and Open Graph tags

Currently only `<title>` and `<meta description>` are set via Helmet. Add `canonical`, `og:url`, `og:title`, `og:description`, `og:type=profile`. This signals each URL is its own canonical destination, not a duplicate of the homepage.

### 4. Build city + category hub pages that link into businesses

The directory currently funnels everything through search/filters, which means individual businesses have no "voting" internal links. Add real, crawlable URLs:
- `/directory/city/[city-slug]` — lists all businesses in that city.
- `/directory/category/[category-slug]` — lists all businesses in that category.

These hubs get pre-rendered with anchor `<a href>` links to each business page. Now every business has at least 2 internal links pointing at it, which transforms how Google evaluates them.

### 5. Shrink and prioritize the sitemap

Submitting 44K URLs at once on a low-authority domain is counter-productive. We change `businesses-sitemap.xml` to:
- Sort businesses by data quality (has description + image + address + recent activity → top).
- Split into `businesses-priority-sitemap.xml` (top ~5,000 by quality) and `businesses-longtail-sitemap.xml` (everything else).
- Set `<priority>0.8</priority>` on the priority sitemap and `0.3` on the longtail.

This focuses Google's crawl budget on the 5,000 pages most likely to satisfy users. Once those start indexing, the longtail follows naturally.

### 6. Improve the description fallback on thin profiles

When `business.description` is empty or one short sentence, render a generated paragraph: `"<Name> is a Black-owned <category> located in <city>, <state>. Find contact info, hours, and reviews on 1325.AI's directory of 43,000+ Black-owned businesses."` This isn't a hack — it gives Google something unique to index for businesses without rich content.

### Out of scope

- The 16 "Crawled – not indexed," 1 "Soft 404," and 1 "Redirect" — tiny numbers, we'll handle once the big fix lands.
- The 508 "Alternate page with proper canonical tag" — this is **expected/healthy behavior**, no action needed.
- Moving to full SSR (Next.js, etc.) — that's a project-shape change. Pre-rendering at build time gets us 90% of the way there without rewriting the stack.

## Order of work

1. Phase A (highest ROI): pre-render + JSON-LD + per-page canonical/OG (#1, #2, #3).
2. Phase B: split sitemap by quality (#5) and improve description fallback (#6).
3. Phase C: city/category hub pages (#4) — bigger UX/copy lift, worth doing after we see Phase A move indexing numbers.

## Technical notes

- Pre-render script reads from the same Supabase source used by `BusinessDetailPage`. Use the service-role key so it can read past RLS at build time only.
- Output goes to `public/business/<slug>/index.html` during `prebuild`, then Vite copies it into `dist/`. Lovable hosting's SPA fallback only triggers if no file exists at that path, so the static HTML wins.
- Helmet stays in `BusinessDetailPage.tsx` for users navigating client-side — it just won't be the *first* HTML Googlebot sees anymore.
- Expect 44K HTML files at ~5–15 KB each → ~300–600 MB added to the build. We'll need to confirm the build still completes in Lovable's time budget; if not, we split into incremental rebuilds keyed on `updated_at`.
- After deploy, in Search Console: re-submit `businesses-priority-sitemap.xml` and request indexing on 5–10 sample business pages to seed the recrawl.

## Expected outcome

- Within 2–4 weeks: Phase A pages move from "Discovered – not indexed" to "Crawled – not indexed," then a chunk move to "Indexed." Realistic target: 3,000–8,000 indexed in the first wave (not all 44K — that comes with authority over months).
- Click traffic from long-tail "[business name] [city]" queries should start appearing in GSC within 30 days.

## What you'll need to do

Nothing during the build. After it deploys, I'll give you 3 short steps for Search Console (resubmit priority sitemap, request indexing on 5 sample pages, watch the Page Indexing report a week later).