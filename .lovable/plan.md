# Forbes-100 Sponsor Wall Redesign

## What this is about (in plain English)

We already polished the **prospect page** at `/corporate-sponsorship` (the page that convinces companies to join us). But the section on the **homepage** that actually shows off the sponsors we already have — Miguel Wilson Collection, Apparel Redefined, Mansa Kunda, Mansa Musa Marketplace — still looks like a startup brochure: purple-violet gradients, glowy effects, faint grey subtext, "Visit Website" call-outs everywhere.

A Forbes 100 / Goldman Sachs-style sponsor wall is the opposite: **quiet, confident, monochrome, almost no motion**. The brand logos do the talking. The page says, in effect, *"these are the institutions that stand with us"* — not *"click here, click here!"*

## The problem with what's there now

File: `src/components/sponsors/PublicSponsorDisplay.tsx`

1. **Color clash** — Heavy violet/purple gradients on the Platinum card fight with our true-black + MansaGold brand.
2. **Readability** — Subtext is `text-white/40` (40% opacity white) which is barely visible on dark.
3. **Too many "buy" cues** — Pulsing "Active Partner" dots, animated arrows, hover-scale tiles, gradient buttons. Institutional brands present sponsors *quietly*.
4. **Inconsistent with the rest of the site** — The prospect page is now black + thin gold hairlines + Playfair serif headlines. This section is gradient + bold sans-serif + glow shadows.
5. **CTA mismatch** — Big amber gradient "Become a Corporate Sponsor" button looks like an e-commerce add-to-cart, not an enterprise invitation.

## What I'll change

### 1. Rename and reframe the section
- Section eyebrow: **"Corporate Partners"** → **"In Partnership With"** (institutional language).
- Headline: instead of *"Powering Economic Infrastructure"* with a gradient text effect, use a calm Playfair serif headline:
  > **The institutions standing with 1325.AI.**
- Supporting line in readable contrast (`text-white/85`, not `text-white/40`):
  > "A select group of companies investing in the infrastructure of Black economic circulation."

### 2. Strip out all violet/purple
- Remove every `violet-*` and `purple-*` color class.
- Replace with **MansaGold** accent only (matches the rest of the institutional pass).
- Background: pure black with one extremely subtle gold radial — not a multi-stop gradient.

### 3. Redesign the Platinum card (Miguel Wilson Collection)
- Keep it as the hero, but quiet it down:
  - Black card, **2px MansaGold border** (not violet glow).
  - Single thin gold hairline at top and bottom (matches the prospect page).
  - Logo in a clean white tile, no animated corners.
  - Eyebrow text: **"FOUNDING PLATINUM PARTNER"** in tracked-out gold caps.
  - Company name in Playfair serif, bold, white.
  - One-line descriptor in `text-white/80` (readable).
  - Replace the gradient pill button with a simple bordered link: `Visit miguelwilson.com →` in gold, no background fill.
  - Remove the pulsing "Active Partner" dot.

### 4. Redesign the Gold partner grid
- Same card treatment as the prospect page tiers: **black background, 2px gold/30 border, square corners (rounded-lg, not rounded-2xl)**.
- Logo tile stays white (logos need a light background to read).
- Tier label in tracked-out gold caps above the logo.
- Company name in white, medium weight, no hover color shift.
- Drop the "Visit Website" link — clicking the card already opens it. (Reduces visual noise — a Forbes-style wall doesn't beg for clicks.)
- Remove the `hover:-translate-y-1` lift. Institutional pages don't bounce.

### 5. Bottom CTA
- Remove the giant amber gradient button.
- Replace with the same restrained pattern used on the prospect page:
  - Eyebrow: "By invitation and review"
  - Single outlined button: **"Become a Corporate Partner →"** routing to `/corporate-sponsorship` (not the old `/sponsor-pricing`, so they land on the new institutional page we just built).

### 6. Add a "Recognition Strip" footer to this section
Mirror the trust strip from the prospect page — a single horizontal row of grey tracked-out text:
> **U.S. Patent Pending 63/969,202 · Verified Corporation · HBCU Partner Network · 33-Agent AI Workforce**

This is the single biggest cue that a viewer is on a "real company" page, not a startup landing page.

## Files I'll edit

- `src/components/sponsors/PublicSponsorDisplay.tsx` — full visual rewrite (the only file that needs real surgery).

## Files I'll leave alone

- `SponsorLogoGrid.tsx`, `SponsorBanner.tsx`, `SponsorSidebar.tsx` — these are smaller utility displays used in the footer and sidebar; they're already neutral. Touching them risks regressions for not much visual gain. We can do a follow-up pass if you want.
- The prospect page (`/corporate-sponsorship`) — already done.

## What you'll see after

A homepage section that reads like the "Our Investors" page on a Goldman Sachs or BlackRock site:
- Pure black canvas
- One gold accent
- Big Playfair headline
- A single quiet hero card for Miguel Wilson
- A clean 2-up grid for the gold partners
- A whisper-quiet trust strip at the bottom
- One restrained CTA pointing to the new institutional partner page

## One thing I want to confirm before building

The current Platinum card describes Miguel Wilson Collection as *"Luxury menswear — Phipps Plaza, Atlanta"*. I'll keep that line as-is unless you want different wording. Reply with a tweak or just say "keep it" and I'll proceed.
