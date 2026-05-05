## Goal
Produce a professional, attorney-ready **Patent Technical Specification PDF** for updating USPTO Provisional 63/969,202 — built so you can hand it to Fraline (or any patent attorney) and cut their drafting time from ~$6K to ~$2K. Plus the three optional add-ons.

## Deliverables (all PDFs, brand palette: Navy #003366 / Gold #FFB300)

### 1. Main: `1325AI_Patent_Technical_Specification_v1.pdf` (~40–55 pages)
Structured exactly the way a patent attorney consumes a tech disclosure:

1. **Cover & Filing Reference** — links to original 63/969,202, filing date, inventor, assignee (Mansa Musa Marketplace, Inc.), continuation-in-part intent
2. **Executive Summary of New Subject Matter** — what's been built since the original 27 claims
3. **Field of the Invention** + **Background / Problem Statement** (Alice-resistant framing: technical problem, not business problem)
4. **Summary of the Invention**
5. **Detailed Description of the Preferred Embodiments** — the meat:
   - **Multi-Model Orchestration Engine** (Claude Opus 4.6 + GPT-5 + Gemini via Lovable AI Gateway): routing rules, fallback hierarchy, cost/latency optimization, model-strength matrix
   - **33-Agent Hierarchical Architecture** (Kayla orchestrator + specialist sub-agents): server-side router, agent learning loop, chat memory + feedback writes, run-log idempotency
   - **Atomic QR-to-Loyalty Pipeline** (`award_qr_scan` RPC): single-transaction validation + scan-limit + cooldown + point accrual
   - **Temporal Founding-Member System** (immutable trigger, 2026-09-01 cutoff)
   - **Circulatory Multiplier Attribution** + **Geospatial Velocity Fraud Detection** (claims 1, 3 expanded)
   - **Tiered Subscription + Founders' Lock** mechanism (technical implementation, not just pricing)
   - **Answering Service / Voice AI integration** ($49 add-on) — Realtime Voice + agent routing
   - **Perplexity Pro integration** as a research-tier model in the orchestration mix
6. **Drawings (Figures)** — auto-generated technical diagrams:
   - Fig. 1: System architecture (consumer ↔ orchestrator ↔ 33 agents ↔ DB)
   - Fig. 2: Multi-model routing decision tree
   - Fig. 3: Atomic QR-to-loyalty sequence diagram
   - Fig. 4: Agent learning loop (memory → feedback → run-log)
   - Fig. 5: Temporal founding-status trigger flow
   - Fig. 6: Geospatial fraud detection flow
7. **Proposed Claim Set (Draft, ~15 new claims)** — independent + dependent, written in proper claim language ("A computer-implemented method comprising…") with explicit Alice-resistant technical-improvement framing on every independent claim
8. **Code Excerpts as Technical Evidence** (appendix) — numbered listings of the actual SQL trigger, `award_qr_scan` RPC signature, agent router, with line references
9. **Glossary of Terms**
10. **Inventor Declaration template** (signature page)

### 2. Add-On A: `Patent_Prior_Art_Search_Summary_v1.pdf` (~8–12 pages)
- USPTO + Google Patents keyword sweep on each new claim area
- Closest known prior art per claim, with distinguishing technical features called out
- "Whitespace map" — where 1325.AI's claims are clear of existing IP

### 3. Add-On B: `Patent_Alice_Defense_Memo_v1.pdf` (~6–8 pages)
- Per-claim Alice/Mayo two-step analysis
- "Technical improvement" framing language attorney can lift verbatim
- Red-flag claims (any that read too "business-method-y") with rewrite suggestions

### 4. Add-On C: `Attorney_Engagement_Brief_v1.pdf` (~4 pages)
- One-page cover letter to Fraline
- Scope of work checklist (what you want her to do vs. what's already done)
- Budget/timeline expectations ($2K target, 2-week turnaround)
- Filing-deadline tracker (12-month conversion clock from original provisional)

## Technical approach
- **ReportLab Platypus** (same toolchain as v29 manual) — reuse navy/gold styles, `TH_W` white-header table style, 150-DPI QA pipeline
- **matplotlib** for the 6 figures (clean technical line art, navy strokes, gold accents)
- All files written to `/mnt/documents/`
- Mandatory visual QA on every page before delivery — re-render until clean
- No Unicode subscripts (use `<sub>` tags); brand-consistent typography
- Conservative, attorney-grade voice (no marketing fluff in the spec itself; Alice-defense memo can be more persuasive)

## What I will NOT do
- Will not transmit anything to Fraline (you deliver)
- Will not give legal advice — every doc carries a "Draft for attorney review" watermark
- Will not invent prior-art citations — Add-On A uses public USPTO/Google Patents data only, clearly sourced

## Output
Four `<lov-artifact>` PDFs delivered together, plus a short summary of what's in each and a recommended order to walk Fraline through them.
