import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { ReelVideo } from "./ReelVideo";
import { FullVideo } from "./FullVideo";
import { AgenticVideo } from "./AgenticVideo";
import { CapabilitiesVideo } from "./CapabilitiesVideo";

export const RemotionRoot = () => (
  <>
    <Composition id="main" component={MainVideo} durationInFrames={936} fps={30} width={1920} height={1080} />
    <Composition id="reel" component={ReelVideo} durationInFrames={546} fps={30} width={1080} height={1920} />
    <Composition id="full" component={FullVideo} durationInFrames={3060} fps={30} width={1920} height={1080} />
    <Composition id="agentic" component={AgenticVideo} durationInFrames={6273} fps={30} width={1920} height={1080} />
    <Composition id="capabilities" component={CapabilitiesVideo} durationInFrames={8730} fps={30} width={1920} height={1080} />
  </>
);
