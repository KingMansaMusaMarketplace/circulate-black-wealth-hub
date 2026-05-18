# Property Categories + SEO Landing Pages

## What this does (plain English)

Adds **5 property type categories** — Apartment, House, Condo, Loft, Townhouse — so renters can filter by what they actually want, and Google can index dedicated pages for each (huge for free traffic). Also nudges hosts to update older listings that are stuck on "apartment" by default.

---

## Part 1 — Property type filter (the basics)

### a. Lease search page (`/stays/lease`)
- Add a **"Property type" pill row** at the top of the filter bar with 5 toggles: All · Apartments · Houses · Condos · Lofts · Townhouses.
- Tapping one re-runs the search and updates the URL (`?type=house`) so the filter is shareable and browser back-button friendly.
- Show the active type as a removable chip in the existing active-filters bar.

### b. Listing creation page (`/stays/host/lease/new`)
- Replace the hidden hardcoded `"apartment"` with a **visible dropdown** labeled "Property type *" with the 5 options.
- Default to Apartment but require the host to confirm by clicking.

### c. Listing detail page (`/stays/lease/:id`)
- Show the property type prominently next to bedrooms/bathrooms (e.g. "House · 3bd · 2ba").

### d. Database
- Add a database constraint so `property_type` for yearly leases can only be one of the 5 allowed values (prevents typos like "appartmnt").
- Update the search function (`search_lease_listings`) to accept an optional `p_property_type` argument.

---

## Part 2 — SEO landing pages (the traffic play)

Build a single reusable page component that handles **all combinations** via URL params. Two URL shapes:

```text
/stays/lease/:category                       e.g. /stays/lease/houses
/stays/lease/:city/:category                 e.g. /stays/lease/chicago/houses
```

Plus the existing `/stays/lease/chicago` and `/stays/lease/atlanta` (city-only) we'd planned for Phase 2.2.

### What each landing page contains
- **H1** (main heading): "Houses for Rent in Chicago" (auto-built from URL).
- **Intro paragraph** with city + category context (e.g. neighborhoods, average rents).
- **Listing grid** filtered to that category + city (re-uses the existing lease search component).
- **FAQ block** (3–4 questions like "What's the average rent for a house in Chicago?") — great for Google's "People also ask" rankings.
- **Title tag + meta description** (the snippet Google shows) auto-built per page.
- **JSON-LD structured data** (`RealEstateListing` schema) so Google understands these are rental listings, not blog posts.
- **Internal links** to sister pages (e.g. on `/chicago/houses`, link to `/chicago/condos` and `/atlanta/houses`).
- Fallback message + "Be the first to list" CTA when the grid is empty.

### Coverage at launch
- **2 cities** (Chicago, Atlanta) × **5 categories** + **5 nationwide category pages** + **2 city-only pages** = **17 landing pages** from a single component.
- Add all to `sitemap.xml` so Google can find them.

### Routing
- New routes in `App.tsx` (both router blocks for web + native):
  - `/stays/lease/:category` — nationwide by type
  - `/stays/lease/:city/:category` — city × type
- The existing `/stays/lease/:id` (listing detail) keeps working because UUIDs (long random IDs) don't collide with our short category/city slugs — but we'll guard with a regex so `houses` never gets treated as a listing ID.

---

## Part 3 — Backfill prompt for older listings (option B you picked)

- On the **Host Dashboard** (`/stays/host/lease/dashboard`), any listing where `property_type` was never set by the host shows a yellow inline banner: *"Pick a category so renters can find you →"* with a one-click dropdown.
- No automatic data change. We just flag the field as "needs review" by checking if the listing was created before today's migration date.

---

## Files affected

**New files (5):**
- `src/pages/stays/LeaseCategoryLandingPage.tsx` — the reusable landing page (handles all 17+ URL combos)
- `src/lib/lease/property-types.ts` — single source of truth for the 5 categories (label, slug, icon, SEO copy)
- `src/lib/lease/city-data.ts` — Chicago/Atlanta context (neighborhoods, avg rent stub)
- `src/components/stays/lease/PropertyTypeFilter.tsx` — the pill row
- `supabase/migrations/<timestamp>_lease_property_types.sql` — constraint + RPC update

**Edited files (5):**
- `src/pages/stays/LeaseSearchPage.tsx` — wire in the pill filter + URL sync
- `src/pages/stays/HostCreateLeasePage.tsx` — replace hidden type with dropdown
- `src/pages/stays/LeaseListingDetailPage.tsx` — show type label
- `src/pages/stays/HostLeaseDashboardPage.tsx` — backfill banner
- `src/App.tsx` — 2 new routes in both router blocks
- `public/sitemap.xml` (or sitemap generator) — add the 17 URLs

---

## Technical notes

- **Slug map:** `apartments → apartment`, `houses → house`, `condos → condo`, `lofts → loft`, `townhouses → townhouse`. URL uses plurals (better for SEO).
- **Single React component, many URLs:** the landing page reads `useParams()` for `city` and `category`, resolves them against the slug map, 404s on unknown slugs, then renders.
- **SEO sitemap:** I'll regenerate `public/sitemap.xml` to include all new URLs so Google indexes them within ~1–2 weeks.
- **No new Stripe / payment changes.** Pure schema + frontend.

---

## What you (the user) need to do after this ships

1. Visit `/stays/lease/chicago/houses` and `/stays/lease/atlanta/condos` to spot-check.
2. **Submit the updated sitemap to Google Search Console** (https://search.google.com/search-console) — paste `https://mansamusamarketplace.com/sitemap.xml`. Takes 30 seconds, makes Google find the pages faster.
3. (Optional) Tell me later what avg rents look like in Chicago/Atlanta and I'll plug real numbers into the FAQ blocks.

---

## Cost

~1 prompt to build all of this in one shot. After that, **Phase 2.3 (CSV bulk upload)** is the last item on the original Phase 2 list.
