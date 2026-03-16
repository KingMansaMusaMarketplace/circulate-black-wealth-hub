

## Problem

The directory page fetches **all 17,000+ businesses** in 18 sequential network requests (1,000 per batch) before rendering anything. The user sees a blank white screen with a spinner for ~18 seconds until every batch completes. This will only get worse as the directory grows toward 100K.

## Solution: Server-side pagination with instant first page

Instead of loading all businesses client-side, switch to **server-side pagination** that loads only one page at a time (e.g., 24 businesses per page). The first page renders in under 1 second.

### Changes

**1. Rewrite `useSupabaseDirectory` hook** (`src/hooks/use-supabase-directory.ts`)
- Remove the `while(true)` loop that fetches all businesses
- Add `page` and `pageSize` state (default: page 1, 24 per page)
- Single RPC call: `get_directory_businesses({ p_limit: 24, p_offset: (page-1)*24 })`
- Move search/category filtering to a **new server-side RPC** so we don't need all data client-side
- Keep the Kayla realtime listener but invalidate current page only
- Expose `setPage`, `totalPages` in the return

**2. Create a new Supabase RPC** `search_directory_businesses`
- Accepts: `p_search_term`, `p_category`, `p_min_rating`, `p_limit`, `p_offset`
- Returns matching businesses + `total_count` (using `COUNT(*) OVER()`)
- Handles filtering server-side so we never need to download the full dataset
- Categories list fetched via a separate lightweight query

**3. Add a `get_directory_categories` RPC**
- Returns distinct categories from verified businesses
- Small, fast query cached aggressively

**4. Update `DirectoryPage.tsx`**
- Add pagination controls at the bottom (already have `DirectoryPagination` component)
- Show total count from server response instead of `businesses.length`
- Remove client-side filtering logic (now handled server-side)

**5. Update `CategoryPills` usage**
- Categories fetched from dedicated RPC instead of derived from all businesses

### Technical details

```sql
-- New RPC for paginated, filtered directory search
CREATE OR REPLACE FUNCTION search_directory_businesses(
  p_search_term TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_min_rating NUMERIC DEFAULT NULL,
  p_limit INT DEFAULT 24,
  p_offset INT DEFAULT 0
)
RETURNS TABLE(
  id UUID, business_name TEXT, name TEXT, description TEXT,
  category TEXT, address TEXT, city TEXT, state TEXT, zip_code TEXT,
  website TEXT, logo_url TEXT, banner_url TEXT, is_verified BOOLEAN,
  average_rating NUMERIC, review_count INT, latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ,
  listing_status TEXT, total_count BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.id, b.business_name, b.name, b.description,
         b.category, b.address, b.city, b.state, b.zip_code,
         b.website, b.logo_url, b.banner_url, b.is_verified,
         b.average_rating, b.review_count, b.latitude, b.longitude,
         b.created_at, b.updated_at, b.listing_status,
         COUNT(*) OVER() AS total_count
  FROM businesses b
  WHERE b.listing_status = 'live'
    AND (p_search_term IS NULL OR
         b.business_name ILIKE '%' || p_search_term || '%' OR
         b.category ILIKE '%' || p_search_term || '%' OR
         b.description ILIKE '%' || p_search_term || '%')
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
  ORDER BY b.is_verified DESC, b.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- Lightweight categories query
CREATE OR REPLACE FUNCTION get_directory_categories()
RETURNS TABLE(category TEXT, count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.category, COUNT(*) as count
  FROM businesses b
  WHERE b.listing_status = 'live' AND b.category IS NOT NULL
  GROUP BY b.category
  ORDER BY count DESC;
$$;
```

The hook changes from ~18 seconds of sequential fetches to a single ~200ms query. Pagination, search, and filtering all happen server-side. The directory remains fully functional with the same UI, just dramatically faster.

