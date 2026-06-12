# Competitor Tracking & Link Gap Report

Extend the existing admin Backlinks dashboard (`/admin/backlinks`) so you can track competitor domains and see exactly which sites link to them but not to you.

## What you'll be able to do

1. **Add competitors** for each of your domains (1325.ai, mansamusamarketplace.com). Up to ~5 per domain to keep Semrush API usage reasonable.
2. **See competitor snapshots** side-by-side with yours: Authority Score, total backlinks, referring domains — so you know who's ahead and by how much.
3. **Run a Link Gap report**: a ranked list of referring domains that link to one or more competitors but NOT to you. Each row shows which competitors it links to, the domain's authority score, and a "pitch priority" (high authority + links to multiple competitors = top priority).
4. **Export the gap list to CSV** so your marketing/outreach person can work it as a pitch list.
5. **Weekly auto-refresh**: the existing Monday cron will also refresh competitors and recompute the gap.

## What I'll build

### 1. Database (3 new tables, admin-only)

- `backlink_competitors` — which domains you're tracking as competitors for each of your domains (you/competitor pairing, label, active flag).
- `backlink_competitor_snapshots` — weekly snapshot of each competitor's authority score, total backlinks, referring domains (mirrors your existing `backlink_snapshots` shape).
- `backlink_gap_domains` — the computed gap list: referring domain, which competitors link to it, authority score, last seen. Recomputed on each refresh.

All three: admin-only RLS, service_role full access for the edge function.

### 2. Edge function updates

- Extend `refresh-backlinks` to also: pull each competitor's `backlinks_overview` + `backlinks_refdomains`, store snapshots, then compute the gap (referring domains that appear for ≥1 competitor and do NOT appear in your own referring domains).
- Add a small `manage-competitors` function for add/remove (admin-only).

### 3. UI: new "Competitors" tab on `/admin/backlinks`

- **Competitors panel**: list with Add/Remove, side-by-side metrics card per competitor (vs. you).
- **Link Gap table**: sortable by authority score, # of competitors linking, last seen. Filters: "links to 2+ competitors", "authority ≥ 40". CSV export button.
- **Pitch priority badge**: High (AS ≥ 50 AND links to 2+ competitors), Medium, Low — purely a visual cue, computed client-side.

### 4. Cron

The existing Monday 6am UTC cron already calls `refresh-backlinks` per domain — no new schedule needed. It will just do more work each run.

## Semrush API usage note

Each competitor refresh costs ~2 Semrush calls (overview + refdomains). 2 domains × 5 competitors × weekly = ~20 calls/week for competitor data, plus the gap computation is free (done in the edge function). Well within normal plan limits, but worth flagging.

## What I'm NOT doing in this pass

- Anchor-text gap (which anchors competitors get that you don't) — can add later.
- Automated outreach emails — out of scope; the CSV export is the handoff point.
- Historical gap trending — first version shows current state only.

## Open question

How many competitors per domain do you want to allow? I'd suggest **5 per domain** as a sensible cap (keeps the UI readable and API usage low). Say "go with 5" or give me a different number, and I'll build it.
