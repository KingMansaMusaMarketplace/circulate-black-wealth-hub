# Unicorn Dossier v13 — Cooley LLP Edition

**Recipient:** Mr. Bobby Earles, Cooley LLP (https://www.cooley.com/) — a top-tier law firm that counsels emerging companies and the VCs who fund them (Sequoia, a16z, Kleiner, etc.). This reader is sophisticated, fast, and pattern-matches against thousands of seed/Series A decks.

**Tone shift from v12 → v13:** Less marketing, more substance. Cooley's bar is institutional. We add the six missing investor-grade sections, tighten claim language, and add a Cooley-appropriate cover treatment.

---

## What stays from v12
- Red Fortune-50 confidentiality block (Defend Trade Secrets Act + Illinois Trade Secrets Act citations)
- Founder foreword + Thomas D. Bowling photo (p.2)
- USPTO Provisional 63/969,202 (27 claims pending) — long-form on cover/security/back; short form in footers
- Competitor Matrix (Sec. 14) — single best page, keep as-is
- Sections 1–13 narrative (light copy polish only)

## The six new additions (Sections 19–24)

**1. Traction Ledger (Sec. 19)** — replaces vague "engagement" language with a dated, verifiable ledger: USPTO filing date, 42 agents live in production, AAMES enterprise dossier delivered, Liberty Bank logo asset on file, web app published at 1325.ai, edge functions live count, lines-of-code, security scan posture. Each row sourced.

**2. Unit Economics (Sec. 20)** — CAC, LTV, gross margin per tier ($19–$899/mo SMB + enterprise sponsor tiers), payback period, contribution margin. Table + one bar chart. This is the page every Cooley-introduced VC flips to first.

**3. Defensibility Brief (Sec. 21)** — written in the register of a Cooley IP memo: 27-claim breakdown by category (agent orchestration, scoring, learning loop, marketplace mechanics), trade-secret inventory, data moat (proprietary directory + scan/loyalty pipeline), and the "why this is hard to replicate" paragraph. Cites DTSA + Illinois UTSA.

**4. Honest Comparables Reframe (Sec. 22)** — drops "we are bigger than Salesforce" framing. Reframes as category-creator with adjacent comps: Slack ($27.7B / Salesforce), Nuance ($19.7B / Microsoft), Pushpay ($1.3B / BGH), Mailchimp ($12B / Intuit), Yelp/Angi (public comps for directory layer). Multiples table with source notes.

**5. Use of Funds → Milestones (Sec. 23)** — converts the v9 pie chart into a milestones table: each $ bucket maps to a hire/build, which unlocks a specific metric by month N. Format: `$X → role Y → unlocks KPI Z by Month N`. This is what Cooley-trained associates expect.

**6. Expanded Risk Matrix (Sec. 24)** — adds rows missing from v9: founder concentration / key-person risk, AI regulatory exposure (EU AI Act, US state AI laws, FTC), model-provider dependency (OpenAI/Anthropic/Google), data-privacy posture (CCPA/GDPR), patent-grant risk (provisional → non-provisional conversion window), and concentration risk on early enterprise pilots. Each row: Risk → Likelihood → Impact → Mitigation → Owner.

## Cover treatment (Cooley-specific)
- Keep navy + gold + red confidentiality block.
- Add a small "Prepared at the request of Cooley LLP — For the attention of Mr. Bobby Earles" line under the title block (no Cooley logo — using their name/mark without permission is exactly the thing a Cooley lawyer would flag).
- Add "Counsel of record: [to be designated]" placeholder line so the reader knows we understand the process.

## Page architecture (29 → ~37 pages)
```
01  Cover (navy + red confidentiality + Cooley attention line)
02  Founder foreword + photo
03  Table of Contents (regenerated)
04  Executive Summary (tightened, one page)
05–17  Sections 1–13 (existing narrative, light polish)
18  Sec. 14 Competitor Matrix (unchanged — hero page)
19  Sec. 15 Traction milestones (from v9)
20  Sec. 16 The Ask + Use of Funds pie (from v9)
21  Sec. 17 TAM/SAM/SOM + 5-Yr ARR (from v9)
22  Sec. 18 Risk Matrix + Comparable Exits (from v9)
23  Sec. 19 Traction Ledger (NEW)
24–25  Sec. 20 Unit Economics (NEW, 2 pages)
26–27  Sec. 21 Defensibility Brief (NEW, 2 pages)
28  Sec. 22 Honest Comparables Reframe (NEW)
29–30  Sec. 23 Use of Funds → Milestones (NEW, 2 pages)
31–32  Sec. 24 Expanded Risk Matrix (NEW, 2 pages)
33  Security & Compliance (existing)
34  Back cover — Contact + Recommended Next Steps + counsel line
```

## Language tightening (applies throughout)
- "Patent pending" → "U.S. Provisional Patent Application No. 63/969,202 — 27 claims pending"
- Remove any superlatives unsupported by a citation ("world's first", "only platform")
- Replace "we will" with dated commitments where possible
- All dollar figures get a footnote source or "(internal projection)" tag

## Technical / build notes
- Generate as v13 via a single clean ReportLab script saved to `/tmp/unicorn_v13/build.py` so future edits don't require binary patching (this was the v10→v12 overlap issue).
- Reuse v12 cover assets (logo, navy, gold) and the founder photo already on disk.
- Charts: matplotlib, navy/gold palette, no 3D, no gradients — institutional flat style.
- Output: `1325AI_Why_We_Are_A_Global_Unicorn_v13_Cooley_Edition.pdf`.

## Out of scope for v13
- No Cooley logo or trademarks used.
- No changes to web app, AAMES dossier, or memory.
- No video/audio assets.

## What I need from you before I build
1. **The Ask figure** — keep v9's $2.5M @ $12M cap, or update?
2. **Counsel of record line** — leave as "[to be designated]" or name someone?
3. **Traction Ledger** — any private metrics (MRR, pilot LOIs, signed NDAs) you want included, or stick to what's publicly verifiable?
