# SEO Boost Plan — Rewrite Weak Pages + Competitor Gap Analysis

Goal: lift clicks from the 6 pages that Google is already showing but nobody clicks, and find new keywords worth targeting.

## What I'll do

### Step 1 — Pull the real search data (Semrush)
Run two read-only analyses to ground the rewrites in real numbers, not guesses:
- **Page analysis** on each of the 6 weak pages — to see what keywords they already rank for and at what position.
- **Competitor gap analysis** for `1325.ai` — to find keywords competitors rank for that you don't.

This takes ~1 minute and uses no credits on your side (Semrush is built into Lovable).

### Step 2 — Rewrite titles and meta descriptions
Update the SEO **title** (the blue headline in Google) and **meta description** (the gray snippet) on these 6 pages:

| Page | Why it needs help |
|---|---|
| `/community-impact` | 71 impressions, 0 clicks |
| `/business-signup` | 65 impressions, 0 clicks |
| `/scanner` | 55 impressions, 0 clicks |
| `/media-kit` | 91 impressions, 1 click |
| `/about` | 156 impressions, only 9 clicks |
| `/directory` | 68 impressions, 2 clicks |

Each new title will be:
- Under 60 characters (so Google doesn't cut it off)
- Lead with the keyword the page actually ranks for
- Include a benefit ("Find Black-owned businesses near you" vs. just "Directory")

Each new meta description will be:
- Under 160 characters
- Action-oriented (tells the user what they'll get if they click)

### Step 3 — Report back with the gap analysis
I'll deliver a short list of:
- **Quick-win keywords** you're close to ranking for (positions 8–20) — small page tweaks could push these to page 1.
- **Content gap keywords** competitors get traffic from that you don't — candidates for future blog posts or new pages.

## Technical details (for reference)

- The 6 pages use `react-helmet-async` for per-route SEO tags. I'll edit each page component's `<Helmet>` block — no new files, no design changes.
- If a page is currently relying only on the sitewide tags in `index.html`, I'll add a `<Helmet>` block to that one route.
- No backend changes, no database changes, no UI changes — only `<title>`, `<meta name="description">`, and (where missing) `<link rel="canonical">`.

## What I will NOT do

- Won't change page designs or copy on the page itself.
- Won't change routing, navigation, or any business logic.
- Won't touch the homepage (it's already your top performer — don't risk it).
- Won't add new pages in this round (we'll discuss that after the gap analysis).

## What you need to do
Nothing during the work. After it ships, **resubmit the 6 pages in Google Search Console** ("Request indexing" on each URL) so Google re-crawls them faster. I'll give you the exact steps when done.

## Expected outcome
Most title/meta rewrites lift click-through rate within 2–4 weeks of Google re-crawling. Realistic target: **+30–60 clicks/month** from these 6 pages, which would push you past the 80-click achievement badge.
