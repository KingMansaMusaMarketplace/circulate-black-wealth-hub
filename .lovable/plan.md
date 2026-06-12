
🛡️ BOARD CHECK
- Scope: New admin-only feature (internal SEO tool). No public copy, no pricing, no brand changes.
- IP/Investor risk: None — internal dashboard.
- Cost: Uses your Semrush subscription's API quota. Each weekly snapshot = ~2 API calls per domain tracked.
- Recommend: Approve. Low risk, high strategic value (link-building roadmap from earlier conversation).

---

## What you'll get

A **Backlinks** page under the Admin area that shows, for your domains (1325.ai and mansamusamarketplace.com):

1. **Headline numbers** — Authority Score, total backlinks, referring domains, follow/nofollow split
2. **Top referring domains** — who's already linking to you, with their authority score
3. **Anchor text breakdown** — what words people use when linking
4. **Growth over time** — a line chart of referring domains week-over-week (built up automatically as snapshots accumulate)
5. **New this week** — referring domains that appeared since the last snapshot

## How it works (plain English)

- You connect your Semrush account once.
- A button "Refresh now" pulls fresh data from Semrush.
- A weekly background job automatically saves a snapshot every Monday so the trend chart fills in over time.
- Everything is stored in your database, so the dashboard loads instantly without burning API calls on every visit.

## Build steps

1. **Connect Semrush** — trigger the connector modal so you can authorize your Semrush account.
2. **Database** — 3 new admin-only tables:
   - `backlink_snapshots` — weekly headline metrics per domain
   - `referring_domains` — list of domains linking to you, per snapshot
   - `backlink_anchors` — anchor text distribution, per snapshot
   All locked down to admin role via RLS (Row-Level Security = database access rules).
3. **Edge function** `refresh-backlinks` — calls Semrush via the connector gateway, writes a new snapshot. Callable from the UI button and from a weekly cron job.
4. **Weekly cron** — runs every Monday 6am UTC to capture a snapshot automatically.
5. **UI** — `/admin/backlinks` route with:
   - Domain switcher (1325.ai / mansamusamarketplace.com)
   - 4 metric cards up top
   - Growth line chart (Recharts, already in the project)
   - Two tables: top referring domains, top anchor texts
   - "New since last snapshot" callout

## Technical notes

- Semrush methods used: `backlinks_overview`, `backlinks_refdomains`, `backlinks_anchors`, `domain_ranks` (for Authority Score). All within the connector's granted scopes.
- Gateway calls go through `https://connector-gateway.lovable.dev/semrush/...` from the edge function with `LOVABLE_API_KEY` + `SEMRUSH_API_KEY`.
- "New this week" computed by diffing latest two snapshots in `referring_domains`.
- Access: gated by `has_role(auth.uid(), 'admin')`. Non-admins get a 403 from both the page and the edge function.
- No new dependencies — Recharts and shadcn/ui already in the project.

## What I need from you after approval

1. Click **Connect** when the Semrush modal appears.
2. That's it — everything else is automatic. First snapshot runs immediately after connection.

## Out of scope (can add later)

- Competitor tracking
- Target/outreach watchlist with status pipeline
- Investor portal view
- Email alerts when new high-authority links appear

Reply **go** to build it.
