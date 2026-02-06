

# Fix: Safari Marketplace Not Showing (0 Businesses)

## Problem Summary

Maurice reports the Marketplace shows "0 businesses found" on Safari but works on Chrome. The screenshot confirms the UI loads correctly but no business data appears.

## Root Cause Analysis

A recent security hardening update broke anonymous user access:

1. **RLS Policy Change**: Migration `20260204200120` dropped all public SELECT policies on `businesses` table and replaced them with policies that ONLY allow `authenticated` users

2. **Security Invoker View**: The `business_directory` view was created with `security_invoker = true`, meaning it inherits the caller's permissions. Anonymous users have no RLS policy to read from `businesses`, so the view returns 0 rows.

3. **Safari vs Chrome Difference**: Chrome users are likely logged in (authenticated) so policies work. Safari users are often not logged in or have stricter cookie policies (ITP), so they hit the anonymous path which currently fails.

4. **Frontend Issue**: The `useSupabaseDirectory` hook queries the `businesses` table directly (line 89-91), not the secure view or RPC function.

## Database State Verified

| Check | Result |
|-------|--------|
| Businesses with `listing_status='live'` or `is_verified=true` | **57 rows** |
| RLS enabled on `businesses` table | **Yes** |
| RLS policies for `anon` role | **None** |
| `get_public_businesses` RPC exists with SECURITY DEFINER | **Yes** |
| `anon` can EXECUTE the RPC | **Yes** |

## Solution

### Option A: Fix the View (Recommended)
Recreate `business_directory` view without `security_invoker = true` so it runs with owner privileges:

```sql
DROP VIEW IF EXISTS public.business_directory CASCADE;

CREATE VIEW public.business_directory AS 
SELECT 
  id, business_name, name, description, category, address,
  city, state, zip_code, website, logo_url, banner_url,
  is_verified, average_rating, review_count, created_at, updated_at,
  latitude, longitude, listing_status, is_founding_member, is_founding_sponsor
FROM businesses b
WHERE (is_verified = true OR listing_status = 'live');

GRANT SELECT ON public.business_directory TO anon;
GRANT SELECT ON public.business_directory TO authenticated;
```

### Option B: Add RLS Policy for Anonymous Users
Add a restricted SELECT policy for the `anon` role:

```sql
CREATE POLICY "Anonymous can view public businesses"
ON public.businesses
FOR SELECT
TO anon
USING (listing_status = 'live' OR is_verified = true);
```

### Frontend Fix (Both Options)
Update `useSupabaseDirectory` to use the RPC function instead of direct table access:

**File: `src/hooks/use-supabase-directory.ts`**

Change lines 88-97 from:
```typescript
const { data, error } = await supabase
  .from('businesses')
  .select('*')
  .order('average_rating', { ascending: false, nullsFirst: false })
  .order('review_count', { ascending: false })
  .limit(100);
```

To:
```typescript
const { data, error } = await supabase
  .rpc('get_public_businesses', { p_limit: 100 })
```

Or use the secure view:
```typescript
const { data, error } = await supabase
  .from('business_directory')
  .select('*')
  .order('average_rating', { ascending: false, nullsFirst: false })
  .order('review_count', { ascending: false })
  .limit(100);
```

## Recommended Approach

1. **Database Migration**: Recreate the view WITHOUT `security_invoker` (Option A)
2. **Frontend Update**: Change `useSupabaseDirectory` to use `business_directory` view
3. **Verify**: Test on Safari in incognito mode to confirm anonymous access works

## Files to Modify

| File | Change |
|------|--------|
| New migration SQL | Recreate `business_directory` without security_invoker |
| `src/hooks/use-supabase-directory.ts` | Query from `business_directory` view instead of `businesses` table |

## Testing Checklist

- [ ] Open Safari incognito mode (not logged in)
- [ ] Navigate to /directory
- [ ] Verify businesses appear (should show 57)
- [ ] Test search functionality
- [ ] Test category filtering
- [ ] Verify Chrome still works for logged-in users

