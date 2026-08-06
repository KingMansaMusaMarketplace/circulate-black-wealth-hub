# Home Preview CTA Button Color Options

## The question
Should the three hero CTA buttons on `/home-preview` all be different colors?

## My recommendation
No — three different colors on the same hero row would compete for attention and weaken the conversion hierarchy. The current gold primary "Sign up free" CTA should stay dominant.

## What I suggest instead
Give the two secondary actions distinct but complementary treatments, not three competing colors:

- **Sign up free** — keep as the gold primary CTA.
- **Browse the directory** — keep the white/outline secondary style.
- **Meet the 1325.AI Team** — use a third, muted treatment (subtle blue-tinted outline, ghost, or a soft accent variant) so the three buttons feel like a clear sequence rather than a rainbow.

## What will change
1. File: `src/pages/HomePreviewPage.tsx` — adjust the Tailwind classes on the two secondary CTA `<Link>` buttons so they are visually distinct while staying within the dark theme.
2. No route, text, or tracking changes.

## Verification
- Preview `/home-preview` on desktop and mobile widths.
- Confirm the gold CTA remains visually dominant.
- Confirm the row still wraps correctly on mobile.
- Confirm no build or TypeScript errors.
