# SEO Landing Pages — Black-Owned Travel & Food Niche

Build four dedicated landing pages targeting the easy-win keywords Evolve doesn't touch. Each page is a real, indexable URL with unique title, meta description, structured data, and content Google can rank.

## Pages to build

| URL | Target keyword | Monthly searches | Difficulty |
|---|---|---|---|
| `/stays/black-owned-hotels` | black owned hotels | 720 | Easy |
| `/stays/black-owned-resorts` | black owned resorts | 260 | Very easy |
| `/stays/black-owned-vacation-rentals` | black owned vacation rentals + black owned airbnb + cabins | 130 combined | Uncontested |
| `/directory/soul-food-restaurants-near-me` | soul food restaurants near me | 22,200 | Medium (biggest prize) |

## What each page contains

1. **SEO head** — Unique `<title>` (<60 chars, keyword-led), meta description (<160 chars), canonical URL, Open Graph tags. Uses the existing `PageSEO` component.
2. **Structured data** — JSON-LD `ItemList` of properties/restaurants + `FAQPage` schema with 3-4 keyword-rich Q&As (uses existing `BreadcrumbStructuredData` + new inline FAQ schema).
3. **Hero section** — H1 with exact-match keyword, 1-2 paragraph intro explaining what the page is, primary CTA (browse listings / list your property).
4. **Live listings grid** — Pulls real properties from the database (filtered by category for stays pages, filtered by `Soul Food Restaurant` category for the food page). If no listings yet, shows a "Be the first to list" CTA so the page still has unique content for Google.
5. **City links section** — Links to top cities (Atlanta, Houston, Chicago, etc.) using the existing `TOP_CITY_SLUGS` list — gives Google internal link signals.
6. **FAQ section** — Visible Q&A matching the JSON-LD, answering "What is the best Black-owned hotel?", "How do I find Black-owned resorts?", etc. Real text content Google indexes.
7. **Breadcrumbs** — Home → Stays/Directory → [page name].

## Wiring

- Add the 4 routes to `src/App.tsx`.
- Add the 4 URLs to `scripts/generate-sitemaps.ts` so Google discovers them.
- Update `src/pages/landing/BlackOwnedIndexPage.tsx` (already exists at `/black-owned`) to link to these new pages in a "Featured collections" section.
- Add internal links from `/stays` and `/directory` to the relevant new landing pages.

## Technical details

- New shared component: `src/components/seo/SEOLandingPage.tsx` — reusable layout taking `{ title, h1, description, keyword, faqs, listings, breadcrumbs }` so all 4 pages share consistent structure.
- New page files:
  - `src/pages/landing/BlackOwnedHotelsPage.tsx`
  - `src/pages/landing/BlackOwnedResortsPage.tsx`
  - `src/pages/landing/BlackOwnedVacationRentalsPage.tsx`
  - `src/pages/landing/SoulFoodNearMePage.tsx`
- Listings query: reuses `useBusinessDirectory` hook with category filter (already supports this).
- For the stays pages, queries the `vacation_rentals` / properties table by property type. For soul food, queries businesses where category matches the Soul Food group from `category-groups.ts`.

## Out of scope (for now)

- Per-city variants (e.g. "Black-owned hotels in Atlanta") — can be a follow-up once these 4 prove the pattern.
- Blog posts / articles — separate effort.
- Backlink outreach — manual work, not code.

## Expected outcome

- 4 new indexable pages live within minutes.
- Google starts crawling within ~1 week (sitemap submission).
- Realistic ranking on page 1 for the easy-win keywords within 2-3 months as listings populate.
- Each page = a free customer-acquisition channel that compounds over time.

Ready to build all 4 — say the word and I'll ship them.