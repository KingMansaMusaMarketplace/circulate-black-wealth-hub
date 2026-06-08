# Pre-Launch Deep QA Plan

Goal: Catch every blocker before go-live this week. I'll run a structured sweep across backend, frontend, integrations, and UX — then deliver a prioritized report (Critical / High / Medium / Polish) with fixes proposed for your approval.

## 1. Backend Health (Supabase)
- Run the **Supabase linter** — catches missing RLS, exposed PII, bad policies, missing grants.
- **RLS audit** on every public table — confirm sensitive tables (profiles, subscribers, user_roles, apple_subscriptions, etc.) are locked down.
- **Edge function logs** review for the last 24h on critical functions:
  - `check-subscription`, `kayla-auto-discover`, `kayla-verify-and-promote`, `kayla-event-processor`, `process-workflow-schedules`, QR loyalty RPC, Stripe webhooks, email functions.
- Confirm every edge function has correct **CORS headers** (incl. `x-csrf-token`) and handles OPTIONS.
- Verify required **secrets** are present: OpenAI, Anthropic, Perplexity, ElevenLabs, Resend, Stripe, Mapbox, Shopify, Firecrawl, Slack, etc.

## 2. Auth & Roles
- Sign-up / sign-in / password reset / email confirmation flow.
- Confirm `user_roles` table is the only role source (no role-on-profile escalation risk).
- `has_role()` security-definer function present and used in policies.

## 3. Payments & Subscriptions
- Stripe `check-subscription` returning correct tier for known users.
- iOS IAP tier gating: `shouldHidePaymentForTier()` correct for `kayla_essentials`, `kayla_starter`.
- Founding slots RPC (`get_founding_slots_claimed_*`) — verify counts and limits.
- Test paid tier upgrade/downgrade UI states.

## 4. Core Features (Browser Walkthrough)
I'll drive the live preview and test each:
- **Home / 1325.AI landing** — hero, CTAs, "~4 Roles Covered", $12,100+/mo savings copy.
- **Directory & Search** — sorting, spotlight carousel, filters, fallback states.
- **QR Loyalty** — scan flow, 24h cooldown, error codes from `award_qr_scan`.
- **Kayla AI agents** — chat, voice (ElevenLabs), learning loop writes.
- **Investor Portal** (`/investor-portal`) — NDA-first gating still works.
- **Mansa Stays & Noire Rideshare** ancillary pages render.
- **Shopify store** — product list loads.
- **Mapbox** maps render and geolocate.
- **Email** — trigger a test transactional send via Resend.

## 5. Responsive & Native
- Test at 1920, 1366, 834 (tablet), 390 (mobile).
- iOS native build constraints: "Talk to Kayla" hidden on iOS, IAP tier UI correct.
- No layout breakage, no clipped CTAs, no horizontal scroll.

## 6. Performance & Console Health
- Performance profile on key routes (home, directory, dashboard).
- Console scan: zero red errors, no missing assets, no failing network calls.
- Lighthouse-style SEO check: single H1, meta description < 160, alt text, canonical.

## 7. Security Scan
- Run the security scanner.
- Review findings; flag any High/Critical for fix before launch.

## Deliverable
A single triaged report:
- **Critical (must fix before launch)** — broken flows, data leaks, payment errors.
- **High** — degraded UX, console errors users would notice.
- **Medium** — polish, copy, minor responsive issues.
- **Notes** — things already healthy, for your records.

After you approve this plan and I switch to build mode, I'll execute the sweep and come back with the report. No code changes will be made during testing unless you approve each fix — except for trivial copy/typo fixes if you want me to auto-apply those (let me know).

## What I need from you
1. **Approve the plan** to start the sweep.
2. Confirm: should I auto-fix trivial issues (typos, missing alt text, console warnings) as I find them, or list everything and wait for your go-ahead on each?
3. Any specific user flow or page you've been worried about that I should prioritize?
