# Plan: Bobby Earles Question Prep 1-Pager

## Goal
Build a single-page PDF for Thomas's eyes only during tomorrow's 2 PM Cooley meeting with Bobby Earles. It is a conversation map and answer cheat-sheet — not a leave-behind, not a pitch deck.

## Output
`/mnt/documents/1325AI_Bobby_Earles_Question_Prep.pdf` (1 page, letter size, portrait)

## Layout (top to bottom)

1. **Header strip** — small navy bar: "BOBBY EARLES — COOLEY LLP | INTRO MEETING | THU 2:00 PM" + red "PRIVATE — THOMAS'S EYES ONLY" tag (per confidentiality rule).

2. **Your 60-Second Mission Answer** (boxed, the one you open with)
   > "1325.AI is the agentic AI operating system for the $2.10 trillion Black consumer economy. We've built 42 Agentic AI Employees — led by Kayla — that run marketing, ops, and revenue for Black-owned businesses, civic organizations like AAMES, and denominational networks. We hold U.S. Provisional Patent Application No. 63/969,202 with 27 claims pending, and we're raising a $2.5M seed on a $12M cap to convert the IP, sign 6 sponsors, and reach SOC 2 Type I in 24 months."

3. **5 Anticipated Questions** (Keith's list) — each with a 3-sentence ready answer:
   - Q1: *"Tell me about your traction."*
   - Q2: *"Why agentic AI vs. a standard SaaS play?"*
   - Q3: *"Who's on your cap table and what's the structure?"*
   - Q4: *"What do you need from Cooley specifically?"*
   - Q5: *"What's your moat against Salesforce / Microsoft / HubSpot?"*

4. **Cooley Intelligence Reminders** (bullets, tiny font)
   - $17.7B across 450+ AI deals in 2024 — he's seen everything.
   - Harvey AI is a client — don't over-explain agentic AI.
   - Be crisp, not comprehensive. 20 min talk / 20 min Q&A.

5. **Footer — The Question YOU Ask Bobby** (boxed in MansaGold, impossible to miss)
   > "From Cooley's perspective, what separates the AI companies that successfully raise institutional capital from the ones that never get funded?"

## Style
- Liberation Sans TTF embedded (no kerning artifacts).
- MansaBlue #003366 headers, MansaGold #FFB300 accents, ivory background.
- Compact — must fit one page. Small body font (9–10pt), tight leading.
- No 1325.AI logo (this is internal prep, not branded).
- Red confidentiality tag in header per memory rule.

## Build steps
1. Write `/tmp/bobby_prep/build.py` using ReportLab Platypus.
2. Render PDF, convert to JPG with pdftoppm, visually QA the single page for overflow / overlap / clipping.
3. Fix and re-render until clean.
4. Deliver to `/mnt/documents/` with `<presentation-artifact>` tag.

## Out of scope
- Not editing the v17 Dossier or the Meeting Brief.
- No web app changes.
