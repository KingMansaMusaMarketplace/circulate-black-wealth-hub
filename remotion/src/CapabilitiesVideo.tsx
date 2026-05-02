import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { LogoBumper } from "./components/LogoBumper";
import { SceneHook } from "./scenes/SceneHook";
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
// Scene timing (matched to VO):
//   0    -  540   Hook              (18s)
//   540  - 1500   MeetKayla         (32s)
//   1500 - 4290   Capabilities      (93s — 5 depts × 558f)
//   4290 - 5280   Score             (33s — 990f)
//   5280 - 6930   Competitive       (55s — 1650f)
//   6930 - 7815   ROI               (29.5s — 885f)
//   7815 - 8715   Closing           (30s — 900f)
//   8715 - 8730   Tail black        (0.5s)
//
// Optional 30-frame logo bumper at start; here we drop straight into the hook
// to maximize VO impact and keep total under 5 min.
export const CapabilitiesVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Voice-over track for entire video */}
      <Audio src={staticFile("audio/vo-capabilities.mp3")} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={540}>
          <SceneHook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        <TransitionSeries.Sequence durationInFrames={960}>
          <SceneMeetKayla />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 24 })}
        />

        <TransitionSeries.Sequence durationInFrames={2790}>
          <SceneCapabilities />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 22 })}
        />

        <TransitionSeries.Sequence durationInFrames={990}>
          <SceneScore />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 24 })}
        />

        <TransitionSeries.Sequence durationInFrames={1650}>
          <SceneCompetitive />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 22 })}
        />

        <TransitionSeries.Sequence durationInFrames={885}>
          <SceneROI />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 24 })}
        />

        <TransitionSeries.Sequence durationInFrames={900}>
          <SceneClosing />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        <TransitionSeries.Sequence durationInFrames={20}>
          <AbsoluteFill style={{ backgroundColor: "#000000" }} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
