

## Fix: Stale Service Worker Cache Serving Old Hero Content

### Root Cause

Your app uses `vite-plugin-pwa` with Workbox, which generates a service worker that **precaches** all your built JS/CSS/HTML chunks. When you deploy new code, returning visitors' browsers still run the **old service worker** which serves the old cached content (the "1325.AI", "Circulate. Accumulate.", BHM promo version of the hero).

Even though `skipWaiting: true` and `autoUpdate` are configured, the old precached assets remain until the new service worker fully activates and clears them -- which can take multiple page loads or fail silently.

### Plan

**1. Add a version-aware cache-busting mechanism to `src/main.tsx`**

Add logic at app startup that detects when a new version is available and forces the old service worker caches to clear immediately, then reload:

- Store a build version string (timestamp-based) in the app
- On load, compare with `localStorage` stored version
- If mismatch, unregister all service workers, clear all caches, and reload once

**2. Update `vite.config.ts` PWA config for better cache invalidation**

- Add `cleanupOutdatedCaches: true` to the Workbox config to automatically remove old precache entries
- Set `navigateFallback: 'index.html'` with `navigateFallbackDenylist` to prevent stale HTML from being served

**3. Bump the cache-buster version in `RefreshPage.tsx`**

- Update the `v` query param from `4` to a timestamp-based value so it always busts

### Technical Details

```text
Files to modify:
  1. vite.config.ts         -- Add cleanupOutdatedCaches: true to workbox config
  2. src/main.tsx            -- Add version check + auto-clear logic at boot
  3. src/pages/RefreshPage.tsx -- Use Date.now() for cache-buster param
```

**vite.config.ts changes:**
- Add `cleanupOutdatedCaches: true` inside the `workbox` block
- This tells Workbox to automatically delete old precache entries when a new service worker activates

**src/main.tsx changes:**
- Define a `BUILD_VERSION` constant (e.g., current timestamp string)
- On app init, compare against `localStorage.getItem('app_build_version')`
- If different: unregister service workers, clear caches, save new version, reload
- This guarantees returning visitors always get the latest build within one reload

**src/pages/RefreshPage.tsx changes:**
- Replace hardcoded `?v=4` with `?v=${Date.now()}` to ensure a unique cache-bust every time

This will permanently fix the stale content issue for all users, including those on the published site.
