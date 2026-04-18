
Got it — keep playback **on the homepage**, no new tabs, no full-screen modal failures. Here's the revised approach.

## The fix: inline player that swaps in place

When a user clicks a thumbnail, the thumbnail itself transforms into the playing video — right inside its card on the homepage. No modal, no tab switch, no `youtube-nocookie`, no oversized iframe origin checks.

## Why this works where the modal failed

The "Content blocked" issue hits the **modal iframe** because it loads at full viewport size with autoplay against a flagged origin. An inline iframe inside the existing card (smaller, user-initiated click, standard `youtube.com/embed` URL with the proper `origin` param) is treated as a normal embed — the same way every blog and news site embeds YouTube successfully.

If for any reason a single video still gets blocked, we show an inline "Watch on YouTube" fallback **inside that same card** (not a new tab) so the layout never breaks.

## What changes (2 files)

**1. New component: `src/components/video/InlineYouTubePlayer.tsx`**
- Renders the thumbnail with the red play button (current look).
- On click: swaps to a same-sized `<iframe>` of `https://www.youtube.com/embed/{id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&origin={window.location.origin}`.
- Tracks `iframeBlocked` via `onError` + a 4s timeout. If blocked, shows a compact in-card fallback: "This video is blocked in this view" + a small "Watch on YouTube" button (still on-page, just a link).

**2. `src/components/HomePage/LatestFromYouTube.tsx`**
- Remove `YouTubeModal` + `activeVideo` state.
- Replace each thumbnail button with `<InlineYouTubePlayer video={video} />`.

**3. `src/components/HowItWorks/SponsorshipVideoSection.tsx`**
- Same swap: remove modal, render `<InlineYouTubePlayer />` inside each card.
- Keep the existing motion/animation wrappers and styling.

`YouTubeModal.tsx` stays untouched (used elsewhere).

## Result

- User stays on the homepage ✅
- Video plays inside the card it was clicked ✅
- No full-screen modal that YouTube's anti-bot flags ✅
- Graceful in-card fallback if a specific video ever fails ✅
- Same visual design — thumbnails, titles, dates, gold accents preserved ✅
