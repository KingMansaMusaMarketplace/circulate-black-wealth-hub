# Holiday Special video on the Holiday page and homepage

Good news first: 1325.ai/Holiday-Special already works on your live site, so no GoDaddy changes are needed.

## What changes
1. **Holiday Special page (1325.ai/Holiday-Special):** the 93-second video goes near the top, next to the "$149/mo" offer. It shows a cover picture with a gold play button and plays only when tapped.
2. **Homepage:** a small "Holiday Special" card right below the "Why 1325.AI. Why now." video. It has the same tap-to-play video, a line saying "Pro for $149/mo, locked in forever", and a "Claim the Holiday Special" button that goes to 1325.ai/Holiday-Special.

## Technical details
- Make a 1080x1920 web copy and a cover image from the 4K original with ffmpeg in /tmp, then upload both as Lovable assets (`holiday-special.mp4`, `holiday-special-poster.jpg`).
- Turn the current `WhyNowVideo` into a reusable `TapToPlayVideo` component (props: video, poster, label). Use it in `HolidaySpecialPage.tsx` and in a new `HolidayVideoCard` on `HomePage.tsx`.
