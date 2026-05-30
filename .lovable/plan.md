## Goal
Embed the uploaded **MansaStays-LeaseListing-2min.mp4** as a clickable video player inside the "New on Mansa Stays / Looking for a yearly lease?" banner on `/stays`, so visitors can press play and watch "How to List your Leasing Property" right from that box.

## What you'll see
The banner currently has two columns:
- **Left:** headline, description, "Browse Yearly Leases" + "List Your Rental" buttons
- **Right (desktop only):** two small info cards ("12-month leases", "Free to list")

Change: replace the two info cards on the right with a **video player card** showing the lease listing video. The two small facts ("12-month leases", "Free to list • $99 success fee only") move underneath the left text as a slim badge row, so we don't lose them.

On mobile, the video appears below the text (currently the right column is hidden on mobile — we'll show the video on mobile too since it's the main asset).

## Files

1. **Copy the uploaded video into the project**
   - From: `user-uploads://MansaStays-LeaseListing-2min.mp4`
   - To: `public/videos/MansaStays-LeaseListing-2min.mp4`
   - (Goes in `public/` so it can be served directly to the `<video>` tag.)

2. **Edit `src/pages/VacationRentalsPage.tsx`** (lines ~222–278, the "Yearly Leases Banner" block)
   - Right column: replace the two info-card grid with a `<video>` element:
     - `controls`, `preload="metadata"`, `playsInline`
     - `poster` = a still frame (we'll reuse `chicagoHero` already imported in the project, or a lease-related asset) so users see a meaningful thumbnail before pressing play
     - Rounded card with the same gold border styling as the rest of the banner
     - Overlay caption "How to List your Leasing Property — 2 min" (matches the title-card language we agreed on)
   - Move the two facts ("12-month leases" and "Free to list • $99 success fee only") into a small inline badge row under the description so the information isn't lost.
   - Make the video visible on mobile too (remove the `hidden md:flex` wrapper for the right column).

## Technical notes
- Native HTML5 `<video>` is enough here — no new dependency, no YouTube embed, no modal. One click on the player starts playback inline.
- The MP4 will be served from `/videos/MansaStays-LeaseListing-2min.mp4`. Browsers stream it; the user only downloads what they watch.
- File size note: a 2-minute 1920×1080 MP4 is typically 15–40 MB. That's fine in `public/` but it does add to the initial site bundle on disk. If you'd prefer to host it on YouTube/Vimeo instead (smaller repo, adaptive quality), say the word and I'll swap the `<video>` for an embed.

## What you need to do
Nothing — just approve the plan. After you click **Implement plan**, I'll copy the video into `public/videos/` and update the banner.