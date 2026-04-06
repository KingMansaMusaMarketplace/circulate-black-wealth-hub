import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Value } from "./scenes/Scene2Value";
import { Scene3HowItWorks } from "./scenes/Scene3HowItWorks";
import { Scene4Stats } from "./scenes/Scene4Stats";
import { Scene5Closing } from "./scenes/Scene5Closing";
import { PersistentBackground } from "./components/PersistentBackground";

// 900 frames total at 30fps = 30 seconds
// Scene durations (before transitions):
// Scene1: 180 (6s) - Hook
// Scene2: 180 (6s) - Value prop
// Scene3: 210 (7s) - How it works
// Scene4: 180 (6s) - Stats
// Scene5: 210 (7s) - Closing
// Transitions: 4 x 20 frames = 80 frames overlap
// Total: 180+180+210+180+210 - 80 = 880 + we pad Scene5 to 230 => 900

const TRANSITION_DURATION = 20;
const timingConfig = springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_DURATION });

export const MainVideo = () => {
  return (
    <AbsoluteFill>
      <PersistentBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene1Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timingConfig} />
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene2Value />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={timingConfig} />
        <TransitionSeries.Sequence durationInFrames={210}>
          <Scene3HowItWorks />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timingConfig} />
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene4Stats />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timingConfig} />
        <TransitionSeries.Sequence durationInFrames={230}>
          <Scene5Closing />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
