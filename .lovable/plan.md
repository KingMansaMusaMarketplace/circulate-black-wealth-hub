# YouTube Growth Pack for @1325AI

Everything below is **free, made by me, no third party**. No code in your live web app changes — these are downloadable assets and a copy-paste doc.

## What you'll get (3 deliverables)

### 1. Three thumbnail options for your latest video
- **Format**: 1280x720 PNG, YouTube's required size, under 2MB.
- **Style**: True Black background, MansaBlue (#003366) + MansaGold (#FFB300), big bold readable text (3-5 words max), Kayla/AI motif.
- **Three directions** to A/B test:
  - **A) Bold Stat** — giant number ("$12,100/mo SAVED") + small face/icon
  - **B) Curiosity Gap** — provocative question ("Why 99% of AI is WRONG")
  - **C) Product Hero** — Kayla/dashboard visual + 2-word label ("MEET KAYLA")
- Saved to `/mnt/documents/thumbnails/` so you can download and upload to YouTube Studio → Customization → Thumbnail.

### 2. SEO rewrite doc for all existing videos
- **Format**: One Markdown file (`/mnt/documents/youtube-seo-rewrites.md`) with a section per video.
- **Per video**: New title (≤60 chars, keyword-front-loaded), new description (first 150 chars are the hook, then full pitch + links + timestamps), 15 tags, pinned comment, suggested end-screen CTA.
- **Source of truth**: I'll pull your real video list using the `youtube-latest-videos` edge function already in your project (it uses your YouTube API key). If that returns fewer than expected, I'll ask you to paste the missing titles.
- **Real YouTube SEO best practices**: keyword in first 60 chars of description, hashtags at end, no keyword stuffing in tags (it hurts ranking now), chapters/timestamps for watch time, consistent series naming.

### 3. One 30–45 second vertical Short
- **Format**: 1080x1920 MP4, ~35 seconds, saved to `/mnt/documents/1325ai-short.mp4`.
- **Source**: Cut from the existing Director's Cut (we already have the Remotion project at `remotion/`).
- **Structure**: 0-3s hook ("AI replaced 4 of my employees") → 3-25s the proof (Kayla doing work, the $12,100/mo number) → 25-35s soft CTA ("Search 1325.AI").
- **Built fresh** as a new Remotion composition (`remotion/src/ShortVideo.tsx`) so it stays clean — not a forced crop of the horizontal cut.
- Upload to YouTube Shorts, Instagram Reels, and TikTok with the same caption.

## Order of work
1. Thumbnails first (fastest, ~3 min) so you can update YouTube today.
2. SEO doc next (~5 min) — you copy-paste into YouTube Studio.
3. Vertical Short last (~10-15 min render time) — biggest growth lever but slowest.

## What I need from you
- **Nothing right now** — I'll fetch your video list automatically. If the API call returns fewer than your 9 videos, I'll ping you to paste the missing titles + URLs.
- **After delivery**: you'll need to (a) upload thumbnails in YouTube Studio, (b) paste new titles/descriptions/tags per video, (c) upload the Short to YouTube/Reels/TikTok.

## Notes
- No changes to your live website code.
- Phone number stays removed (per your earlier instruction) — it won't appear in any thumbnail, description, or Short.
- I'll use **1325.AI** as the primary brand, mentioning Mansa Musa Marketplace only where natural.

Click **Implement plan** below and I'll start with the thumbnails.