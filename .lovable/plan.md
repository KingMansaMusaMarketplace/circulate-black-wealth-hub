## Goal
Produce **`1325AI_Complete_Platform_Manual_v20.pdf`** that is **≥ 81 pages** (matching v18's depth) AND includes all v19 corrections. No content regression, no factual regression.

## Root cause
v19 was rebuilt from a fresh outline instead of patching v18, so ~30 pages of detail were silently dropped (agent profiles, patent section, investor portal, security appendix, ancillary services, ROI worksheets, glossary, etc.).

## Steps

1. **Diff v18 vs v19 to find what's missing**
   - Extract full text of both with `pdftotext -layout`
   - Build a section-by-section inventory of v18
   - Mark every section as: (a) present & correct in v19, (b) present but stale in v19, (c) **missing from v19**
   - Save the inventory to `/tmp/manual_diff_v18_v19.md` for reference

2. **Build v20 by starting from v18's full outline**, then applying ONLY these surgical edits:
   - Replace every "28 agents" → **"33 AI employees"**
   - Replace every "FTEs Replaced" / dollar-range ROI → **"~4 Roles Covered" + "$12,100+/mo savings"**
   - Replace pricing section with the **full 4-tier ladder** (Essentials $19 · Starter $79 · Pro $299 · Enterprise from $899 + $50/user) and **Founders' Lock $149/mo for first 100** under Pro
   - Add the **multi-model orchestration** callout (Claude Opus 4.6 + GPT-5 + Gemini via Lovable AI Gateway) — both in the tech-stack section and the executive summary
   - Rebuild the **Table of Contents** cleanly (no corrupt dot-leader artifacts)
   - Ensure **1325.AI** is the lead brand throughout; "Mansa Musa Marketplace, Inc." only in legal/parent-company contexts

3. **Preserve all v18 sections verbatim where unaffected by the 5 edits above**, including:
   - Full 33-agent roster with role descriptions
   - Patent / IP detail (USPTO 63/969,202, IL law)
   - Investor portal + NDA-first flow
   - QR loyalty pipeline (atomic award_qr_scan RPC, 24h cooldown)
   - Security & compliance appendix (CSRF, RLS, edge function rules)
   - Ancillary services (Mansa Stays, Noire Rideshare)
   - ROI worksheets and case examples
   - Glossary / appendix

4. **Mandatory QA before delivery**
   - Confirm `pdfinfo` page count is **≥ 81**
   - `pdftoppm -jpeg -r 150` and inspect: cover, ToC, every section header, pricing page, agent roster, appendix
   - `pdftotext` grep checks: zero hits for "28 agents", "FTEs Replaced"; expected hits for "33 AI employees", "$12,100", "Founders' Lock", "$149", "$899", "Claude Opus 4.6", "GPT-5", "Gemini"
   - Re-render and re-check until all gates pass

5. **Deliver** v20 as a `<lov-artifact>` with a short changelog vs v19 (what was restored) and vs v18 (what was corrected).

## Technical notes
- Generation script: `/tmp/manual_v20.py` using `reportlab.platypus`
- Brand palette: Navy `#003366`, Gold `#FFB300`
- Keep v19 around — do not overwrite
- If section text needs to be lifted from v18, extract via `pdftotext -layout` and reflow into Paragraph flowables (don't try to merge PDF pages directly — formatting will drift)
