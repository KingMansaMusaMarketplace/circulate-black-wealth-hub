## Add founder photo to the cover of v59.2

Place your portrait (transparent PNG, white slacks + patterned shirt) directly under the "27 Patent Claims" line on the cover of the Complete Platform Manual, and ship it as **v59.2**.

### What I'll do
1. Start from `1325AI_Complete_Platform_Manual_v59.1.pdf` (171 pages, all prior fixes intact).
2. Use the uploaded `Subject.png` as the cover portrait — it already has a transparent background, so it will sit cleanly over the cover artwork with no white box.
3. Build a one-page overlay with `reportlab` that:
   - Locates the cover (page 1).
   - Draws the portrait **centered horizontally**, just below the "27 Patent Claims" line.
   - Sizes it to roughly **2.2" wide × 3.0" tall** (portrait aspect preserved) so it reads as a clear founder photo without crowding the edition line / footer at the bottom of the cover.
   - Adds a thin gold hairline border + soft drop shadow so it feels intentional, not pasted on.
4. Merge the overlay onto page 1 only — every other page stays byte-identical to v59.1.
5. Bump the edition string on the title page from **v59.1 → v59.2** (same masking technique used for v59.1) and update the Publisher's Note DOCUMENT ID to `1325AI-CPM-V59-2026Q2` (already v59, no change needed there).
6. QA: render pages 1, 2, 4, 5 with `pdftoppm` and visually confirm the photo is centered, not clipped, not overlapping the edition line, and the gold border looks crisp.
7. Save as `/mnt/documents/1325AI_Complete_Platform_Manual_v59.2.pdf` and surface it as a downloadable artifact.

### One thing I want to confirm before building
The cover currently has these stacked items near the top half: title → subtitle → "27 Patent Claims" → (some space) → edition + footer at the bottom. Your photo is full-body, so even at 2.2"×3.0" it will take a noticeable chunk of the cover.

**Two options — tell me which you prefer:**
- **A. Full-body portrait** (~2.2"×3.0", as described above) — most striking, but I'll need to nudge the "27 Patent Claims" line up slightly so nothing collides.
- **B. Head-and-shoulders crop** (~1.8"×1.8", circular gold frame) — more like a traditional "About the Author" headshot, fits cleanly under "27 Patent Claims" with zero layout changes elsewhere.

Default is **A** if you don't specify. Either way, output is **v59.2**, only the cover page changes (plus the edition bump), and the 171-page body + bookmarks + appendix all stay intact.
