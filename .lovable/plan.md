# Plan: "Powered by 1325.AI" Embeddable Search Widget

## The Big Idea (Plain English)

We give any other Black business directory a tiny piece of code (2 lines) they paste into their website. Once pasted, a search box appears on **their** site. When their visitors type in it — "hair salon near Atlanta", "Black-owned coffee shop" — the search is powered by our AI and shows results from **our** 1325.AI directory.

Every result has:
- A "Powered by 1325.AI" badge
- A "See more on 1325.AI" button that sends the visitor to our site

**Why the directory owner says yes:** their site instantly gets AI search they never had to build. Their visitors get more value. They look smarter.

**Why we win:** every partner site becomes a funnel that sends their users to us. We track which partner sent which visitor, so we can show them "you sent us 400 users this month" — building goodwill and data.

---

## What Gets Built (4 pieces)

### 1. The Widget (what partners embed)
A tiny standalone JavaScript file hosted at `https://1325.ai/widget.js`. Partners paste this into their site:

```html
<div id="mansa-search" data-partner="eatokra"></div>
<script src="https://1325.ai/widget.js"></script>
```

That's it. A branded search box appears, styled to blend into their site (light/dark mode, custom accent color optional).

### 2. The Widget Backend (an API endpoint)
A new Supabase edge function `widget-search` that:
- Accepts search queries from partner sites
- Runs them through our existing AI search (reuses `parse-search-query` + `search_public_businesses`)
- Returns results as clean JSON
- Records which partner sent the query (for analytics)
- Rate-limits abuse

### 3. Partner Portal (a new admin page on 1325.AI)
A page at `/partners/widget` where a directory owner can:
- Sign up for a free partner account
- Get their unique partner ID (e.g., `eatokra`, `officialbws`)
- Copy their embed code
- See a dashboard: searches this month, clicks to 1325.AI, top search terms
- Optionally customize colors and logo

### 4. Attribution + Conversion Tracking
When a widget user clicks "See more on 1325.AI", we tag the link with `?ref=eatokra`. If they sign up or claim a business later, we credit the partner. This lets us later offer revenue share or affiliate rewards to top partners.

---

## Rollout Plan (What Happens When)

**Phase 1 — Minimum Viable Widget (fastest path to test the idea)**
- Build the widget file + backend endpoint
- No partner portal yet — we manually give the first 3 partners their embed code
- Target: Support Black Owned, ByBlack, one regional directory from the spreadsheet
- Goal: prove partners will actually embed it

**Phase 2 — Self-Serve Partner Portal**
- Public signup page at `/partners/widget`
- Self-serve dashboard with analytics
- Automated onboarding email with embed code

**Phase 3 — Scale + Monetize**
- Revenue share for top partners (they earn when their referred users convert to paid)
- White-label version (partner's own branding, small fee)
- Data partnership tier (listings sync both ways)

---

## Technical Details (for the record — skip if not technical)

- **Widget file:** vanilla JavaScript, ~15 KB, no framework dependencies, mounts inside a Shadow DOM so it never conflicts with the partner site's CSS
- **Backend:** new Supabase edge function `widget-search`; reuses `parse-search-query` and the existing `search_public_businesses` RPC
- **Auth:** partners get a public `partner_id` (safe in browser code) + a secret `partner_key` used only for dashboard access
- **New tables:** `widget_partners`, `widget_search_events`, `widget_referrals`
- **CORS:** endpoint must allow requests from any origin (partner sites won't be on our domain), rate-limited per partner
- **Attribution:** UTM-style `?ref=<partner_id>` on outbound links; cookie set for 30 days
- **Analytics:** aggregate daily via a scheduled function; surface in partner dashboard + our admin

---

## What You'd Need to Do (Your Homework)

Nothing yet — I just need your green light. Once you approve:

1. **You pick the first 3 partner directories** to pitch (from your spreadsheet). I'd suggest 1 big national + 1 regional + 1 niche.
2. **I build Phase 1** (widget + backend endpoint) — probably 1 build session.
3. **You send outreach emails** to those 3 partners with the embed code. I can draft the emails.
4. We watch what happens for 2 weeks, then decide whether to build the self-serve portal (Phase 2).

---

## What This Plan Does *Not* Include

- Actually reaching out to partners (that's your relationship-building)
- White-label version (that's Phase 3)
- Two-way data sync / listings import (separate future project)
- Paid tier for partners (Phase 3)

---

## Approve to build Phase 1?

If yes, I'll build the widget, the backend endpoint, and give you a working embed code you can paste into any test site to demo — all in the next session.