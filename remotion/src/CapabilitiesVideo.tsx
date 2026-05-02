import { AbsoluteFill, Audio, Sequence, Series, staticFile } from "remotion";
import { SceneHook } from "./scenes/SceneHook";
import { SceneLogoIntro } from "./scenes/SceneLogoIntro";
import { SceneMeetKayla } from "./scenes/SceneMeetKayla";
import { SceneCapabilities } from "./scenes/SceneCapabilities";
import { SceneScore } from "./scenes/SceneScore";
import { SceneCompetitive } from "./scenes/SceneCompetitive";
import { SceneROI } from "./scenes/SceneROI";
import { SceneClosing } from "./scenes/SceneClosing";

// Capabilities & Competitive Report — 5-minute YouTube cinematic.
// Total: 8730 frames @ 30fps = 291s (4:51).
// VO: vo-capabilities.mp3 (290.5s, 37 segments stitched).
//
// Scene timing (back-to-back, matched to VO):
//   0    -  540   Hook              (18s)
//   540  - 1500   MeetKayla         (32s)
//   1500 - 4290   Capabilities      (93s — 5 depts × 558f)
//   4290 - 5280   Score             (33s — 990f)
//   5280 - 6930   Competitive       (55s — 1650f)
//   6930 - 7815   ROI               (29.5s — 885f)
//   7815 - 8715   Closing           (30s — 900f)
//   8715 - 8730   Tail black        (0.5s)
//
// Each scene handles its own fade-in/out so cuts feel cinematic without
// the timeline math complexity of TransitionSeries overlaps.
export const CapabilitiesVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Audio src={staticFile("audio/vo-capabilities.mp3")} />

      <Series>
        <Series.Sequence durationInFrames={540}>
          <SceneHook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={960}>
          <SceneMeetKayla />
        </Series.Sequence>
        <Series.Sequence durationInFrames={2790}>
          <SceneCapabilities />
        </Series.Sequence>
        <Series.Sequence durationInFrames={990}>
          <SceneScore />
        </Series.Sequence>
        <Series.Sequence durationInFrames={1650}>
          <SceneCompetitive />
        </Series.Sequence>
        <Series.Sequence durationInFrames={885}>
          <SceneROI />
        </Series.Sequence>
        <Series.Sequence durationInFrames={900}>
          <SceneClosing />
        </Series.Sequence>
        <Series.Sequence durationInFrames={15}>
          <AbsoluteFill style={{ backgroundColor: "#000000" }} />
        </Series.Sequence>
      </Series>

      {/* Logo intro overlay — first 75 frames (2.5s) on top of Hook */}
      <Sequence from={0} durationInFrames={75}>
        <SceneLogoIntro />
      </Sequence>
    </AbsoluteFill>
  );
};

