
# Restart Kayla Business Discovery — Accuracy First

## Why Kayla stopped adding businesses

I checked the database and logs:

- The `kayla-auto-discover` job has been running every 10 minutes, but every run for the last week+ reports **0 candidates** from Perplexity. That means the Perplexity call itself is failing/returning empty and the error is being swallowed — Kayla burns credits but adds nothing.
- There are **two duplicate cron jobs** firing the same function every 10 minutes (`kayla-auto-discover-businesses` and `kayla-auto-discover-businesses-v2`). One must go.
- When candidates *do* come through, they are written straight into `businesses` as `is_verified=true, listing_status='live'`, so any bad row is immediately public — that is what caused the wasted-credits / wrong-banner / wrong-ID pain.
- Banner images come from a generic Unsplash category pool (not the business's actual website), which is why some businesses ended up with a banner that wasn't theirs.

## Plan — 4 fixes, accuracy over volume

### 1. Stop the noise & fix the silent failure

- Drop the duplicate `kayla-auto-discover-businesses-v2` cron (keep one job, every 15 min, not 10).
- Surface Perplexity errors: when the API returns non-200, the run-log row should be marked `error` with the upstream message, not "completed: 0 candidates". This will tell us immediately whether it's a key issue, model-name issue, or quota.
- Reduce per-run search count from 75 → 25 to cut credit burn while we re-stabilize.

### 2. Add a "verification gate" — no more direct-to-live inserts

Today: Perplexity result → insert into `businesses` (live).
New flow:

```text
Perplexity → b2b_external_leads (staging)
           → Firecrawl scrape of the actual website
           → automated checks (below)
           → if all pass: promote to businesses (live)
           → if any fail: leave in staging with a "needs_review" reason
```

Automated checks Kayla must pass before promoting a row to live:

- **Website resolves** (HTTP 200, not parked/for-sale page).
- **Business name appears on the homepage** (case-insensitive substring or ≥80% fuzzy match). This kills hallucinated names.
- **Phone on the site matches the phone Perplexity gave** (last 7 digits). If mismatch, use the site's phone.
- **Address city/state matches** what Perplexity claimed.
- **Logo + banner come from the business's own domain** (or its CDN). If we can't extract them, fall back to the initials-logo + a *category* banner — never a stock photo of a different identifiable business.
- **Confidence ≥ 0.75** (raised from 0.55).

Only rows that pass all five get promoted. Everything else stays in staging for an admin review screen.

### 3. Stronger duplicate detection

Current dedup is exact `name|city`. We'll add:

- Normalize names (strip "LLC", "Inc.", "The", punctuation, lowercase) before comparing.
- Compare against `businesses` AND `b2b_external_leads` AND any pending staging row.
- Add a unique index on `(normalized_name, lower(city), lower(state))` so a duplicate insert fails at the DB level too — belt and suspenders.
- Domain-level dedup: if the website root domain already exists in the directory, skip.

### 4. Admin review queue (small UI)

A new page at `/admin/business-review` (admin-only) showing:

- Businesses Kayla flagged as `needs_review` with the reason (e.g. "name not found on homepage", "phone mismatch").
- Side-by-side: what Perplexity said vs. what Firecrawl found on the site, plus a screenshot/preview of the homepage.
- One-click **Approve & Publish**, **Edit & Publish**, or **Reject**.

This is the safety net — anything Kayla isn't 100% sure of waits here instead of going live and getting deleted later.

## Technical details

- Edit `supabase/functions/kayla-auto-discover/index.ts`:
  - Replace direct `businesses.insert(...)` with `b2b_external_leads.insert(...)` plus a new column `verification_status` ('pending' | 'verified' | 'needs_review' | 'rejected').
  - Wrap Perplexity call in proper error reporting to `kayla_run_log`.
  - Lower `NUM_SEARCHES` to 25, raise `MIN_CONFIDENCE` to 0.75.
- New edge function `kayla-verify-and-promote` (cron every 15 min, offset 5 min):
  - Pulls up to 50 `pending` leads, runs the 5 checks above using Firecrawl, sets `verification_status` accordingly, and promotes verified ones into `businesses`.
- Migration:
  - Add `verification_status` + `verification_notes` + `normalized_name` columns to `b2b_external_leads`.
  - Add unique index on `(lower(normalized_name), lower(city), lower(state))` on both `b2b_external_leads` and `businesses`.
  - Drop the duplicate cron job `kayla-auto-discover-businesses-v2`; update the surviving one to `*/15 * * * *`.
- New page `src/pages/admin/BusinessReviewQueue.tsx` (gated by `RequireAdmin`) + route + nav link in the admin dashboard.

## What you'll see after this lands

- Kayla resumes adding businesses, slower but accurate (target ~30–60 verified/day instead of bursts of bad data).
- A live counter on the admin dashboard: "X pending review, Y verified today, Z rejected".
- No more banners belonging to other companies, no more hallucinated business IDs in the live directory.
- If Perplexity is failing, you'll see it in the run-log immediately instead of silent zeros.

## Out of scope for this round

- Re-importing the deleted ~14K businesses (we should re-discover them through the new gated pipeline so they're verified the same way).
- Switching discovery away from Perplexity (we'll first see if proper error reporting fixes it; if Perplexity is the problem, a follow-up plan will swap in Google Places / SerpAPI).
