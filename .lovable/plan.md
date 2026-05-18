# Phase 3 — Unify Lease Search with Directory Look & Feel

Make `/stays/lease` feel like a sibling of `/directory`: same header band, search row, filter panel, view toggles, results summary, and pagination. Keep all lease-specific data (price, beds/baths, photos, Mapbox map) intact.

## What changes (in plain English)

1. **Same page shell as the Directory.** The lease search page gets the Directory's header, search bar, filter button, view-mode tabs, results count line, and pagination styling — so the two pages feel like one product.
2. **Three view tabs:** Grid (default) · List · Map — matching the Directory.
3. **Filter panel** opens/closes like the Directory's, but the inputs stay lease-specific: city, price range, bedrooms, bathrooms, pets, Section 8, furnished, property type.
4. **Cards keep their lease features** — photo carousel, price pill, "Verified" badge, "Updated 2d ago" stamp.
5. **Map view stays Mapbox** with price-pill markers (already built); only the tab chrome around it changes to match Directory tabs.
6. **New: price-tier jump rail** ($, $$, $$$, $$$$) — same idea as the Directory's A–Z letter rail, but for rent tiers. Helps users skim by budget.

## What does NOT change

- Database, RLS, edge functions — untouched.
- Landlord (host) dashboard, create/edit pages, photo uploader — untouched.
- Listing detail page (`/stays/lease/:id`) — untouched.
- Directory page — untouched.

## Files

**New**
- `src/components/browse/BrowseLayout.tsx` — shared shell (header slot, search row, filter slot, tabs, results summary, pagination).
- `src/components/stays/lease/LeasePriceRail.tsx` — price-tier jump rail.
- `src/components/stays/lease/LeaseListRow.tsx` — list-view row (denser than the card).

**Edited**
- `src/pages/stays/LeaseSearchPage.tsx` — rebuilt on top of `BrowseLayout`; keeps existing data hooks, filters state, and Mapbox toggle.

## Technical notes

- Reuses Directory chrome patterns from `DirectorySearchBar`, `DirectoryResultsSummary`, `DirectoryPagination`, and the `Tabs` view-mode pattern in `DesktopContentRenderer`, but extracted into a generic `BrowseLayout` so we don't import directory-specific code into Stays.
- Tailwind tokens only (MansaBlue / MansaGold / true black). No hard-coded colors.
- No new packages, no new secrets, no schema changes.
- Mobile: same responsive behavior as the Directory (filters collapse into a sheet, tabs become a sticky bar).

## Effort & risk

- ~1 focused build pass. Low risk — purely presentational refactor of one page.
- Easy rollback: revert `LeaseSearchPage.tsx` to current version.

## Your next step

Click **Implement plan**. After it ships I'll ask you to spot-check `/stays/lease` on desktop and mobile and confirm the Grid / List / Map tabs all feel right.
