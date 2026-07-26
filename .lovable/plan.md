# Plan: Unhide Everything, Then Harden It All

## Your intent (in plain English)
You don't want anything hidden. You want **every module — Stays, Noir Rideshare, Susu, Karma, Sales Agent, Partner Portal, Corporate, etc. — visible and fully working** the way it was originally designed. Instead of shrinking the platform to reduce risk, we tighten every link, every button, every flow so nothing is broken.

## Phase A — Undo the "hide risky modules" work (nothing gets deleted)
1. Turn OFF the pre-launch hide flags in the `feature_flags` table so every module shows again:
   - `pre_launch_hide_risky_modules`, `hide_mansa_stays`, `hide_noir_rideshare`, `hide_susu`, `hide_karma`, `hide_community_finance`, `hide_sales_agent`, `hide_partner_portal`, `hide_corporate_sponsor` → all set to `false`.
2. Remove the `<FeatureGate inverted>` wrappers I added around:
   - `src/components/navbar/NavLinks.tsx`
   - `src/components/navbar/MobileMenu.tsx` (restore full menu)
   - `src/components/Footer.tsx`
   - `src/components/HomePage/VacationRentalsCTA.tsx`
   - `src/components/HomePage/NoirRideCTA.tsx`
   - `src/components/HomePage/AlsoFromStrip.tsx`
3. Remove the `<PreLaunchRoute>` wrappers from the ~100 routes in `src/App.tsx` so every page is reachable again. `PreLaunchRoute.tsx` and `ComingSoonPage.tsx` stay in the codebase (unused, ready if you ever want them) — nothing deleted.

Result: platform looks and works exactly like before I made the launch-tightening changes.

## Phase B — Full link + button audit (find what's actually broken)
Run a systematic sweep and produce a checklist:
1. **Route inventory** — list every `<Route path=...>` in `src/App.tsx` and confirm each target page exists and renders without console errors.
2. **Internal link crawl** — grep every `to="..."` and `href="/..."` across `src/`. Any link pointing to a path that isn't in the router = broken. Fix.
3. **Button audit** — every `<Button onClick>` and CTA in headers, footers, home page, directory, Kayla panels, admin, Stays, Noir, Susu, Sales Agent portals. Confirm each triggers something (nav, modal, edge function, toast) — no dead buttons.
4. **Edge function CTAs** — the Kayla / AI / MCP buttons that call edge functions: confirm each function is deployed and responds 200. Any missing function gets built or the button gets wired to a working one.
5. **Forms** — signup, business claim, contact, Susu join, Noir booking, Stays booking, Sales Agent apply. Confirm submit → DB write → success toast.
6. **Auth-gated pages** — confirm logged-out users get the sign-in prompt (not a white screen), logged-in users get the page.

## Phase C — Fix everything the audit surfaces
For each broken item, apply the smallest correct fix:
- Missing route → add it.
- Wrong path → correct the link.
- Dead button → wire it to the intended handler.
- Missing edge function → deploy it (or point button to the correct existing one).
- RLS/permission errors → add the correct policy or grant.
- Console errors → fix the underlying bug.

I'll report the audit findings and fixes in one summary at the end so you can see exactly what was wrong and what I did.

## Phase D — Confirm it still holds up
1. `bun run build` — must succeed.
2. Full Vitest suite — must stay green.
3. Playwright smoke test on the live preview: home → directory → business profile → Kayla → Stays → Noir → Susu → Sales Agent → sign in → sign up. Screenshots at each step to prove they render.
4. Supabase linter — no new security regressions from turning modules back on.

## What I need from you before I start
One quick confirmation: **"Yes, unhide everything and start the audit."** Once you say go, I'll do Phase A, B, C, and D in sequence and come back with the full report.

## Technical details (for reference)
- Feature flags toggled via a single Supabase migration (`UPDATE public.feature_flags SET enabled = false WHERE key IN (...)`).
- `PreLaunchRoute.tsx` and `ComingSoonPage.tsx` remain in the repo, unused — zero deletions.
- Audit uses `rg` for link/button discovery and a Playwright script under `/tmp/browser/` for runtime verification.
- No schema changes, no RLS loosening — hardening only strengthens things, never weakens them.
