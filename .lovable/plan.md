# AAMES Dossier v18 — Polish Additions

Build on v17 by adding 3 new pages and a navigable bookmark outline. Output: `AAMES_Enterprise_Partnership_Dossier_v18.pdf`.

## What gets added

1. **Executive Summary (1 page, front of document)**
   - Inserted as new page 2 (after cover, before existing Section I).
   - 60-second read for a CEO/board member: Problem → Solution → 42 Agentic AI Employees → ~4 Roles Covered / $18,000+/mo savings → The Ask.
   - Uses existing navy/gold brand styling; one compact "at-a-glance" stat band.

2. **Table of Contents (1 page)**
   - Inserted as new page 3.
   - Lists every section + page number, navy/gold styled, dotted leaders.
   - Page numbers auto-recalculated after Exec Summary insertion.

3. **PDF Bookmarks / Outline**
   - Adds a clickable left-side outline in any PDF reader (Preview, Acrobat, Chrome).
   - One bookmark per section heading, plus Exec Summary, TOC, and Security.
   - Zero visual change — pure navigation upgrade.

4. **Security & Compliance page (1 page, near the end)**
   - Inserted before the closing/contact page.
   - Sections: Data Handling, Authentication & Access, Infrastructure, IP Protection (USPTO 63/969,202), Shared Responsibility note.
   - Conservative wording — no certification claims (SOC2/HIPAA/etc.) unless you confirm them. I'll mark any unverified items as "in progress" or omit them.

## Final page count
v17 = 35 pages → v18 = **38 pages** + bookmark outline.

## Technical details
- Script: `/tmp/build_v18.py`
- Uses `reportlab` to render the 3 new pages with the same slim navy header, gold rule, and footer system as v17.
- Uses `pypdf` to: (a) splice the new pages into the v17 PDF at the right positions, (b) renumber the footer page numbers across the whole document, (c) add the bookmark outline via `writer.add_outline_item(...)`.
- Liberation Sans TTF registered for consistent typography.
- QA: render every page to JPEG at 130dpi via `pdftoppm` and visually inspect for clipping, overlap, and correct page numbering before delivering.

## One thing I need from you
For the **Security page**, can you confirm any of these so I don't overclaim?
- Do you currently hold (or are pursuing) SOC 2, HIPAA, or any other formal certification? If unsure, I'll leave it out.
- Is the USPTO provisional 63/969,202 the only IP citation, or should I add the trademark filing for 1325.AI / Mansa Musa Marketplace?

If you say "just do it conservatively," I'll write the page with only safe, verifiable claims (encryption in transit, role-based access, Supabase RLS, USPTO 63/969,202) and skip certifications entirely.
