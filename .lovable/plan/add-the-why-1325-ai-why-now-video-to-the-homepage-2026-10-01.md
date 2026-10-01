# Add the "Why 1325.AI, Why Now" video to the homepage

## Where it goes
Right below the top headline and buttons, just above the "three reasons people buy" band. This is the first thing visitors scroll to, and the video explains the "why" before the page asks them to buy or sign up.

```text
[ Top headline + buttons ]
[ VIDEO  |  "Why 1325.AI. Why now."  short line + "Get listed" button ]   <- new
[ Three reasons people buy ]
[ Sponsor wall ]
[ ... rest of page ]
```

## How it looks and behaves
- The video is tall (phone-shaped), so on computers it sits on the left with a short headline and one button on the right. On phones it fills the width, with the text underneath.
- Shows a still cover image with a gold play button. It does not play until someone taps it, so the page stays fast and nobody gets sound they didn't ask for.
- Sound on when tapped, with normal play/pause controls. 66 seconds long.
- Black and gold styling, matching the rest of the site.

## Technical details
- Source is 4K vertical (2160x3840), 133 MB, which is too heavy for the web. Make a 1080x1920 web copy (about 15–25 MB) plus a cover image (JPEG) with ffmpeg in /tmp, then upload both as Lovable assets (`src/assets/why-1325-why-now.mp4.asset.json`, poster `.jpg`).
- New component `src/components/homepage/WhyNowVideo.tsx`: `<video preload="none" poster controls playsInline>`, revealed on click; inserted in `src/pages/HomePage.tsx` just before `<WhyBuyBand />`.
- Uses existing color tokens only.
