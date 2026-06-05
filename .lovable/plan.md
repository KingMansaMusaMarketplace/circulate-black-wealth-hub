# 1325.AI Year One: Team Edition — PDF Build Plan

## What I'll produce
A single polished PDF saved to `/mnt/documents/1325AI_Year_One_Team_Edition.pdf`, designed as a keepsake gift for the 26 founding teammates.

## Roster (26)
**Leadership callouts on their own card:**
- Thomas D. Bowling — Founder & Chief Architect
- Craig Stevenson — Co-founder
- Lisa Cooper Gavin — President
- Maurice Howard — Chief Technology Officer
- Clarence Smith — VP of Sales

**Founding Team Members (21):**
Vaughn Hester, Napolean Paul, John Atwater, Keith McGregory, Desiree Bowling, Brett Telesford, Brandon Jones, Terry Thompson, Zay Barton, Donald Palm, Douglas Morrison, James Robinson Jr, Joseph Weaver, Dr James Carson, Eric Webb, Kayla Bruton, John Wasny, Kim Bates — plus any remaining names from your list I'll re-confirm at render time.

*(If I'm short a name when I build, I'll pause and ask before generating.)*

## Document structure (~12 pages)
1. **Cover** — "1325.AI — Year One: Team Edition" / Thomas D. Bowling, Founder & Chief Architect · Craig Stevenson, Co-founder / 2025–2026
2. **Founder's Letter** — short, warm, from Thomas & Craig
3. **The Journey** — 1 page: what we set out to do (high-level, no IP/pricing/architecture)
4. **What We Built** — 1 page: plain-English milestones only (no patent #s, no revenue, no tech stack)
5. **Leadership** — 1 page, 5 cards: monogram + name + title + 1-line thank-you
6–8. **The Humans** (3 pages) — 21 teammates, 7 per page: monogram + name + "Founding Team Member" + Path A warm thank-you line drafted by me
9. **Year Two Vision** — 1 page: high-level direction only
10. **Why You Matter** — 1 page: gratitude statement
11. **Closing** — signed Thomas D. Bowling & Craig Stevenson

## Design
- True Black background, MansaGold (#FFB300) and MansaBlue (#003366) accents — matches 1325.AI brand
- Clean serif headings + sans body; generous whitespace; gift-quality feel
- Monogram circles (initials) instead of photos
- **No emails printed** on the PDF
- **No NDA** in this build (you didn't confirm — ask later if you want one)

## Protected (NOT in the PDF)
- No pricing, no revenue, no ROI numbers
- No patent number (63/969,202)
- No agent architecture, no tech stack, no edge-function details
- No investor-portal references

## Tech approach
- Python + reportlab (Platypus) for layout
- Render → convert each page to JPG → visually QA every page → fix any clipping/overlap → re-render until clean
- Final file: `/mnt/documents/1325AI_Year_One_Team_Edition.pdf`
- Delivered via `<presentation-artifact>` tag so you can preview/download in chat

## What I need from you
Just click **Implement plan** and I'll build it. If you want the F&F NDA included as a second PDF, say "go + NDA" instead.
