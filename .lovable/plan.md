# Add Office Space & Warehouse Property Types

Currently the lease platform offers 5 residential property types: Apartments, Houses, Condos, Lofts, Townhouses. This adds 2 commercial types so hosts can list — and renters can browse — **Office Space** and **Warehouse**.

## Scope

| Surface | What changes |
|---|---|
| Tabs on `/stays/lease` | 2 new tabs appear: "Office Space" + "Warehouse" |
| Category landing pages | `/stays/lease/category/office-space` and `/warehouse` work with SEO copy |
| Filters | Hosts can pick these types when creating/editing a listing |
| Bulk upload | New values accepted in the CSV (comma-separated values) importer |
| Detail pages | Type chip shows correctly |
| Saved-search emails | These types flow through automatically (no extra work) |

## How it works

There's one central file (`src/lib/lease/property-types.ts`) that drives every tab, icon, label, and SEO intro across the whole platform. Adding two entries there propagates everywhere automatically. The database also has an enum (a fixed list of allowed values) that needs the two new entries added.

## Steps

1. **Database migration** — extend the `property_type` enum to add `office_space` and `warehouse`.
2. **Add 2 entries** to `PROPERTY_TYPES` in `src/lib/lease/property-types.ts`:
   - **Office Space** — icon: Briefcase, slug: `office-space`, SEO copy for "lease office space from Black-owned commercial landlords"
   - **Warehouse** — icon: Warehouse, slug: `warehouses`, SEO copy for "warehouse and industrial space lease"
   - Swap the Townhouse icon (currently `Warehouse`, which was a fallback) to something more appropriate like `Building`
3. **Update the TypeScript union types** (`PropertyTypeSlug` and `PropertyTypeValue`) to include the new values.
4. **Spot-check** the create/edit lease pages to confirm the new options appear in dropdowns (they pull from `PROPERTY_TYPES` automatically — likely zero changes needed).

## Files touched

- `supabase/migrations/<new>.sql` — `ALTER TYPE property_type ADD VALUE`
- `src/lib/lease/property-types.ts` — add 2 entries + update type unions
- *(possibly)* `src/pages/stays/HostCreateLeasePage.tsx` / `HostEditLeasePage.tsx` if they hard-code the dropdown instead of reading from the central file — will verify and only edit if needed

## What you'll see after

- 7 tabs on `/stays/lease` instead of 5
- Hosts can choose Office Space or Warehouse when listing a property
- SEO-optimized landing pages at `/stays/lease/category/office-space` and `/warehouse`
- No impact on existing listings — they keep their current type

## Open questions

1. **Pricing model** — commercial rent is usually quoted **per square foot per year** (e.g., "$22/sf/yr") rather than per month. Do you want me to:
   - **(a)** keep using the existing monthly rent field for now (simplest, ships today), or
   - **(b)** add a "Commercial rate type" field that lets hosts choose monthly vs. per-sf-per-year (cleaner, ~30 min extra work)?
2. **Should warehouses get sub-types** later (flex space, distribution, cold storage)? Not in this plan — flagging for a future iteration.
