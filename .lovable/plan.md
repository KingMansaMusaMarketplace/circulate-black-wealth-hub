## Goal

Produce a shortened, share-safe PDF of the **1325.AI Complete Platform Manual** that you can send to your volunteer team along with your email — keeping the heart and vision intact, but leaving the "secret sauce" out.

Output file: `/mnt/documents/1325AI_Team_Edition_v1.pdf` (roughly **10–12 pages**, designed to be skimmed in under 15 minutes).

## What's IN (team-safe)

1. **Personal letter from you** (cover page) — adapted from the email you wrote, in your same plain, honest voice. Sets the tone: sweat equity, gratitude, pulling back the curtain.
2. **Vision & Mission** — what 1325.AI is and why it matters (Black wealth circulation, ~2% problem, the "operating system" idea).
3. **The Big Picture** — high-level overview of what we're building (marketplace + AI team + loyalty), no architecture details.
4. **Meet the 42 Agentic AI Employees** — Kayla + 41 specialists, grouped by department (Growth, Sales, Customer Success, Operations & Finance) with one-line role descriptions only. No routing logic, no memory/RLS internals.
5. **What's Live Today** — directory, QR loyalty, iOS app, investor portal (named, not explained technically).
6. **Roadmap & Goals** — the "10,000 businesses in 24 months" goal, key milestones, what we're driving toward.
7. **How the Team Wins Together** — bi-weekly syncs as non-negotiable, why every voice matters, what's expected.
8. **Closing thank-you** — gratitude + call to lock in.

## What's OUT (kept private)

- **Technical architecture** — no Supabase schemas, RLS, agent routing logic, tenant boundaries, edge functions, security definers, or implementation details.
- **Patent & IP details** — no USPTO number, no claim counts, no "27 independent / 56+ dependent claims," no Alice defense, no Illinois jurisdiction-as-IP-strategy framing.
- Investor valuation, $100M Series A framing, pricing for the Gemini Enterprise add-on, and sponsor tier dollar amounts are also removed (these read as investor-only).
- "Confidential · Investor Grade · USPTO" cover page is replaced with a clean "Team Edition" cover.

## Tone & design

- **Personal intro:** Lifted in spirit from your email — first-person, plain English, gratitude-forward. No corporate voice.
- **Visual style:** Matches the existing manual's brand (MansaBlue `#003366`, MansaGold `#FFB300`, true-black accents, clean Inter/Arial typography) so it feels like the same family of document, just lighter.
- **Layout:** Cover → Letter → 6–8 content pages with headers, short paragraphs, and simple bullet lists. No dense tables, no footnotes.

## Technical details (for the build step)

- Generate with the **docx skill → PDF** route OR ReportLab directly; will choose ReportLab for tighter control of the cover + letter typography.
- Output to `/mnt/documents/1325AI_Team_Edition_v1.pdf` and present via `<presentation-artifact>` so you can preview and download immediately.
- I'll do a visual QA pass (render each page to an image, check for overflow, orphaned text, contrast issues) before handing it to you.

## What I need from you to proceed

Just a **"go"** — or tell me if you'd like to also strip out the $18,000/mo and "~4 roles covered" headline numbers (right now I plan to keep those because they're the rallying metric for the team, not secret sauce).
