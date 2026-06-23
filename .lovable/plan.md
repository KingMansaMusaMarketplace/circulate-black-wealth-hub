# Atwater Master Packet — One PDF, More Detail

Build a single, polished PDF (`Atwater_OSA_Master_Packet.pdf`) that Dr. Atwater can read end-to-end, with deeper detail on exactly what 1325.AI / Kayla will do for Ortho-Spine Care.

## Structure (one PDF, tabbed sections with a table of contents)

1. **Cover page** — "Ortho-Spine Care of Atlanta — AI Office Automation Proposal", prepared for John Atwater, MD, by Thomas D. Bowling, 1325.AI. Date, version, confidentiality note.
2. **Executive summary (1 page)** — what we're doing, what it costs, what it saves (~$18K+/mo, ~4 roles covered), what stays human.
3. **What stays human (clinical boundary)** — explicit list: diagnosis, treatment decisions, prescriptions, lab/imaging orders, surgical planning, insurance claim adjudication, anything requiring a license.
4. **Tier 1 — Full Office Automation (detailed)** — expand the existing plan with per-function detail:
   - Front desk: inbound/outbound calls, voicemail triage, new-patient intake scripts, insurance pre-check questions
   - Scheduling: new vs. follow-up rules, MRI/PT coordination, surgical consult slots, no-show backfill
   - Reminders & recalls: SMS/email cadence, post-op check-ins, annual recall lists
   - Patient FAQs: pre-op instructions, post-op care, billing questions (scripted, non-clinical)
   - Reputation: review requests, response drafts for staff approval
   - Reporting: weekly ops digest to Dr. Atwater
   - Pricing: ~$19,500/mo, comped
5. **Tier 2 — Upgrade Path (detailed)** — PHI-aware features unlocked by signed BAA: EHR-integrated scheduling, chart-aware reminders, pre-visit intake forms, refill request routing (to staff, not auto-filled), referral coordination. Pricing: ~$32K–$38K/mo, comped.
6. **BAA cover letter** — the v4 letter, inline as a section (not a separate file).
7. **Implementation plan** — week-by-week: Week 1 kickoff & EHR discovery, Week 2 phone/SMS cutover, Week 3 reminders/recalls live, Week 4 reporting + review loop.
8. **What we need from Dr. Atwater** — login email, EHR/EMR name, 30-min onboarding call, signed BAA (for Tier 2).
9. **Signature block & contact** — Thomas D. Bowling, Founder & CEO, Mansa Musa Marketplace, Inc. / 1325.AI · Thomas@1325.AI · 1325.ai

## Detail depth

Yes — go deeper. Current PDFs are high-level. For a physician evaluating handing over his front office, he needs to see the exact scripts, escalation rules, and human-in-the-loop checkpoints. I'll add a "How Kayla handles X" mini-playbook for each major function (5–8 short bullets each) so John can picture day one.

## Build approach (technical)

- New script `/tmp/build_master_packet.py` using ReportLab Platypus (TOC, section headers, page numbers, MansaBlue/MansaGold accents matching brand).
- Output to `/mnt/documents/Atwater_OSA_Master_Packet.pdf`.
- QA: render every page to JPEG at 150dpi, inspect for overflow/clipping/black-box glyphs, fix, re-run until clean.
- Old individual PDFs stay in place; this is additive.

## Open question before I build

Want me to also include a **one-page pricing comparison table** (Tier 1 vs Tier 2 vs "hire 4 staff") showing the $18K+/mo savings visually? It's the kind of page physicians screenshot and forward to their practice manager.
