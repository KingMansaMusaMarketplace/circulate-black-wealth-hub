# Roadmap

## Clinical safety panel — approved presentation scope
- [x] Add a shared advisory panel with fictional source-linked gaps, unperformed safety checks and physician-review boundaries; preserve colors and existing service locks.
- [x] Run focused safety/regression checks: 23 tests pass, build OK, and both clinical routes hide the private controls from unapproved visitors with no runtime errors.
- [ ] Verify approved visitor and signed-in clinic panel use — blocked: external Supabase has no managed authenticated test session.

## Clinical executive quality overview — approved presentation scope
- [x] Add a shared executive overview with existing fictional source evidence, unknown performance results and locked healthcare services; preserve clinical colors and facility-only presentation. Replaces the demo-only invented quality scores.
- [x] Run focused safety/regression checks: 20 tests pass, build OK, and public access gate hides the overview with no runtime errors.
- [ ] Verify approved visitor and signed-in clinic overview navigation — blocked: external Supabase has no managed authenticated test session.

## Clinical facility selector — approved presentation scope
- [x] Add shared fictional practice/hospital facility and department selection in demo/workspace without changing colors, clinic access or live-service locks. Locations are illustrative, not connected hospital facilities.
- [x] Verify selection/reset behavior and existing safety regressions: 19 tests pass, build OK, and public access gate hides the selector.
- [ ] Verify approved visitor and signed-in clinic viewing — blocked: external Supabase has no managed authenticated test session.

## Full clinical roadmap — approved staged scope
- [x] Connected fictional doctor-day: one selected case across schedule rehearsal, chart prep, transcript, existing clinic note decisions and independently unapproved follow-up; 35 targeted/regression tests pass, build OK, public access gate verified.
- [ ] Verify doctor-day note generation, signed decision and readback in an approved signed-in clinic — blocked: external Supabase has no managed authenticated test session; no bypass added.
- [x] Expanded fictional chart — exact historical excerpts, unknown demographics/allergies/reconciliation, planned versus received results, original transcript and honest undated source baseline; shared demo/workspace and Doctor Day. 32 focused/regression tests pass, build OK, public gate verified.
- [ ] Actual saved chart-change history — blocked: approved persistent clinical audit design and healthcare environment; no fabricated edits, actors or timestamps added.
- [ ] Verify expanded chart in an approved visitor and signed-in clinic session — blocked: external Supabase has no managed authenticated test session; no access bypass added.
- [x] Fictional medication-review assistance — shared demo/workspace, exact medicine references and documentation gaps; unknown allergies, unperformed interaction/dose screening and locked prescribing/signature/export/delivery; 24 targeted/regression tests pass.
- [ ] Verify medication-review assistance in an approved visitor and signed-in clinic — blocked: external Supabase has no managed authenticated test session; no bypass added.
- [ ] Live clinical assistance and medication safety — blocked: qualified clinical validation, approved drug knowledge provider and healthcare clearance required.
- [x] Clinical connection preparation — shared laboratory/pharmacy/record-system requirements and illustrative mappings; no fabricated imports, provider partnerships or live exchange, and all exchange actions remain locked.
- [ ] Verify connection preparation in approved visitor and signed-in clinic — blocked: external Supabase has no managed authenticated test session; no access bypass added.
- [ ] Live laboratory, pharmacy and record-system connections — blocked: approved providers, agreements, credentials, healthcare clearance and provider-specific validation required.
- [x] Fictional patient communication portal — shared source excerpts, bilingual unapproved care guides and unscheduled follow-up preparation; no patient input or live delivery. 16 targeted/regression tests pass, build OK; public access gate verified.
- [ ] Verify patient communication in approved visitor and signed-in clinic — blocked: external Supabase has no managed authenticated test session; no bypass added.
- [ ] Secure patient communication — blocked for live use by healthcare clearance, approved providers and consent review.
- [x] Fictional billing preparation — shared documentation evidence, unknown coverage/claim/payment statuses and locked submission/collection/export; 17 targeted/regression tests pass, build OK and public access gate verified.
- [ ] Verify billing preparation in approved visitor and signed-in clinic — blocked: external Supabase has no managed authenticated test session; no bypass added.
- [ ] Live billing operations — blocked: healthcare clearance, qualified billing review and approved eligibility/claims/payment providers.
- [x] Backup, recovery and clinic-migration preparation — shared read-only requirements, unknown operational evidence and locked execution; 17 targeted/regression checks pass, build OK and public access gate verified.
- [ ] Verify operations preparation in approved visitor and signed-in clinic — blocked: external Supabase has no managed authenticated test session; no bypass added.
- [ ] Live enterprise operations, recovery and migration — blocked: approved healthcare infrastructure, provider agreements and independently witnessed backup, restore and migration validation.
- [x] Fictional doctor evaluation preparation — shared criteria, original transcripts and unsaved structured observations; 16 targeted/regression checks pass, build OK and public access gate verified.
- [ ] Verify doctor evaluation in approved visitor and signed-in clinic — blocked: external Supabase has no managed authenticated test session; no bypass added.
- [ ] Live doctor pilot evaluation — blocked by approved healthcare environment, agreements, study protocol, qualified review and participating clinics.
- [ ] Healthcare clearance — blocked by attorney-approved agreements, written vendor coverage and independently verified safeguards.

## Clinical executive additions — one at a time
- [x] 1. Guided executive walkthrough: four manual stops in demo and clinic workspace; 12 targeted tests pass and unapproved visitors remain locked out.
- [ ] Verify walkthrough in an approved visitor and signed-in clinic session — blocked: external Supabase provides no authenticated test session; no access bypass added.
- [x] 2. Fictional prior-authorization packet draft — shared demo/workspace screen; exact source excerpts, unsaved review rehearsal, locked signature/export/sending; 10 targeted tests pass and access gate remains locked.
- [ ] Verify authorization packet in an approved visitor and signed-in clinic session — blocked: external Supabase provides no authenticated test session; no access bypass added.
- [x] 3. Practice impact calculator — blank visitor inputs, transparent time/value calculations, no promised savings or pricing; 13 targeted tests pass and unapproved visitors remain locked out.
- [ ] Verify calculator in an approved visitor and signed-in clinic session — blocked: external Supabase provides no authenticated test session; no access bypass added.
- [x] 4. Specialty-specific fictional examples — shared read-only Primary Care, Orthopedics and Cardiology screen; existing primary care/knee sources and a separate clearly fictional cardiology rehearsal; 9 specialty tests pass (15 with tour/private-session regressions), build OK; unapproved visitors see only the access request.
- [ ] Verify specialty examples in an approved visitor and signed-in clinic session — blocked: external Supabase provides no authenticated test session; no access bypass added.
- [x] 5. Enterprise readiness drawer — shared demo/workspace panel; sample evaluation available, legal/vendor clearance unverified, pilot not activated; existing upload/call locks unchanged. Five readiness tests and 15 regression tests pass; build OK; unapproved visitors remain gated.
- [ ] Verify readiness drawer in an approved visitor and signed-in clinic session — blocked: external Supabase provides no authenticated test session; no access bypass added.

## Clinical private-session exit
- [x] Add shared left-panel exit, small-screen equivalent, persistent screen lock, and preserved approval/device binding.
- [x] Verify persistent lock screen in the live preview and approval/device preservation in two passing tests.
- [ ] Verify approved visitor click/sign-out/resume end-to-end — blocked: external Supabase has no authenticated visitor test session.

## Clinical invitation delivery
- [x] Add plain-text invitation, simpler wording, consistent reply-to, and Spam/Junk guidance after access requests.
- [ ] Confirm inbox placement with recipient mailboxes — cannot guarantee placement or access recipient mailbox settings.

## Five clinical additions — sequential delivery
- [x] 1. Pre-Visit Chart Prep: fixed fictional prior-visit excerpts, clickable sources, missing-information flags, no real-record intake.
- [ ] Verify chart prep inside a signed-in clinic — blocked: external Supabase provides no authenticated test session.
- [x] 2. Medical chronology timeline — fixed fictional case, dated events, undated index, source viewer, gap/conflict flags and record-type filters.
- [ ] Verify chronology inside a signed-in clinic — blocked: external Supabase provides no authenticated test session.
- [x] 3. Plain-language patient care guide — fixed English/Spanish fictional plans, source links, missing-instruction flags, unapproved drafts, no patient delivery.
- [ ] Verify care guide inside a signed-in clinic — blocked: external Supabase provides no authenticated test session.
- [x] 4. Billing completeness check — follows care guide review.
- [x] 5. Doctor-reviewed PDF report export — follows billing review.

## Clinical record review first
- [x] Connect signed-in clinic creation to saved clinic readback, email-confirmation state and account-safe workspace loading; 14 focused tests passed and build checks succeeded.
- [ ] Verify new clinic account creation end-to-end — blocked: preview still serves the previous sign-in form after explicit source reads; authenticated testing and hosted sign-in settings checks unavailable for external Supabase.
- [x] Build clinic-only CME upload screen, saved fictional file statuses, source-linked drafts and doctor review; uploads locked. All 27 targeted clinical tests passed.
- [ ] Verify CME screen navigation and clinic access — blocked: preview still serves older source (/health/intake returns 404); authenticated end-to-end checks unavailable for external Supabase.
- [x] Add clinic intake, existing account/clinic registration and locked BAA/CME upload stages.
- [ ] Verify intake navigation and authenticated clinic signup end-to-end — blocked: live preview still serves old routes; external Supabase has no available authenticated test session.
- [ ] Enable agreement and CME uploads — blocked: attorney-approved agreement, confirmed vendor coverage and independently verified dedicated healthcare environment.
- [x] Add clinic BAA preparation page on health.1325.ai; signing unavailable without an attorney-approved agreement.
- [ ] Verify BAA page navigation in the live preview — blocked: preview continues serving older clinical files despite saved changes and successful build checks.
- [ ] Enable clinic BAA signing — blocked: attorney-approved agreement and confirmed vendor coverage not supplied.
- [x] Build a locked real-record pilot readiness request with metadata-only checklist, server-enforced data block, and safety tests.
- [ ] Verify signed-in pilot submission, stored requester identity and cross-clinic denial — blocked: external Supabase has no available authenticated test session.
- [ ] Activate real-record processing in a dedicated approved healthcare environment — blocked: attorney review, signed clinic/vendor agreements and independently verified safeguards.
- [x] Build a server-owned fictional CME case with page-linked Kayla drafts and source viewer.
- [x] Save physician review decisions with clinic-scoped access; block arbitrary record uploads.
- [x] Run targeted safety tests and verify available public screens.
- [ ] Verify signed-in generation, source readback, review decisions and Kayla scoreboard — blocked: external Supabase has no test session available.
- [ ] Enable real records and patient calls — blocked: healthcare attorney/vendor clearance, HIPAA safeguards and calling consent approval.

## Scheduled

- [ ] **Platform Manual v67 full rewrite (Oct 5, 2026)** — delivered in parts to /mnt/documents, then combined. Generator in /tmp/man (lib.py + partN.py).
  - [x] Part 1: Front matter + Executive Summary
  - [x] Parts 2–4 (Market, Architecture, 42 Agents)
  - [x] Parts 5–7 (Owners, Directory, Shoppers)
  - [x] Parts 8–10 (Marketplace, AI distribution, Pricing)
  - [x] Parts 11–13 (Partners, Admin, Security)
  - [x] Parts 14–15 (iPhone, Go-to-Market)
  - [x] Parts 16–17 (Series A $10–20M; Team + Craig memorial)
  - [x] Appendices A–E + combined PDF (66 pages)
  - Pro confirmed $299 (Oct 5); app + Stripe switched to $299 (new price; old $249 subscribers kept)
- [ ] Claim-your-business invites stopped Sep 29 — investigate (awaiting user go)

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

- [ ] Instagram @thirteentwentyfive.ai setup (profile, posts, link on site)

## Manual expansion to 180+ pages (in parts)
- [x] Part 4B: Agentic AI Employee Handbook (43 pages, one per employee)
- [x] Part 18 Step-by-step guides (38 pages, 45 guides)
- [x] Part 19 Website in pictures (20 pages). Website mismatches found: Kayla page 6 depts/$20,450/68x vs manual; /developers Coming Soon; /business-signup opens Kayla page; sales signup needs login
- [ ] Investor & market detail (confirmed numbers only)
- [x] Recombine into one 174-page book
- [ ] Check first automatic claim invite run (daily 9am Chicago) worked
- [x] Roster switched to Meet Kayla page (6 depts, $20,450/mo, 68x); website $18,000 -> $20,450 (12 spots); capital E fixed
- [x] Recombine into one 174-page book
- [x] Nationwide claim campaign started: 200\/day, daily 9am Chicago

- [ ] Dr. Atwater clinical dossier PDF
- [x] health.1325.ai tour at /health + working sample-only workspace at /health/app (sign-in, charts, schedule, Kayla record review, prior auth, billing, team)
- [ ] Test the workspace signed in (Thomas) with the built-in fictional CME case — external Supabase test session unavailable; arbitrary uploads intentionally blocked.

- [x] Clinical AI note-taking on fictional sample visits (doctor sign-off; live recording locked)
