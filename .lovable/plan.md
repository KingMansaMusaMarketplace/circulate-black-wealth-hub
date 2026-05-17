## Press & Partners Page (/press)

A polished, journalist-ready page that makes 1325.AI easy to write about and easy to partner with. Linked from the footer.

### Sections (top to bottom)

1. **Hero** — "Press & Partnerships" headline, one-line pitch, two CTAs: *Email press team* and *Download press kit*.
2. **At a glance (key stats)** — 47,000+ Black-owned businesses · USPTO 63/969,202 patent-pending · 33 AI agents · $1.6T market · Founded 2024 in Illinois.
3. **About 1325.AI** — 2–3 short paragraphs describing the platform, the "6-hour Black dollar" problem, and how 1325.AI solves it. Mentions Mansa Musa Marketplace as parent brand.
4. **Founder bio** — William Foster headshot placeholder, short bio, LinkedIn link.
5. **Boilerplate** — Copy-paste paragraph journalists can drop into articles (with copy-to-clipboard button).
6. **Press kit downloads** — Logo pack (PNG/SVG), brand colors (MansaBlue #003366, MansaGold #FFB300), founder photo, product screenshots, one-page fact sheet (PDF).
7. **In the news** — Empty-state placeholder ("Featured coverage coming soon") with grid ready for logos once press lands.
8. **Partnership CTA** — Card with three partner types (Media, Chambers/Nonprofits, Corporate Sponsors) and a *Become a partner* button → mailto or contact form.
9. **Media contact block** — Email, response-time promise ("We reply within 24h"), social links.

### Technical notes

- New route: `src/pages/PressPage.tsx`, registered in the existing router.
- New components in `src/components/press/`: `PressHero`, `PressStats`, `FounderBio`, `BoilerplateBlock` (with copy button), `PressKitDownloads`, `PartnershipCTA`, `MediaContact`.
- Use the True Black / MansaBlue / MansaGold design tokens already in `index.css` and `tailwind.config.ts` — no new colors.
- SEO via existing `seoUtils.ts` pattern: title "Press & Partnerships | 1325.AI", meta description, JSON-LD `Organization` schema with founder, foundingDate, sameAs links.
- Press kit assets: create a placeholder ZIP in `public/press-kit/1325ai-press-kit.zip` referencing existing logos in `src/assets/`. (User will swap in the real kit later — I'll flag this.)
- Add footer link: "Press" → `/press`.
- Add to `static-sitemap.xml` so Google indexes it.

### What I'll need from you AFTER the page is live

1. Founder headshot (drop into `src/assets/` — I'll wire it up).
2. Your preferred press email address (e.g., `press@1325.ai`).
3. Your LinkedIn URL.
4. Any existing press logos to display in the "In the news" section (optional).

Placeholders will be used until you provide these — page will look complete and professional either way.

### Out of scope (can add later)

- Contact form with email delivery (currently mailto: link)
- Real PDF fact sheet generation
- CMS for managing press mentions
