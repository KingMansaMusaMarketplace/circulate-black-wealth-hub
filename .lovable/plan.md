

## Fix: Home Page Refresh Appears Frozen

### Problem
When refreshing `/`, the page appears completely frozen with no visual feedback because:
1. **No loading indicator** -- `appReady` is hardcoded to `true` (line 284 of App.tsx), so no spinner ever shows
2. **No data refetch** -- React Query is configured with `refetchOnMount: false` and `refetchOnWindowFocus: false`, so cached data persists across refreshes
3. **Silent error swallowing** -- The global error handler in `index.html` calls `e.preventDefault()` on ALL errors, hiding any rendering failures

### Plan

**1. Add a brief refresh indicator on the Home Page**
- In `HomePage.tsx`, detect a page refresh using `performance.navigation.type` or a sessionStorage flag
- Show a subtle top-bar loading animation (gold gradient bar) for ~500ms on refresh so the user sees visual confirmation the page reloaded

**2. Force fresh data on mount for homepage sections**
- In `HomePage.tsx`, call `queryClient.invalidateQueries()` on mount to ensure Featured Businesses and other Supabase-backed sections refetch fresh data after a refresh
- This works alongside the existing `refetchOnMount: false` default by explicitly invalidating stale queries

**3. Re-trigger hero entrance animations on refresh**
- Add a `key` prop based on a refresh counter or timestamp to the `<Hero />` component so framer-motion entrance animations replay after a browser refresh, giving clear visual feedback that the page reloaded

### Technical Details
- Files modified: `src/pages/HomePage.tsx`
- The React Query `invalidateQueries()` call ensures data-driven sections (FeaturedBusinesses, sponsors) fetch fresh data
- The animation replay uses React's key-based remounting -- changing the key forces React to unmount and remount the component, replaying all `initial`/`animate` transitions
- No changes to global error handling or App.tsx needed for this fix

