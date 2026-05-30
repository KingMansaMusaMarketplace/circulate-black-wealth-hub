## Goal
Generate a **90-second branded walkthrough video** explaining the 1325.AI 3-step customer flow (Sign Up → Discover → Scan & Save), render it to MP4, and drop it into `public/videos/1325AI-CustomerFlow-3Steps.mp4` so the banner on `/how-it-works` plays it automatically.

## Tool I'll use
The project already has **Remotion** (a code-based motion graphics tool) set up in the `/remotion` folder. I'll build a new composition there. No new dependencies needed.

## Storyboard (90 sec, 1920×1080, 30 fps)

| Time | Scene | What you see |
|---|---|---|
| 0–8s | **Logo intro** | Black background, gold "1325.AI" logo fades in with a tagline: "Save money. Build community wealth." |
| 8–18s | **The Hook** | Big kinetic text: "Shop Black-owned. Get 5–30% off. Earn loyalty points." with animated coins/dollar icons |
| 18–38s | **Step 1 — Sign Up** | Gold "01" numeral, mock signup screen sliding in, badges: "Free", "No credit card", "30 seconds" |
| 38–58s | **Step 2 — Discover** | Gold "02", animated map pin + directory cards with category icons (food, beauty, retail…) |
| 58–78s | **Step 3 — Scan & Save** | Gold "03", phone scanning a QR code, "−15% applied!" popup, "+25 points earned" |
| 78–90s | **Closing CTA** | "Start saving today" → "1325.AI" logo lock-up → URL: `1325.ai/how-it-works` |

Brand: True Black background, MansaBlue (#003366), MansaGold (#FFB300). Two fonts max (display + body, loaded from Google Fonts).

## Files I'll create
1. `remotion/src/CustomerFlowVideo.tsx` — main composition (wires the 6 scenes together with smooth transitions)
2. `remotion/src/scenes/customer/Scene01_LogoIntro.tsx`
3. `remotion/src/scenes/customer/Scene02_Hook.tsx`
4. `remotion/src/scenes/customer/Scene03_SignUp.tsx`
5. `remotion/src/scenes/customer/Scene04_Discover.tsx`
6. `remotion/src/scenes/customer/Scene05_ScanSave.tsx`
7. `remotion/src/scenes/customer/Scene06_CTA.tsx`
8. `remotion/scripts/render-customer-flow.mjs` — render script that outputs the MP4
9. Register the composition in `remotion/src/Root.tsx`

## Render & deliver
After building, I'll run the render script. It outputs:
- `public/videos/1325AI-CustomerFlow-3Steps.mp4` (directly into your site so the banner picks it up immediately)
- A backup copy at `/mnt/documents/1325AI-CustomerFlow-3Steps.mp4` for you to download

## Important heads-up (please read)

**1. Render time / sandbox limit.** Rendering 90 seconds at 1080p typically takes 5–12 minutes. The sandbox caps single commands at 10 minutes. If the render times out, my fallback is to:
   - Render in two halves (0–45s and 45–90s) and stitch with ffmpeg (already installed), OR
   - Drop resolution to 720p (still looks crisp, renders ~2× faster)

I'll start at 1080p and fall back if needed — no action from you required.

**2. Silent video (no voiceover, no music).** The video will be motion-graphics only with on-screen text. Adding AI-generated voiceover (ElevenLabs) or background music would need an API key and is a separate task. The on-screen text alone communicates the full message — that's how Apple/Stripe ship most of their explainer reels.

**3. Style.** Modern, Apple-like, lots of negative space, gold accents on black. Matches your existing brand. Think "clean tech explainer" not "marketing infomercial."

## What you need to do
1. **Approve this plan** (click *Implement plan*). I'll build all the scenes, render the MP4, and the banner on `/how-it-works` will start playing it automatically — no upload needed from you.
2. **(Optional, after you see v1):** If you want voiceover or background music added in a follow-up, just say so and I'll plan that as round 2.

## Workflow tip
The Remotion source code lives in your project, so once v1 is rendered you can ask me for tweaks like "change Step 2 background to blue" or "make the QR scan scene 2 seconds longer" and I'll just re-render — no starting from scratch.
