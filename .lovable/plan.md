## Goal
Rebuild the David one-pager (v3) with two upgrades:
1. **Real 1325.AI logo** (the gold neural-brain on navy you just uploaded) embedded in the header
2. **Full official pricing table** (Essentials / Starter / Pro / Enterprise) replacing the generic ROI line

## Steps

1. **Save the logo** as a permanent asset
   - Copy `user-uploads://1325-logo-4.jpeg` → `/mnt/documents/assets/1325-logo.jpeg`

2. **Rewrite the PDF generation script** (`/tmp/david_pdf_v3.py`)
   - Header: navy band (#003366) with embedded real logo (~1.0" tall, centered), gold hairline divider beneath
   - Title: *"Kayla vs. Claude — and what 1325.AI actually delivers"*
   - Section 1: Short framing paragraph (Claude = engine, Kayla = vehicle, powered by Opus 4.6 + GPT-5 + Gemini via Lovable AI Gateway)
   - Section 2: Compact 2-column comparison table (Claude vs Kayla) — 5 rows max
   - Section 3: **Pricing block** with all 4 tiers as branded cards in a 2x2 grid:
     - Essentials — $19/mo · $190/yr (save $38) · 30-day trial
     - Starter — $79/mo · $790/yr (save $158) · 30-day trial
     - Pro (Most Popular badge in gold) — $299/mo · $2,990/yr (save $598) · Founders' Lock $149/mo for first 100 · 14-day trial
     - Enterprise — From $899/mo + $50/user/mo · custom annual · 14-day trial
   - Footer: "All plans include a free trial. Valid credit card required." + 1325.AI / mansamusamarketplace.com contact line
   - Single page, US Letter, brand palette (Navy #003366, Gold #FFB300)

3. **Render** as `1325AI_Kayla_vs_Claude_OnePager_v3.pdf` (preserve v1/v2)

4. **Mandatory visual QA**
   - `pdftoppm -jpeg -r 150` → inspect with code--view
   - Check: logo crisp, no text overflow, all 4 pricing cards fit, "Most Popular" badge visible, footer not clipped, table aligned
   - Fix and re-render until clean

5. **Deliver** as `<lov-artifact>` with mime `application/pdf`

## Technical notes
- `reportlab.platypus` with `Image`, `Table`, `Paragraph` flowables
- Pricing cards built as a 2-column `Table` with nested cell content for consistent sizing
- Gold accent border on Pro card to highlight "Most Popular"
- Use ParagraphStyle for tier name (bold), price (large), bullets (small)
