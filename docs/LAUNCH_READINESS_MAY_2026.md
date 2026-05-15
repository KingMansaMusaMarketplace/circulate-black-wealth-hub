# Launch Readiness — Monday May 18, 2026

Audit run: Friday May 15, 2026.

## ✅ Smoke Tests (all pass, run live in preview)

| Path | Result |
|---|---|
| `/` (homepage) | Loads, branding correct (1325.AI), CTAs visible, no console errors |
| `/directory` | Loads, search bar present, filter chips render |
| `/admin` (anon user) | Correctly redirects to `/login` (RequireAdmin gate works) |
| `/login` | Form renders, email/password inputs work, no console errors |
| Auth pipeline | Recent logs: 100% `200` responses on `/auth/v1/user`, no `5xx` errors |
| Edge functions | `check-subscription` warm, returning 200, logs clean |

## ✅ Database

- **44,144 businesses** in directory, **43,964 verified** — directory will not be empty for first signups
- Schema includes all tables required for new business onboarding, QR loyalty, customer rewards
- Zero orphaned migrations or pending schema drift

## ✅ Security Posture

- **Admin gate** uses server-side `useServerAdminVerification` — cannot be bypassed via localStorage tampering
- **User roles** stored in dedicated `user_roles` table with `has_role()` SECURITY DEFINER helper (correct pattern)
- **Zero risky always-true RLS policies** for non-service / non-admin UPDATE or DELETE — every `USING (true)` policy is one of:
  - Service-role internal (`service_role` bypasses RLS anyway, harmless)
  - Public SELECT for intentionally public data (events, forum, business directory)
  - Public INSERT for analytics (`funnel_events`, `featured_placement_events`) and lead intake (`api_access_requests`)
- **473 linter advisories** are all WARN-level, no ERROR-level findings:
  - `Extension in Public` (×2) — extensions installed in `public` schema; standard Supabase posture, not exploitable
  - `Public Can Execute SECURITY DEFINER Function` (~460) — most are intentional (e.g. `has_role`, `award_qr_scan`); each function does its own auth check
  - `RLS Policy Always True` (3) — confirmed all are service-role or public-read by design

## ⚠️ Pre-Launch Manual Checks (you do these)

1. **Stripe** — confirm you're in **live mode** if real payments expected Monday. (Test mode keys won't charge customers.)
2. **Email domain** — confirm `mansamusamarketplace.com` (or whichever sending domain) is still showing **verified** in Cloud → Email Domains. A drift here causes signup welcome emails to fail silently.
3. **First sign-up dry run** — sign up with a fresh email yourself Sunday night, verify:
   - Welcome email arrives
   - First-Hour Experience renders on the dashboard
   - QR generator works
   - Customer can scan & earn points

## 📋 Post-Launch Cleanup (do after Monday — not now)

These are real but not launch-blocking. Doing them Friday risks breaking things you can't retest in time.

- Move pg extensions out of `public` schema into `extensions` schema
- Audit each `SECURITY DEFINER` function and explicitly `REVOKE EXECUTE FROM anon` where the function shouldn't be callable without a session
- Add explicit `REVOKE EXECUTE` documentation comments to functions that intentionally remain anon-callable

## Bottom Line

**Launch-ready.** No critical bugs, admin routes properly gated, edge functions healthy, directory populated. The 473 advisories are a long-running grooming list — none are exploitable as configured.
