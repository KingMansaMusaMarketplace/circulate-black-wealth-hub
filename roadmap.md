# Roadmap

## Scheduled

- [ ] **Mon Sep 7, 2026 — Build Craig L. Stevenson memorial.** Approved plan archived at `.lovable/plan/memorial-for-craig-l-stevenson-2026-09-04.md`.
  - Waiting on Thomas: tribute text, a quote from Craig (optional), his birth date, any extra photos, and whether the Resolution PDF should be public.
  - Photo already removed from `/team`; files saved at `src/assets/team/navy_bg/Craig_Stevenson.jpg`.

## Done

- [x] Removed Craig Stevenson from the Team page and preserved his photo assets (Sep 4, 2026).
- [x] **Genius-level intelligence upgrade (Sep 17, 2026)** — all five approved workstreams:
  1. Live lookups before answering (`_shared/kayla-grounding.ts`, wired into `ai-chat` and `ai-chat-orchestrator`).
  2. Premium reasoning brain + self-review on the money reports (`_shared/kayla-deep.ts`; credit-readiness, cash-flow, tax-prep, investment-readiness).
  3. Scoreboard: `kayla-benchmark` function, 15 seeded test questions, admin page at `/admin/kayla-scoreboard`.
  4. Nightly lesson review: `kayla-learning-review`, cron `kayla-learning-review-nightly` at 07:30 UTC.
  5. One shared brand/pricing source across every agent (`buildAgentBrandBlock`).
