# Mansa Stays Beta System

Mirror the existing Business Directory beta system, scoped to Mansa Stays (the short-term rentals product at `/stays`).

## What testers experience

1. Admin invites someone by email → they receive an invite email with a unique **Stays Beta Code**.
2. They sign up (or log in) and enter the code on a "Join Stays Beta" screen.
3. Once activated, they can browse listings, book stays, message hosts, and leave feedback — for free during the beta window.
4. Non-beta users hitting `/stays` see a "Mansa Stays is in private beta — request access" landing page.

## What admins get

A new **"Stays Beta"** tab inside the existing Beta Tester Management screen (same look/feel as the current one) with:
- Invite by email (single or CSV upload)
- Resend invite / regenerate code
- Status badges: Invited · Signed Up · Active · Paused
- Per-tester metrics: days in beta, sessions, properties viewed, bookings made, messages sent, feedback submitted
- Export to CSV
- A "Feedback Inbox" sub-tab to read in-app feedback submitted from /stays

## In-app feedback widget

A small floating "Beta Feedback" button visible only to Stays beta testers on any `/stays/*` page. Opens a short form (rating + comment + optional screenshot URL) that writes to a `stays_beta_feedback` table.

## Technical section

### New tables
- `stays_beta_testers` — same shape as `beta_testers` (email, user_id, status, invite_code, invited_at, activated_at, last_active_at, total_session_minutes, active_days_count) plus stays-specific counters (`properties_viewed`, `bookings_count`, `messages_sent`).
- `stays_beta_sessions` — session start/end, mirrors `beta_tester_sessions`.
- `stays_beta_daily_activity` — daily rollup.
- `stays_beta_feedback` — rating, comment, page_url, screenshot_url, user_id, created_at.

All tables get RLS: testers can read/write their own rows; admins (via `has_role`) can read all.

### New RPC
- `activate_stays_beta_tester(p_email, p_user_id, p_code)` — validates code, links user, marks active. Called from a new "Enter Beta Code" page and optionally from signup if a code is in metadata.

### New edge functions
- `send-stays-beta-invite` — sends invite email with code (reuses Resend setup, includes `x-csrf-token` in CORS).
- `stays-beta-bulk-invite` — CSV bulk send.

### Frontend changes
- New component `src/components/admin/StaysBetaManager.tsx` (cloned from `BetaTesterManager.tsx`, adapted columns).
- New tab inside the admin Beta Tester page wrapping both managers.
- New hook `useStaysBetaTracking.ts` (clone of `useBetaTesterTracking.ts`) mounted inside the `/stays` layout only.
- New `StaysBetaGate` wrapper around the `/stays` route group — checks `stays_beta_testers.status='active'` for the current user, otherwise renders a "Request Access" page.
- New `StaysBetaFeedbackWidget` floating button on `/stays/*`.
- New page `/stays/join-beta` for code entry.

### Out of scope (confirm before adding)
- Payment bypass logic for beta bookings (free vs discounted vs normal)
- Host-side beta (separate flow for property owners)
- Auto-expiring beta access after a fixed window
