
## Update the script's Call To Action

The user wants the CTA in the 5-minute cinematic script updated. The OLD CTA ("100% FREE until January 2026 — sign up at 1325.ai") is being replaced with the NEW pricing reality: paid tiers (Essentials $19, Starter $79, Pro $299, Enterprise from $899) with a "Save 17% annually" angle and a Founders' Lock for the first 100 businesses on Pro.

This is a meaningful shift in tone — we're moving from "everything is free" to "free trials + tiered pricing + founders' deal." I need to make sure this lands cleanly in a 45-second cinematic CTA segment without overwhelming the viewer.

### Two important things to flag

1. **This conflicts with the "Free until January 2026" messaging** that lives in:
   - `src/lib/constants/free-period.ts` (says free until Sept 1, 2026)
   - `social-media-video-content-brief.md` (says free until January 2026)
   - `Scene5Closing.tsx` in the Remotion video (says "100% FREE Until January 2026")
   - Memory file `mem://features/pricing-model`
   
   I'll update the script to use the new pricing, but you should decide later whether to also update those other files. **For now I'll only touch the script.**

2. **You haven't actually generated the PDF yet** — the previous turn was a plan, then we got pulled into a different conversation. So this work creates the PDF for the first time, with the new CTA baked in from the start.

### What the new CTA segment will say (4:15–5:00)

A cinematic, Apple-like close that reframes pricing as opportunity, not cost:

> **VOICEOVER:** "Start free for 30 days. No credit card. No risk."
>
> "Then choose your tier — Essentials at $19, Starter at $79, or go Pro at $299 and unlock the full Kayla AI suite that replaces over $560 a month in single-purpose tools."
>
> "And if you're one of the first 100 Pro businesses — your price is locked at $149 a month. For life."
>
> "Save 17% when you pay annually. Multi-location? Enterprise starts at $899."
>
> "This isn't just software. This is generational infrastructure. And it starts with you."
>
> **ON-SCREEN:** "Visit 1325.ai — Start Your Free Trial"

### Deliverable

One PDF: **`/mnt/documents/1325AI-Cinematic-Script-5min.pdf`**

- Same cinematic-script format from the prior plan (cover page, scene blocks, MansaBlue headings, MansaGold callouts)
- All 7 scenes (Cold Open through CTA), ~750 words total, 5:00 runtime
- The NEW CTA segment replaces the old "free forever" close
- A small "Pricing Reference" appendix on the last page so NotebookLM has clean numbers to pull from

### Process I'll follow once approved

1. Generate the PDF with Python + reportlab
2. Convert every page to images and visually QA (overlaps, clipped text, contrast)
3. Fix anything broken, re-verify
4. Drop the PDF in your downloads with a download button

### One quick question
Do you want me to **also** flag the other places in the codebase that still say "100% FREE until January 2026" so you can decide whether to update them? (Homepage, Remotion video, social brief, memory file.) I won't change them — just give you the list.

**No code files touched** — this is a one-off PDF artifact.
