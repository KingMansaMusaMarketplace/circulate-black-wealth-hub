import { AbsoluteFill, Audio, Sequence, Series, staticFile } from "remotion";
import { SceneHook } from "./scenes/SceneHook";
import { SceneLogoIntro } from "./scenes/SceneLogoIntro";
import { SceneMeetKayla } from "./scenes/SceneMeetKayla";
import { SceneCapabilities } from "./scenes/SceneCapabilities";
import { SceneScore } from "./scenes/SceneScore";
import { SceneCompetitive } from "./scenes/SceneCompetitive";
import { SceneROI } from "./scenes/SceneROI";
import { SceneClosing } from "./scenes/SceneClosing";
import voTiming from "./voTiming.json";

// Capabilities video — VO-driven timing.
// Scene durations are computed from the actual measured length of each
// Jessica VO segment (see scripts/generate-vo-capabilities.mjs), so the
// visuals never drift, get cut off, or feel rushed.
const sceneByName: Record<string, React.FC> = {
  hook: SceneHook,
  kayla: SceneMeetKayla,
  capabilities: SceneCapabilities,
  score: SceneScore,
  competitive: SceneCompetitive,
  roi: SceneROI,
  closing: SceneClosing,
};

export const CapabilitiesVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* VO begins after the logo intro overlay (voOffsetFrames into the timeline) */}
      <Sequence from={voTiming.voOffsetFrames}>
        <Audio src={staticFile(voTiming.voFile)} />
      </Sequence>

      <Series>
        {voTiming.scenes.map((s) => {
          const Comp = sceneByName[s.scene];
          return (
            <Series.Sequence key={s.scene} durationInFrames={s.durationInFrames}>
              <Comp />
            </Series.Sequence>
          );
        })}
      </Series>

      {/* Pulsing logo intro overlay — first 75 frames (2.5s) */}
      <Sequence from={0} durationInFrames={75}>
        <SceneLogoIntro />
      </Sequence>
    </AbsoluteFill>
  );
};
