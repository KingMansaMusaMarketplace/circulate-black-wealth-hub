# Roadmap

## Scheduled

- [ ] **Mon Sep 7, 2026 — Build Craig L. Stevenson memorial.** Approved plan archived at `.lovable/plan/memorial-for-craig-l-stevenson-2026-09-04.md`.
  - Waiting on Thomas: tribute text, a quote from Craig (optional), his birth date, any extra photos, and whether the Resolution PDF should be public.
  - Photo already removed from `/team`; files saved at `src/assets/team/navy_bg/Craig_Stevenson.jpg`.
- [ ] **Director's Cut video re-render (Sep 18, 2026).** On-screen text updated in `remotion/src/DirectorsCutVideo.tsx` (42 Agentic AI Employees, 47,000+ businesses, plans from $19/mo).
  - Blocked: stored ElevenLabs key is a key ID, not a valid `sk_` key, so the "33 agents" narration line (`public/audio/dc/s4-agents.mp3`) cannot be re-recorded. Need an ElevenLabs connection or a valid key, then re-record s4 + s6 and run `node scripts/render-dc.mjs`.
- [x] **Outreach email to John Boyd Jr. (National Black Farmers Association)** — drafted Sep 18, 2026.


## Done

- [x] Removed Craig Stevenson from the Team page and preserved his photo assets (Sep 4, 2026).
- [x] **Genius-level intelligence upgrade (Sep 17, 2026)** — all five approved workstreams:
  1. Live lookups before answering (`_shared/kayla-grounding.ts`, wired into `ai-chat` and `ai-chat-orchestrator`).
  2. Premium reasoning brain + self-review on the money reports (`_shared/kayla-deep.ts`; credit-readiness, cash-flow, tax-prep, investment-readiness).
  3. Scoreboard: `kayla-benchmark` function, 15 seeded test questions, admin page at `/admin/kayla-scoreboard`.
  4. Nightly lesson review: `kayla-learning-review`, cron `kayla-learning-review-nightly` at 07:30 UTC.
  5. One shared brand/pricing source across every agent (`buildAgentBrandBlock`).

- [x] Talk to Kayla by voice (microphone) in the shopping assistant
- [x] Kayla speaks each sentence as she writes it; skip the directory lookup for non-business questions
- [x] Spoken questions in the shopping assistant always receive a spoken Kayla reply
- [x] Keep Kayla's audio player unlocked after microphone/send taps so automatic replies are not blocked by the browser
- [ ] Confirm Kayla's spoken voice sounds human (Marin) after signing in
