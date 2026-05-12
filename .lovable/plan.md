## 1325.AI — "Wealth Comes Home" Director's Cut

A cinematic 2:30 motion-graphics film positioning 1325.AI as the operating system bringing economic power back to the Black community. Built in your existing Remotion stack, rendered fully in the sandbox, delivered as a downloadable MP4 ready for YouTube.

**Why 2:30, not 8:00**: Sandbox rendering caps at ~10 min per chunk; 8 min = 14,400 frames requiring ~30 chunks and several hours with high failure risk. A tight 2:30 (4,500 frames) renders cleanly here in one pass and lands harder on YouTube than a bloated 8-minute cut. If you want the full 8-min version after, I can scaffold it for you to render locally on your Mac.

---

### Creative direction

- **Aesthetic**: Cinematic Minimal — true black background, MansaGold (#FFB300) accents, MansaBlue (#003366) secondary glow. Editorial pacing. Massive Playfair Display headlines + Inter body. Same visual DNA as your existing FullVideo / AgenticVideo so it feels like a series.
- **Motion system**: Spring-driven entrances (damping 18, stiffness 95), gold dividers as scene punctuation, kinetic per-word typography, subtle parallax on background gradient + drifting gold orbs.
- **Audio**: Hybrid — VO over story beats (generated via ElevenLabs TTS, voice "Brian" or "George" for gravitas), music-only montage sections for the data/statistic moments and closing manifesto.

### 9-scene storyboard (~150 sec / 4,500 frames @ 30fps)

```
00:00–00:08  Logo bumper                          (240f, music sting)
00:08–00:22  Scene 1 — HOOK                       (420f, VO)
             "$1.6 trillion. That's how much the Black community
              spends every year. Less than 2% stays in the community."
00:22–00:35  Scene 2 — THE PROBLEM (data viz)     (390f, music)
             Animated bar: $1.6T → 6 hours → $0. Wealth leaving.
00:35–00:50  Scene 3 — THE THESIS                 (450f, VO)
             "1325.AI is the operating system for community wealth."
00:50–01:08  Scene 4 — MEET KAYLA + 33 AGENTS     (540f, VO)
             Kayla portrait → grid of 33 agent tiles light up.
01:08–01:25  Scene 5 — THE FLYWHEEL               (510f, music)
             Rotating CONNECT → MONETIZE → AMPLIFY → LOOP wheel.
01:25–01:42  Scene 6 — THE MATH                   (510f, VO)
             "$2M C-suite. $299/month. ~4 roles covered.
              $12,100+ saved every month."
01:42–01:58  Scene 7 — IMPACT (montage)           (480f, music)
             Wealth circulation animation: dollars looping
             between businesses, customers, HBCUs.
01:58–02:18  Scene 8 — MANIFESTO                  (600f, VO)
             "This isn't a directory. It's an Agentic Commerce
              Protocol. Capital that stays home. Wealth that
              compounds. Power that circulates."
02:18–02:30  Scene 9 — CLOSING CTA                (360f, music sting)
             "Visit 1325.AI. The future is already here."
```

### Technical plan

1. **VO generation** — Write 6-segment script, generate via ElevenLabs TTS (server-side via existing edge function pattern or `lovable_ai.py`-style script). Save 6 MP3s under `remotion/public/audio/dc/`.
2. **Music bed** — Generate cinematic ambient track via ElevenLabs Music API (~150s, "cinematic, hopeful, deep cinematic strings, soft hip-hop drums, uplifting"). Save as `remotion/public/audio/dc/bed.mp3`.
3. **New components** — Reuse existing `CinematicBg`, `KineticTitle`, `GoldDivider`, `LogoBumper`. New scenes:
   - `scenes/dc/SceneHookDC.tsx` (massive $1.6T number reveal)
   - `scenes/dc/SceneProblemDC.tsx` (animated bar chart of wealth leaving)
   - `scenes/dc/SceneThesisDC.tsx` (logo + tagline reveal)
   - `scenes/dc/SceneAgentsDC.tsx` (Kayla + 33-tile grid)
   - `scenes/dc/SceneFlywheelDC.tsx` (reuse FullVideo's wheel, refactored)
   - `scenes/dc/SceneMathDC.tsx` (counter animation: $2M, $299, $12,100)
   - `scenes/dc/SceneImpactDC.tsx` (looping dollar arrows between nodes)
   - `scenes/dc/SceneManifestoDC.tsx` (kinetic 4-line manifesto)
   - `scenes/dc/SceneClosingDC.tsx` (logo + "1325.AI" + URL)
4. **New composition** — `DirectorsCutVideo.tsx` registered in `Root.tsx` as id `directors-cut`, 4500 frames @ 30fps, 1920×1080. Mixes VO (per-scene `<Audio>` with offsets) and continuous music bed (volume ducked under VO scenes via volume function).
5. **Render** — Use existing `render-full.mjs` pattern, chunked into 3 × 1500-frame chunks, concat with ffmpeg. Output: `/mnt/documents/1325AI-directors-cut.mp4`.
6. **QA** — Render 3 spot-check stills (frames 800, 2200, 4000) before full render to verify scenes look right.

### Deliverable

- `1325AI-directors-cut.mp4` in `/mnt/documents/` ready to upload to YouTube
- All Remotion source committed to your project for re-rendering / editing
- Optional: I can also generate a YouTube title, description, and chapters timestamps based on the storyboard

### What I'll need from you after approval

Nothing — I'll generate the VO and music in-sandbox using your ElevenLabs key (already in secrets). If you'd rather record the VO yourself, say so and I'll deliver the script first and stub silent VO files for placement.
