# Upgrade React Router 6 → 7 (staged, low risk)

## The short version

I checked how your site uses the navigation library. The good news: you only use the
simple, classic parts of it — links, page routes, and a handful of helper hooks. You do
**not** use the advanced "data router" features that make most version 7 upgrades painful.

That means this is closer to a version bump with careful testing than a rewrite. It closes
the 3 medium security warnings on `react-router-dom`.

## What I found in the codebase

- 310 files import from `react-router-dom`, but they only use: `Link`, `NavLink`, `Outlet`,
  `Routes`, `Route`, `Navigate`, `useNavigate`, `useParams`, `useLocation`, `useSearchParams`.
  All of these exist unchanged in version 7.
- `src/App.tsx` holds every route (~1,300 lines), switching between `HashRouter` (iOS app)
  and `BrowserRouter` (web). Both still exist in version 7.
- No `createBrowserRouter`, no loaders/actions, no `json()`/`defer()`/`Await`, no
  `unstable_` APIs. These are the usual breakage sources — you have none.
- Tests use `BrowserRouter` (`src/test/utils/test-providers.tsx`) and `MemoryRouter`
  (`src/test/security.test.tsx`) — both unchanged.
- `vite.config.ts` names the package twice (bundle chunk + pre-bundle list) — needs no
  change, just a rebuild check.

## Stage 1 — Prepare on version 6 (no visible change)

1. Turn on version 7's behavior early using the built-in "future flags" on the routers in
   `src/App.tsx`: `v7_startTransition` and `v7_relativeSplatPath`.
2. Run the test suite and the investor route crawl (`scripts/investor-crawl.mjs`).
3. Fix any warnings that appear in the browser console.

If anything misbehaves here, it is a one-line revert — nothing has actually upgraded yet.

## Stage 2 — The upgrade

1. Install `react-router-dom@7` (latest 7.18.x).
2. Remove the future flags added in Stage 1 (they become the default and warn if left).
3. Run a type check across the app.
4. Confirm the two `src/test/` router wrappers still compile.

## Stage 3 — Verification before anything ships

1. Full test suite.
2. Automated crawl of all public + investor routes, failing on any 4xx/5xx or console error
   (the CI job already built for this).
3. Manual spot-check in the preview: directory browse → business profile → claim flow,
   admin panel deep links, investor portal, and the dashboard redirects.
4. iOS check: the native app uses hash-style URLs (`#/page`). Build and confirm deep links
   and back-button behavior still work before submitting a new build to Apple.

## Stage 4 — Ship

Publish to web first, watch Sentry for navigation errors for 48 hours, then cut the next
iOS build. Rollback is a single dependency downgrade.

## Files expected to change

| File | Change |
| --- | --- |
| `package.json` / lockfile | version bump |
| `src/App.tsx` | future flags added in Stage 1, removed in Stage 2 |
| `vite.config.ts` | only if the bundle chunking complains |
| `src/test/utils/test-providers.tsx`, `src/test/security.test.tsx` | only if a type error appears |

The other ~306 files should need **zero edits**. If any do, it will be a mechanical import
fix, not a logic change.

## Risks

- **Low:** the iOS hash-based routing is the least-tested path in version 7. Stage 3's
  device check exists specifically for this.
- **Low:** relative links inside nested routes (`v7_relativeSplatPath`) can shift. Stage 1
  surfaces this before the real upgrade.
- **Timing:** do not start this while an App Store review is pending. If Build 36 is still
  under review, we wait for its verdict first.

## What I need from you

Just a "go". Tell me if you want all four stages in one pass, or Stage 1 alone first so you
can click around the live preview before we commit to the upgrade.
