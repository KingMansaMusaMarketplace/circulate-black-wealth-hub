import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { ReelVideo } from "./ReelVideo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={780}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="reel"
      component={ReelVideo}
      durationInFrames={510}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);

