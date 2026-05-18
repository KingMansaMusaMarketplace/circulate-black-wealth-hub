# Fix: Directory "Failed to load businesses" error

## What's actually wrong (plain English)

The directory page calls two database functions to load the business list and the map pins. Both are timing out because the directory now has **~44,000 businesses** (39,467 with map coordinates), and the search functions weren't written to handle that volume. Postgres cancels them after a few seconds and the frontend shows the red "Something went wrong" card.

This is a backend (database) issue, not a frontend bug. Refreshing won't help until the functions are fixed.

## The two slow functions

1. **`search_directory_businesses`** — used for the paginated list. Does a `NOT EXISTS … ILIKE '%token%'` loop across 7 text columns. Postgres can't use the fast text indexes (`gin_trgm`) with that pattern, so it scans every row.
2. **`get_directory_map_markers`** — used for the map. Returns **all 39k+ markers at once** with no limit, and uses the same slow `ILIKE` pattern for search.

## The fix

Replace both functions via a database migration. No frontend changes needed.

### `search_directory_businesses`
- Rewrite the search so the trigram (`gin_trgm`) indexes are actually used: combine the search columns into a single `ILIKE ANY` / `%>` similarity check against `business_name` and `city` (the two fields users actually search).
- Drop the per-token `NOT EXISTS` subquery. Use a simpler `AND` chain of `ILIKE` against a precomputed search vector.
- Keep the existing pagination (`p_limit`, `p_offset`) and the `COUNT(*) OVER()` total.

### `get_directory_map_markers`
- Add a hard cap (e.g. `LIMIT 2000`) so it never returns 39k rows.
- Prefer verified + highly-rated markers first (matches what users see on the map anyway).
- Same simplified search path as above.

### Supporting index (if needed)
- Add a combined trigram index on `(business_name || ' ' || coalesce(city,'') || ' ' || coalesce(category,''))` only if the rewritten query still isn't fast enough after testing.

## Verification

After the migration:
1. Reload `/directory` — the list and map should load in under 2 seconds.
2. Try a search like "Chicago" or "salon" — results should appear quickly.
3. Watch the Postgres logs for any remaining `statement timeout` errors.

## What you (the user) need to do

Nothing right now. Once you approve this plan, I'll write and run the database migration. You'll see an approval prompt for the SQL change — click approve and the directory will start working again.

## Technical details (for reference)

- Table: `public.businesses`, 44,144 rows total, 44,105 `listing_status='live'`, 39,467 with lat/lng.
- Existing indexes already include `gin_trgm_ops` on `business_name`, `name`, `city`, `state`, `category`, plus `idx_businesses_live_ranking` and `idx_businesses_live_geo` — they just aren't being used by the current function bodies.
- Root error from `postgres_logs`: `canceling statement due to statement timeout` on both RPCs, repeating.
