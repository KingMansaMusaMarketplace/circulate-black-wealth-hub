# v36 — Rebuild Collapsed Tables

## What's wrong today (v35)

Several pages look half-empty because **tables were flattened into broken paragraphs** during the v33 rebuild. Cells from the first row got promoted to giant blue H1 headings, and the rest of the cells got smushed into single-line paragraphs. Examples:

- Page 77 shows "AI" and "Cors" as giant headings — those are actually table cells
- Page 87 shows "Raise Post Runway Fy28 Arr" as a giant heading — that's a table header row
- Page 69 shows "Solo founder Essentials", "Side-business Starter" as headings — those are tier names from the Customer Segments table

Page 66 stays as-is (intentional Part V blue cover, matches Parts I–VIII).

## Fix scope

Splice **4 corrected pages** into the existing v35 PDF using the same approach as v34/v35 (read v35 with pypdf, generate replacement pages with ReportLab, write v36). Page count stays at **138**.

### Pages to rebuild

| Page | New content |
|---|---|
| **8 — Why Now** | Restore the 3-force narrative as a proper 3-row table (Force / What changed / Why it matters now) — frontier models, embedded fintech, orchestration moat |
| **69 — Customer Segments & Use Cases** | Proper 4-column table: Segment · Pain · How 1325.AI Wins · Tier — for Solo founder / Side-business / Funded SMB / Multi-location |
| **77 — Security & Architecture** | Proper 3-column Architecture table (Layer · Technology · Purpose) for Frontend / Backend / Auth / AI / Realtime / Edge. Compliance posture stays as bullet list |
| **87 — Series A · Use of Funds** | Proper 3-column table (Bucket · Allocation · Detail) for Engineering & ML 40% / Go-to-market 30% / Customer success 12% / Compliance & IP 8% / G&A & reserves 10%. Plus the $30M/$100M/24mo/$96M stat strip at top |

### Pages audited but left as-is

- **Page 66** — Part V cover (correct by design)
- **Page 71** — Answering Service (short but complete)
- **Page 81** — Ancillary Services (thin but accurate)
- **Page 123** — Tech Infrastructure (already well-formed)

## How (technical)

1. `pypdf` reads v35
2. ReportLab generates 4 replacement pages with:
   - Liberation Sans family (Regular + Bold) registered the right way (same fix as v35 so bold doesn't ghost)
   - Real `Table` flowables with navy header row, gold accent rule, alternating row tint
   - Same header/footer chrome as the rest of the manual
3. `PdfWriter` splices pages 8, 69, 77, 87 — keeps all other pages byte-identical
4. Output: `/mnt/documents/1325AI_Complete_Platform_Manual_v36.pdf`
5. QA: render all 4 fixed pages to JPEG at 150dpi, view each one, check no overlapping text, no orphan headings, table columns align

## What you'll see

A v36 PDF, still 138 pages, with the four broken pages now looking like proper Fortune-100 tables — no more giant "AI" / "Cors" / "Raise Post Runway Fy28 Arr" headings, no more half-empty pages where data used to live.
