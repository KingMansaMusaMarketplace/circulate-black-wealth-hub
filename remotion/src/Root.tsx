import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { ReelVideo } from "./ReelVideo";
import { FullVideo } from "./FullVideo";
import { AgenticVideo } from "./AgenticVideo";
import { CapabilitiesVideo } from "./CapabilitiesVideo";
import { CapabilitiesVideoVertical } from "./CapabilitiesVideoVertical";
import { DirectorsCutVideo, DC_TOTAL } from "./DirectorsCutVideo";
import { ShortVideo, SHORT_TOTAL } from "./ShortVideo";
import { ManualVideo, MANUAL_TOTAL } from "./ManualVideo";
import { MansaStaysVideo, MANSA_STAYS_TOTAL } from "./MansaStaysVideo";
import { MansaStaysVideoVertical, MANSA_STAYS_V_TOTAL } from "./MansaStaysVideoVertical";
import { LeaseListingVideo, LEASE_TOTAL } from "./LeaseListingVideo";
import { LeaseListingVideoVertical, LEASE_V_TOTAL } from "./LeaseListingVideoVertical";
import { CustomerFlowVideo, CUSTOMER_FLOW_TOTAL } from "./CustomerFlowVideo";
import { VendorOnboardingVideo, VENDOR_ONBOARDING_TOTAL } from "./VendorOnboardingVideo";
import { ExplainerVideo, EXPLAINER_TOTAL } from "./ExplainerVideo";

export const RemotionRoot = () => (
  <>
    <Composition id="main" component={MainVideo} durationInFrames={936} fps={30} width={1920} height={1080} />
    <Composition id="reel" component={ReelVideo} durationInFrames={546} fps={30} width={1080} height={1920} />
    <Composition id="short" component={ShortVideo} durationInFrames={SHORT_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="full" component={FullVideo} durationInFrames={3060} fps={30} width={1920} height={1080} />
    <Composition id="agentic" component={AgenticVideo} durationInFrames={6273} fps={30} width={1920} height={1080} />
    <Composition id="capabilities" component={CapabilitiesVideo} durationInFrames={4192} fps={30} width={1920} height={1080} />
    <Composition id="capabilities-vertical" component={CapabilitiesVideoVertical} durationInFrames={4192} fps={30} width={1080} height={1920} />
    <Composition id="directors-cut" component={DirectorsCutVideo} durationInFrames={DC_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="manual" component={ManualVideo} durationInFrames={MANUAL_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="mansa-stays" component={MansaStaysVideo} durationInFrames={MANSA_STAYS_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="mansa-stays-vertical" component={MansaStaysVideoVertical} durationInFrames={MANSA_STAYS_V_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="lease" component={LeaseListingVideo} durationInFrames={LEASE_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="lease-vertical" component={LeaseListingVideoVertical} durationInFrames={LEASE_V_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="customer-flow" component={CustomerFlowVideo} durationInFrames={CUSTOMER_FLOW_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="vendor-onboarding" component={VendorOnboardingVideo} durationInFrames={VENDOR_ONBOARDING_TOTAL} fps={30} width={1920} height={1080} />
  </>
);
