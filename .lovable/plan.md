# Corporate Sponsorship — Forbes-100 Redesign

**Goal:** Transform `/corporate-sponsorship` from a "startup pitch" feel into a calm, confident, institutional experience that a Fortune-class brand would feel proud to be listed on.

**Design north star:** Apple-meets-Goldman. Lots of black space. One accent color (MansaGold). Quiet typography. No emoji. No rainbow gradients. No "buy now" energy.

---

## 1. Hero — `SponsorshipHeroSection.tsx`
- Remove multi-color glows (purple/blue blobs). Keep **one** subtle MansaGold radial behind the headline.
- Reduce motion: kill pulsing particles, keep a single slow-fade ambient layer.
- New copy hierarchy:
  - Eyebrow: `CORPORATE PARTNERSHIPS · 1325.AI`
  - Headline: **"Invest in the infrastructure of Black economic circulation."**
  - Sub: One sentence — patent-pending, 33-agent AI workforce, verified business network.
- Two buttons only: **"Request Partnership Brief"** (primary, gold) and **"View Engagement Tiers"** (ghost, white outline).
- Add a thin trust strip directly under the buttons: *"U.S. Patent Pending 63/969,202 · Verified Corporation · HBCU Partner Network"*.

## 2. Recognition Strip (new)
- Thin section under hero: monochrome row of trust marks (Patent Pending, Verified Corp, HBCU Network, Illinois-registered, etc.).
- Grayscale, low opacity, no logos we don't actually have. Text-based marks only until real partner logos exist.

## 3. Impact Section — `SponsorshipImpactSection.tsx`
- Convert flashy stat cards to a **quiet 4-up metric grid** on a black surface:
  - 33 AI Agents · 8 Revenue Streams · $12,100+/mo Operator Savings · Patent-Pending Tech
- Single-line captions under each. No gradients on numbers — solid white, MansaGold accent on the unit.

## 4. Tiers — `SponsorshipTiersSection.tsx` / `SponsorshipTiers.tsx`
- Rename to **"Engagement Tiers"** (not "Sponsorship Tiers").
- Replace "Most Popular" badge on Gold with subtle label: **"Recommended for national brands."**
- Frame pricing as **"Annual Commitment"** with monthly equivalent in small text below — institutional sponsors think yearly.
- Remove the monthly/yearly toggle (looks SaaS-y); show annual as primary, monthly as secondary line.
- Add a 4th column on the right: **"Founding Partner"** — invite-only, "Contact leadership" CTA. Creates aspiration.
- Card styling: black glass, hairline gold border on the recommended tier only, no shadows-on-shadows.

## 5. Engagement Process (new section)
A 5-step horizontal timeline showing how a partnership actually unfolds:
1. **Discovery Call** (30 min)
2. **Partnership Brief** (custom PDF within 5 business days)
3. **Agreement & Onboarding** (legal, branding assets, dashboard access)
4. **Activation** (logo placement, listings, co-marketing)
5. **Quarterly Business Review** (impact report, ROI, renewal)

This single section does more for credibility than any visual flourish.

## 6. Founder Note (new section)
A short, signed note from you — black card, gold rule, your signature/name. Three sentences max:
> "We built 1325.AI because the data was undeniable: a dollar circulates in the Black community for hours, not days. Sponsorship of this platform is not philanthropy — it is infrastructure investment in a $1.8T economy. I'd be honored to discuss how your brand fits in."
> — *[Your Name], Founder*

I'll draft, you edit.

## 7. Sponsorship Form — `SponsorshipForm.tsx` + form sections
Upgrade to enterprise intake. Add fields:
- **Company size** (1–50 / 51–500 / 501–5000 / 5000+)
- **Annual marketing budget** (range buckets, not exact)
- **Primary objective** (Brand visibility / Community impact / Talent pipeline / Data & insights / Other)
- **Decision timeline** (This quarter / Next quarter / Exploratory)
- Keep tier selector but add **"Not sure — recommend a tier"** option.
- Submit button copy: **"Request Partnership Brief"** (not "Submit").
- Confirmation state: "A partnerships lead will respond within 1 business day."

## 8. CTA Section — `SponsorshipCTASection.tsx`
- Strip down to one calm block: gold rule, single sentence, two buttons (Request Brief / Download Media Kit).
- Remove urgency language ("limited spots", "act now"). Replace with stewardship language ("by invitation and review").

## 9. Page-level — `CorporateSponsorshipPage.tsx`
- Final section order:
  1. Hero
  2. Recognition Strip
  3. Impact Metrics
  4. Engagement Tiers (incl. Founding Partner)
  5. Engagement Process
  6. Founder Note
  7. Form (Request Partnership Brief)
  8. Media Kit
  9. Final CTA
- Remove duplicate Patent Pending badge (it's already in the recognition strip and footer of media kit).

---

## Out of scope for this pass
- Real third-party logos (we'll add when you give the green light + actual partners).
- Backend/email changes to the sponsorship form (kept as-is unless you want me to wire a notification).
- PDF media kit content (separate task).

## Three small confirmations I still need (I'll proceed with sensible defaults if you don't answer)
1. **Founder name & title** for the signed note — default: *"Bobby Mitchell, Founder & CEO"*. Confirm or correct.
2. **Recommended tier highlight** — default: **Gold** gets the "Recommended for national brands" label.
3. **Founding Partner price anchor** — default: shown as **"By invitation"** with no number. (Alternative: $100K+/yr.)

If you just say "go," I'll use the defaults above and ship the redesign.
