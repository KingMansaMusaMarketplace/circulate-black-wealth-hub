# Put the "Autonomous Enterprise" Kayla ad on the homepage

## My opinion
Yes, it's a strong fit. It's the only video that shows Kayla and the 42 Agentic AI Employees working for an owner, which is the core of what we sell. One concern: the homepage already has two tall videos near the top ("Why 1325.AI. Why now." and the Holiday Special). A third one right next to them would crowd the page. So I'd give the new ad its own section further down, where visitors are already deciding whether to buy.

## BOARD CHECK
- What changes: one new video section on the public homepage. Nothing else moves.
- Public claims in the video: ~4 Roles Covered, $20,450/mo savings, 68x return, and the patent mention. These match our approved numbers, but this is public marketing, so attorney review is recommended before publishing.
- Brand: uses the HeyGen Kayla only. Kayla Bruton's photo is never used.
- Risk: low. The video only loads when someone taps play, so the page doesn't get slower.

## Where it goes
```text
[ Top headline + buttons ]
[ Why 1325.AI. Why now. video ]
[ Holiday Special video ]
[ Three reasons people buy ]
[ NEW: "Meet your autonomous workforce" + Kayla ad + "Start free" button ]
[ ... rest of page ]
```

## How it looks
- Black and gold card, like the Holiday video card: the video on one side, a short headline and one button on the other. On phones, the video comes first and the text goes underneath.
- Headline: "Meet your autonomous workforce." Subtext: "Kayla and 42 Agentic AI Employees run the back office so you can run your business." Button: "Start free," which goes to the existing sign-up page.
- Shows a still cover with a play button. Sound plays only after someone taps it.

## Technical details
- Source: the final version 7 Instagram video (vertical, about 85 seconds). Make a web copy around 1080x1920 at about 15–20 MB, plus a cover image, using ffmpeg in /tmp. Upload both as Lovable assets in `src/assets/`.
- New `src/components/homepage/AutonomousWorkforceVideo.tsx` that reuses `TapToPlayVideo`, inserted in `src/pages/HomePage.tsx` right after `<WhyBuyBand />`.
- Uses existing mansagold and black styling only.
