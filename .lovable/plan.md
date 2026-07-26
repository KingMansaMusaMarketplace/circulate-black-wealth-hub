# Tighten-Up Plan for 1325.AI

This addresses the main risk: the platform is powerful but has too many moving parts to all be launch-ready at once. The plan focuses on reducing the surface area that can break, hardening the core money loop, and adding safety nets.

## Phase 1: Define the Core Loop (This Week)

Decide the single path every user must complete successfully. Everything else is secondary.

- **Proposed core loop:** Discover a business → View its profile → Contact / Subscribe / Book → Trust the result.
- **Action:** Audit every route and button in that loop with end-to-end browser tests.
- **Action:** Remove or hide every feature that is not in the core loop from the main navigation (can stay in admin/ investor portals).

## Phase 2: Feature Freeze & Risk Hide (2–3 Days)

Temporarily hide modules that are not fully wired or recently had broken-button fixes.

- **Hide candidates from public nav:**
  - Susu / community banking features
  - Noir Rideshare booking
  - Mansa Stays booking
  - Sales agent application portal
  - Enterprise / corporate dashboard
  - Some advanced Kayla tools that rely on undeployed edge functions
- **Keep them in code** so they can be re-enabled after launch; just gate them behind a feature flag or admin-only route.
- **Action:** Add a `pre_launch_hide` feature flag set and wrap those public entry points.

## Phase 3: Harden the Core Loop (3–4 Days)

- **Directory search:** Ensure search, filters, alphabet jump, and featured business cards load in under 2 seconds.
- **Business profiles:** Verify every real business record has a working image, address, and contact flow.
- **Business signup:** Route new signups to the admin review queue and stop auto-verify.
- **Payments:** Test Stripe checkout on web and Apple IAP on iOS for Essentials and Starter tiers.
- **Auth:** Verify signup, login, password reset, and iOS handoff work without dead ends.

## Phase 4: Add Monitoring & Alerts (2 Days)

- **Frontend:** Connect Sentry error tracking to capture runtime crashes and bad routes.
- **Backend:** Add a daily health check edge function that reports critical table counts, failed signups, and stuck verification-queue items.
- **Alerts:** Send a daily launch-pulse email to the admin team with top 3 issues.

## Phase 5: Create a Rollback Runbook (1 Day)

- Document how to quickly hide a broken feature via feature flag.
- Document how to revert a bad migration or deploy.
- List the 5 things that, if broken, would block launch.

## Phase 6: Final Pre-Launch Checklist (1 Day)

- Run the full Vitest suite and fix any failing tests.
- Run a broken-link scan across all public pages.
- Run a mobile-responsive check on iPhone and iPad viewports.
- Confirm the App Store build matches the live web version.
- Confirm Apple review copy and demo accounts are ready.

## Deliverables

1. Feature-flag list of hidden modules.
2. Core-loop end-to-end test report.
3. Sentry / health-check wiring.
4. Rollback runbook markdown file.
5. Pre-launch checklist document.

## What I Need From You

- Confirm the core loop I proposed, or tell me the exact 3-step user journey you want to protect.
- Confirm which public modules I should hide for launch (I can do this without deleting code).
- Confirm whether you want me to start with Phase 1 and 2, or do all phases together.

This is a large, multi-file change. I recommend doing it in phases so we can verify each step before moving on.