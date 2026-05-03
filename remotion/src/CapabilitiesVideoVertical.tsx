import { AbsoluteFill, Audio, Sequence, Series, staticFile } from "remotion";
import { SceneHookV } from "./scenes/v/SceneHookV";
import { SceneLogoIntro } from "./scenes/SceneLogoIntro";
import { SceneMeetKaylaV } from "./scenes/v/SceneMeetKaylaV";
import { SceneCapabilitiesV } from "./scenes/v/SceneCapabilitiesV";
import { SceneScoreV } from "./scenes/v/SceneScoreV";
import { SceneCompetitiveV } from "./scenes/v/SceneCompetitiveV";
import { SceneROIV } from "./scenes/v/SceneROIV";
import { SceneClosingV } from "./scenes/v/SceneClosingV";
import voTiming from "./voTiming.json";

const sceneByName: Record<string, React.FC> = {
  hook: SceneHookV,
  kayla: SceneMeetKaylaV,
  capabilities: SceneCapabilitiesV,
  score: SceneScoreV,
  competitive: SceneCompetitiveV,
  roi: SceneROIV,
  closing: SceneClosingV,
};

export const CapabilitiesVideoVertical: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
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

      <Sequence from={0} durationInFrames={75}>
        <SceneLogoIntro />
      </Sequence>
    </AbsoluteFill>
  );
};
