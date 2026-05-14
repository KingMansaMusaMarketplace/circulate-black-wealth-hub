# Admin SEO Dashboard — Live Google Search Console Data

## Goal
Add an admin-only page at `/admin/seo` that shows live Google Search Console data for both `1325.ai` and `mansamusamarketplace.com` — so you don't have to log into Google to see how people are finding you.

## What you'll see on the page

1. **Property switcher** — toggle between `1325.ai` and `mansamusamarketplace.com`
2. **Date range picker** — last 7 / 28 / 90 days
3. **Top-line metrics cards** — total Clicks, Impressions, average CTR, average Position
4. **Top Queries table** — the search terms bringing people to your site (query, clicks, impressions, CTR, position)
5. **Top Pages table** — which URLs Google is sending traffic to
6. **Top Countries** — where your visitors are searching from
7. **Indexing status** — how many of your submitted sitemap URLs Google has indexed (per sitemap)
8. **Refresh button** — pulls fresh data from Google on demand

## How it works (plain English)

- A new secure backend function (Supabase edge function) talks to Google Search Console using the connector you already authorized.
- The frontend page calls that function and displays the data in clean tables and cards.
- Only logged-in admin users can see the page — verified server-side using your existing `has_role` check.

## What you need to do

- Approve this plan
- After it's built, log in as an admin and visit `/admin/seo`
- That's it — no Google login needed

## Technical details

**New files**
- `supabase/functions/gsc-analytics/index.ts` — calls the GSC connector gateway. Endpoints used:
  - `POST /webmasters/v3/sites/{siteUrl}/searchAnalytics/query` (queries, pages, countries)
  - `GET /webmasters/v3/sites/{siteUrl}/sitemaps` (indexed URL counts per sitemap)
  - Accepts `{ siteUrl, startDate, endDate, dimension }` from the client
  - Verifies caller is authenticated and has `admin` role before calling Google
- `src/pages/admin/SEODashboard.tsx` — the dashboard UI (cards + tables, uses existing shadcn components and design tokens)
- Route added to the admin router

**Reused**
- Existing `google_search_console` connector + `LOVABLE_API_KEY` / `GOOGLE_SEARCH_CONSOLE_API_KEY` secrets
- Existing admin role check (`has_role(auth.uid(), 'admin')`)
- Existing shadcn Card / Table / Tabs / Select components
- React Query for caching (5-min stale time so you don't re-hit Google on every render)

**Out of scope (can add later)**
- Historical trend charts (would need to store snapshots in DB)
- Email alerts when traffic drops
- Comparing 1325.ai vs mansamusamarketplace.com side-by-side
