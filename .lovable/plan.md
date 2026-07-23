## Manual v66 — Diligence-Ready Pass

Goal: ship a version of the Complete Platform Manual that a lawyer, banker, or Series A investor can open without noticing any patched-in artifacts, stale headers, or duplicated sections.

### What changes

1. **Header/footer sweep**
   - Replace any lingering "v63" running headers or footer version strings with "v66".
   - Verify every page footer shows consistent pagination and the confidential legal block.

2. **Unify the two Series A sections**
   - Consolidate the front-matter Series A summary and the deeper "Series A / Financing" section into one canonical source of numbers ($30M @ $180M pre, 18-mo runway, $96M FY28 ARR, 14.29% dilution, 85.71% founder retention).
   - Remove the stale "$130M pre-money, 23.1% dilution" parenthetical still living on ~p104.
   - Cross-reference (not duplicate) between the executive summary and the financing section.

3. **Rebuild — not overlay — the cap table and term sheet**
   - Regenerate PDF page 113 (cap table) and page 176 (term sheet) as fresh reportlab pages using the v65 corrected math, then splice them in cleanly so there are no overlay ghosts, font mismatches, or double-printed rows.
   - Cap table columns: Holder · Shares · % Today · % Post-Series A.
   - Term sheet: Founder Equity Retained = 100% today · 85.71% post-Series A (pre-ESOP). No ">60%" language anywhere.

4. **Add an Acknowledgment / NDA page**
   - New page inserted right after the cover / confidentiality block.
   - Fields: Recipient Name, Firm, Date, Signature.
   - Language: recipient acknowledges receipt, confidentiality, no-forward, and that projections are forward-looking statements.

5. **Add a v65 → v66 changelog page**
   - Placed at the back of the front matter (before Part I).
   - Bullet list of what changed since v63.9 (valuation, runway, ARR, pricing, cap table truth-up, agent count, MCP, iOS 1.4.1) so a diligence reader can trust the version.

6. **QA pass**
   - Render every rebuilt/edited page to JPEG and eyeball for clipping, overlay ghosts, font mismatch, or duplicated blocks.
   - Text-extract search for known stale strings: `$100M pre`, `24 mo`, `$42M ARR`, `> 60%`, `$29/mo`, `$130M pre`, `v63`. Must all return zero hits before shipping.

### What does NOT change

- Cover art, color system, typography, department structure, and body copy stay identical to v65.
- Agent roster, patent language, MCP messaging, iOS pricing — all unchanged.
- No new sections beyond the Acknowledgment page and the changelog page.

### Deliverable

`/mnt/documents/1325AI_Complete_Platform_Manual_v66.pdf` — same ~180-page length (+2 pages for acknowledgment + changelog), diligence-ready.

### Technical notes

- Use `pypdf` to splice, `reportlab` (DejaVu Sans registered) to render replacement pages, `pypdfium2` for QA renders.
- Rebuild pages 113 and 176 from scratch rather than overlaying, to eliminate the v65 overlay artifacts you'd otherwise see under scrutiny.
- Keep the smart-alignment rule from v63.9 (center short pages, 54pt top margin on dense pages).
