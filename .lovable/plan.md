## Goal

Replace the basic Gemini-generated PDF with a beautifully branded, multi-page Church Partnership Proposal that clearly communicates our mission: circulating wealth in Black communities through **Mansa Musa Marketplace, powered by 1325.AI**.

## Deliverable

A single PDF: `/mnt/documents/Church_Partnership_Proposal_v2.pdf` (downloadable artifact, ~5–6 pages).

## Branding

- True Black background (#000000) with MansaBlue (#003366) and MansaGold (#FFB300) accents
- Apple-like minimal layout, generous whitespace
- Cover page with brand lockup: "Mansa Musa Marketplace — Powered by 1325.AI"
- Footer on every page with contact info from `src/config/site.ts`

## Content Structure

1. **Cover Page** — Title, subtitle "Strategic Partnership for the Black Church", date, recipient line, brand lockup.
2. **Our Mission** — The Circulation Problem: dollar circulates only 6 hours in our community vs 28+ days elsewhere. Mansa Musa Marketplace exists to extend that circulation, building generational wealth. Inspired by Mansa Musa (1325 AD), the wealthiest man in history, who reinvested in his people.
3. **The Platform — Powered by 1325.AI** — Agentic Commerce Protocol: Kayla AI concierge + 33 AI employees that run business operations (~4 roles covered, $12,100+/mo savings). Directory, loyalty, B2B matching, voice AI.
4. **Why the Church** — The Black Church has always been the economic heartbeat of the community. Partnership amplifies that role in the AI era.
5. **The Digital Tithe Model** — 10% of every congregant subscription returns to the church's Vision Fund, automated monthly. Includes a simple ROI table (e.g., 50 / 100 / 250 members → monthly church revenue).
6. **Partner Benefits** — Preferred pricing, custom-branded portal in 48 hrs, Kayla AI concierge access, priority support, quarterly impact reports.
7. **Next Steps & Contact** — Demo invitation, signature block for Thomas D. Bowling, CEO. Contact: Thomas@1325.AI, 312.709.6006, 1325.ai.

## Implementation

- Python + ReportLab (Platypus) — already covered by the PDF skill
- Custom dark theme: black page background via canvas, gold/blue text styles
- Use Paragraph `<sub>`/`<super>` for any sub/superscripts (per skill rules)
- QA: render every page to JPG, visually inspect for clipping/overlap/contrast, fix and re-render until clean
- Final file delivered via `<lov-artifact>` tag

## Notes

- This is a one-off document generation task (per non-build-tasks rules) — no React UI changes
- Will not touch any app code, only produce the PDF artifact
