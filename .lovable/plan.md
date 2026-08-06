Add a "Meet the 1325.AI Team" button next to the "Browse the directory" button on the /home-preview consumer landing page.

## What will change

1. **File: `src/pages/HomePreviewPage.tsx`**
   - In the hero CTA row (currently containing "Sign up free" and "Browse the directory"), add a third button: **"Meet the 1325.AI Team"**.
   - It will link to `/team` using `react-router-dom` `<Link>` and track a `home_preview_cta_team_click` funnel event.
   - On desktop, the three buttons will sit in a row; on mobile, they will stack as they do now.

2. **Visual treatment**
   - Use the same secondary outline style as "Browse the directory" (`border-white/25 bg-white/5`, white text, hover:bg-white/10) so the primary gold "Sign up free" stays dominant.

3. **What will NOT change**
   - No other pages, routes, or backend logic.
   - The `/team` route already exists (`LazyTeamPage`), so no new route is needed.

## Implementation detail

- Update the `motion.div` containing the primary CTAs in `src/pages/HomePreviewPage.tsx` (around lines 272-293).
- Add an import for the team icon if needed; otherwise, keep text-only button to match the existing secondary button.
- Add a `trackFunnelEvent` call with placement `'hero'` for analytics consistency.

## Verification

- After the change, preview `/home-preview` in desktop and mobile widths.
- Confirm the three buttons render correctly and "Meet the 1325.AI Team" navigates to `/team`.
- Confirm no build errors or TypeScript errors.
