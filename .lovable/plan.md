

The user uploaded the official 1325.AI logo (gold wireframe brain over "1325.AI" text on deep blue) and wants it added to the end of both videos.

**Current ending (both videos):**
- 30s cinematic: `ClosingCTA` component — text-only "1325.AI" in Playfair font with gold accent, plus tagline
- 15s reel: `ClosingCTAVertical` component — same text-based treatment

**My honest take:** Yes, this is a great addition. Right now the closing is pure typography — clean but generic. The actual logo gives the ending **brand authority and memorability**. The wireframe brain is on-message (AI + intelligence + connection), the gold-on-blue matches the existing Mansa palette perfectly, and a real logo at the end is what viewers expect from a polished brand film.

**Recommended approach:** Don't replace the existing CTA — **layer the logo in as a hero reveal** before the text CTA, then transition to the text. This gives a 2-beat closing: logo hits → text + URL appears.

## Plan

### 1. Save logo asset
- Copy `user-uploads://1325-ai-logo-2.png` → `remotion/public/images/logo-1325ai.png`

### 2. Update `ClosingCTA.tsx` (30s, 16:9)
- Logo enters with spring scale (0.7 → 1) + fade-in over ~20 frames
- Subtle glow pulse on the brain area
- After ~50 frames, logo scales down slightly and shifts up; text CTA ("Visit 1325.ai · Plans from $19/mo · Founders' Lock: $149/mo for life") fades in below
- Logo stays visible through the whole closing

### 3. Update `ClosingCTAVertical.tsx` (15s, 9:16)
- Same idea, vertical layout: logo top-center, CTA text below
- Slightly faster pacing (reel needs to hit harder, faster)

### 4. Re-render both videos
- New filenames (versioned per memory rule):
  - `1325AI-cinematic-30s-v2.mp4`
  - `1325AI-reel-15s-v2.mp4`
- Use existing render script (`remotion/scripts/render-remotion.mjs`)

### 5. QA
- Spot-check final frames with `bunx remotion still` to confirm logo renders crisply at both aspect ratios
- Verify no text overlap with logo, gold glow doesn't blow out, audio still syncs

### Technical notes
- Logo is 1024x1024 PNG with solid blue background. Two options:
  - **A)** Use as-is — its blue blends into the existing `#000814` cinematic bg (close enough, will look intentional)
  - **B)** Add a soft radial mask/vignette around it so it floats on the cinematic bg without a hard square edge
- Going with **B** for premium feel — wrap the `<Img>` in a div with `maskImage: radial-gradient` to fade the logo's blue background into the scene

### What you get
- Two new MP4 files in your downloads (v2 versions, originals preserved)
- Same VO, same pacing, same scenes — only the closing is upgraded
- Estimated render time: ~10 min total (both videos)

