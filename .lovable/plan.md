
# Performance, Offline, and Testing Improvements

## Phase 1: Bundle Size Optimization

**Problem**: Heavy libraries like `recharts` (20 files), `mapbox-gl` (4 files), and PDF tools are statically imported, adding ~500KB+ to chunks that load on routes that don't need them. `framer-motion` (171 files) is too deeply embedded to lazy-load practically.

**Approach**:

### 1A. Lazy-load Recharts in all dashboard/analytics components
- Create a shared `LazyChart` wrapper component that wraps Recharts components behind `React.lazy` + `Suspense`
- Replace direct `from 'recharts'` imports in these 20 files with the lazy wrapper
- Affected files: `BusinessAnalyticsDashboard`, `AdminAnalyticsDashboard`, `SponsorAnalytics`, `BusinessDashboard`, `ValuationMetrics`, `GrowthDashboard`, `EarningsChart`, `PLReports`, `CashFlowChart`, `ProductAnalytics`, `QRCodeAnalyticsDashboard`, `GeographicAnalytics`, `EconomicImpactDashboard`, and others
- Remove `'recharts'` from `optimizeDeps.include` in vite.config.ts since it will be dynamically loaded

### 1B. Lazy-load Mapbox in all 4 map components
- The directory views already lazy-load `MapView` -- good
- Create a `LazyMapboxMap` wrapper for the 3 components that statically import `mapbox-gl`: `NoirTrackingMap`, `BusinessLocationMap`, `PropertyMap`
- These components are already on deep routes so the lazy boundary just needs to wrap the mapbox import

### 1C. Remove recharts and mapbox-gl from optimizeDeps.include
- Update `vite.config.ts` to remove `recharts` from the `include` list (it should only load on demand)
- Keep `mapbox-gl` in the `maps` manualChunk but ensure it's not eagerly pre-bundled

### 1D. Tree-shake framer-motion
- Cannot lazy-load (171 files), but can add `framer-motion` to the manualChunks to at least isolate it into its own cacheable chunk
- Add `'framer-motion': ['framer-motion']` to `manualChunks` in vite.config.ts

---

## Phase 2: Deeper Offline Caching

**Problem**: `useOfflineSupport` has empty stub implementations in `processQueuedAction` and only caches business directory data in localStorage. The offline queue never actually processes actions.

**Approach**:

### 2A. Implement real offline action processing
- Fill in the `processQueuedAction` switch cases with actual Supabase calls for:
  - `business_favorite`: Call `supabase.from('favorites').upsert(...)` 
  - `profile_update`: Call `supabase.from('profiles').update(...)`
  - `review_submit`: Call `supabase.from('reviews').insert(...)`
- Add typed interfaces for queued actions instead of `any`

### 2B. Expand offline data caching
- Cache user profile data in localStorage for offline access
- Cache favorite businesses for offline browsing
- Add a `useOfflineBusinessDirectory` hook that serves cached data when offline and fresh data when online, integrated with the existing `getCachedBusinessData` pattern
- Increase cache TTL from 1 hour to 24 hours for mobile users (detect via viewport or Capacitor)

### 2C. Add offline UI indicator
- Create a persistent but unobtrusive offline banner component that shows when `isOnline` is false
- Show queued action count badge so users know their actions are saved
- Add this to `MainLayout` alongside the existing PWA install banner

---

## Phase 3: Automated Test Coverage

**Problem**: Existing tests are pure logic/utility tests. No actual component rendering tests, no hook tests, no integration tests that verify real UI behavior.

**Approach**:

### 3A. Add component rendering tests for critical auth flows
- `LoginPage.test.tsx`: Render login form, verify fields exist, simulate form submission with mocked Supabase, verify error handling displays
- `SignupPage.test.tsx`: Render signup form, test business vs customer toggle, verify validation messages appear

### 3B. Add hook tests for core business logic
- `useOfflineSupport.test.ts`: Test online/offline state transitions, queue behavior, cache read/write
- `useAuth.test.ts`: Test session detection, role-based routing logic, sign-out cleanup

### 3C. Add integration tests for payment flow
- `SubscriptionPage.test.tsx`: Render subscription tiers, verify iOS blocking works (mock Capacitor), test checkout button triggers Stripe edge function
- `QRPaymentButton.test.tsx`: Test payment flow initiation, error toast on failure, success callback

### 3D. Add iOS platform blocking test
- Test that `IOSProtectedRoute` correctly blocks payment UI when Capacitor reports iOS platform
- Test that it allows through on web/Android

---

## Technical Details

**Files to create**:
- `src/components/charts/LazyChart.tsx` (Recharts lazy wrapper)
- `src/components/maps/LazyMapboxMap.tsx` (Mapbox lazy wrapper)
- `src/components/ui/OfflineBanner.tsx` (offline indicator)
- `src/test/components/LoginPage.test.tsx`
- `src/test/components/SignupPage.test.tsx`  
- `src/test/hooks/useOfflineSupport.test.ts`
- `src/test/components/SubscriptionPage.test.tsx`
- `src/test/components/IOSProtectedRoute.test.tsx`

**Files to modify**:
- `vite.config.ts` (manualChunks + optimizeDeps changes)
- `src/hooks/use-offline-support.ts` (implement stubs, add types)
- `src/components/layout/MainLayout.tsx` (add OfflineBanner)
- ~20 dashboard/analytics files (swap recharts imports for LazyChart)
- 3 map component files (swap mapbox imports for lazy wrapper)

**Estimated impact**:
- Initial bundle: ~300-400KB reduction (recharts + mapbox deferred)
- Offline: Real action syncing + 24hr directory cache + profile cache
- Tests: 5+ new test files covering auth, payments, offline, and iOS blocking
