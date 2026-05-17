## Goal

Make sure new businesses and landing pages show up in Google within days — not whenever the next code deploy happens — without any manual work from you.

## What's there today

Looking at your setup:

- `businesses-sitemap.xml` and `landing-sitemap.xml` already **proxy live** to Supabase edge functions (via `public/_redirects`). These are always fresh — every time Google fetches them, they reflect the current database. ✅
- `images-sitemap.xml` (and its 5 parts) is a **static file** generated at build time. Stale until the next deploy. ⚠️
- `sitemap.xml` (the index) and `static-sitemap.xml` are also static — but they rarely change (just a list of sitemap names + ~94 core routes), so they don't need weekly refresh.

So the actual "freshness" problem is only:
1. The **images sitemap** (43,703 images) goes stale between deploys.
2. Google doesn't know to re-crawl unless something nudges it.

## The plan — 3 small changes

### 1. Make the images sitemap live (no more staleness)

Add a proxy redirect in `public/_redirects` so `images-sitemap.xml` is served live from the existing `images-sitemap` edge function — same trick we already use for businesses and landing.

Because images-sitemap is an index pointing to parts (`images-sitemap-1.xml` … `-5.xml`), we'll either:
- (a) update the edge function to return a single non-chunked sitemap if under the 50k URL / 50MB limit, OR
- (b) add part-file proxy rules too.

I'll pick whichever is simpler after inspecting the edge function output size.

### 2. Weekly "ping" cron job inside Supabase

Create a new edge function `refresh-sitemaps-weekly` that:
- Calls each sitemap edge function once (warms cache, confirms healthy).
- Pings **IndexNow** (one open API used by Bing, Yandex, DuckDuckGo, Naver) with the sitemap URLs — no auth, instant recrawl signal for ~30% of search traffic.
- Logs success/failure to a small `sitemap_refresh_log` table so you can see it ran.

Schedule it via Supabase `pg_cron` to run every **Monday 6am Chicago time**.

For Google specifically: Google deprecated the old "ping sitemap" endpoint in 2023. Google now auto-recrawls submitted sitemaps every few days on its own — no API ping needed. With option #1 (live images sitemap) above, every Google recrawl will see fresh data automatically.

### 3. One IndexNow key file

IndexNow needs a small text file at `public/<key>.txt` to verify ownership (just a UUID matching the one we send in the ping). One-time setup.

## What you'll need to do

- Approve this plan — I do everything in code.
- After deploy, no further action. The cron runs itself.
- (Optional, in ~1 week) glance at the `sitemap_refresh_log` table to confirm it's pinging.

## Technical details (for the record)

- New file: `supabase/functions/refresh-sitemaps-weekly/index.ts`
- New file: `public/<indexnow-key>.txt`
- DB migration: `sitemap_refresh_log` table + `pg_cron` schedule (uses Supabase insert for the cron `SELECT` since it contains the anon key).
- Edit: `public/_redirects` to add images sitemap proxy.
- Possible edit: `supabase/functions/images-sitemap/index.ts` if we go with single-file mode.
- No changes to: existing build-time `scripts/generate-sitemaps.ts`, GSC config, or frontend code.

## Why this is the right approach

You don't have a GitHub-connected auto-deploy pipeline that we can trigger weekly, and Lovable hosting serves static files from the last build. Live edge-function proxying solves the freshness problem at its root, and IndexNow handles the "tell search engines to look again" part for free.
