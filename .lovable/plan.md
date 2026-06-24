# AAMES Dossier v5 — Plan

Build `AAMES_Enterprise_Partnership_Dossier_v5.pdf` in `/mnt/documents/`, keeping v4 untouched. Target length: ~44–48 pages.

## What stays the same (from v4)
- All 35 v4 pages, brand rules, agent roster, leader mappings, corrections (Thomas D. Bowling, Mr. Anthony Franklin, 36-month horizon, no Clarence, 20% revenue share, USPTO 63/969,202).
- ReportLab build, embedded TrueType fonts, 0.55" agent table `#` column.

## What's new in v5 (5 additions)

**1. Personal Letter from Thomas D. Bowling (new page 2)**
- One page, warm, first-person, ~250 words. Why this partnership matters personally, faith-aligned tone, signed.

**2. Sample Agent Outputs Gallery (new section after the Agentic Workforce deep dive, ~6 pages)**
One mocked artifact per division so AAMES can see, not just read:
- Finance: sample **Grant Brief** (one grant opportunity, deadline, fit score, draft paragraph)
- Member Ops: sample **Renewal Email** + lapsed-member outreach sequence
- Communications: sample **Weekly Newsletter** layout + social post pack
- Youth Programs: sample **Program Recap Report** (attendance, outcomes, photo placeholders)
- Security & Compliance: sample **Monthly Compliance Log** (access, data, incidents)
- Executive Office: sample **Board Briefing** (one-page exec summary auto-generated for Dr. Hill)

**3. 90-Day Rollout Timeline (new 2-page spread)**
- Week 1, Day 30, Day 60, Day 90 milestones
- Two columns: "1325.AI delivers" vs. "AAMES provides" (so they see their homework)

**4. Investment Summary (new 1-page)**
- Sponsor tier pricing, what's included, 20% recurring revenue share on member-business network, optional Gemini Enterprise add-on ($25K setup + $8K/mo) clearly marked as optional.
- Single "Total Year-One Investment" line and ROI restatement ($18,000+/mo in covered roles).

**5. Data Governance & Exit Terms (new 1-page)**
- Who owns AAMES's data (AAMES does)
- Where it lives, encryption, access controls
- 30-day export + deletion guarantee on exit
- Faith-data sensitivity statement

## Page order (v5)
```
1.  Cover
2.  Letter from Thomas D. Bowling          ← NEW
3.  Executive Summary
4.  Executive Dashboard
5–8.  Phase I Story (existing, with corrections)
9.  Section II opener — The Agentic Workforce
10–22.  42 Agents by division (existing)
23.  Day in the Life
24.  Skill-to-Pain-Point Matrix
25–30.  Sample Agent Outputs Gallery       ← NEW (6 pages)
31–32.  90-Day Rollout Timeline            ← NEW
33.  Forms Inventory Ask
34.  Why 1325.AI (USPTO, defensibility)
35.  ROI Summary
36.  Investment Summary                    ← NEW
37.  Data Governance & Exit Terms          ← NEW
38.  Closing + Signature block
```

## Technical notes
- Build script: `/tmp/aames/dossier_v5.py` (fork of v4 script).
- Sample artifacts rendered as styled in-PDF mockups (boxed, monospace where appropriate) — not external images, so nothing breaks.
- Mandatory QA: render every page to JPG with `pdftoppm`, inspect each one for overlaps/clipping/black-box glyphs, fix and re-run until clean.
- Final file: `/mnt/documents/AAMES_Enterprise_Partnership_Dossier_v5.pdf` with a `<presentation-artifact>` tag so you can download it directly.

## What I need from you (none — but optional)
- If you want the Bowling letter to include a specific personal story or scripture, paste it now. Otherwise I'll write a clean, faith-aligned draft you can edit later.
- If sponsor-tier pricing for AAMES is different from the standard tier, tell me the number. Otherwise I'll use the standard enterprise sponsor figure from your pricing memory.

Approve and I'll build v5.
