import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CinematicBg } from "./components/CinematicBg";
import { CinematicImage } from "./components/CinematicImage";
import { KineticTitle } from "./components/KineticTitle";
import { ClosingCTAVertical } from "./components/ClosingCTAVertical";
import { LogoBumper } from "./components/LogoBumper";

// 17s @ 30fps = 510 frames + 36-frame logo intro = 546 total.

const INTRO = 36;

export const ReelVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <Sequence from={0} durationInFrames={INTRO}>
        <LogoBumper size={920} vertical />
      </Sequence>

      <Sequence from={INTRO}>
        <AbsoluteFill style={{ backgroundColor: "#000814" }}>
          <CinematicBg totalFrames={510} />
          <Audio src={staticFile("audio/vo-15.mp3")} volume={1} />

          {/* SCENE 1 — "Every dollar... is a vote." (0–3s, 0–90) */}
          <Sequence from={0} durationInFrames={100}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, flexDirection: "column" }}>
          <KineticTitle text="Every dollar" size={130} delay={5} />
          <div style={{ height: 24 }} />
          <KineticTitle text="is a vote." size={150} italic color="#FFB300" delay={36} />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 2 — Customer + brand (3–7s, 90–210) */}
      <Sequence from={90} durationInFrames={130}>
        <CinematicImage
          src="images/customer.jpg"
          durationInFrames={130}
          zoomFrom={1.1}
          zoomTo={1.25}
          panY={-20}
          tint="rgba(0,8,20,0.45)"
        />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", padding: "0 60px 180px 60px" }}>
          <div style={{ textAlign: "center" }}>
            <KineticTitle text="Support" size={90} delay={15} />
            <div style={{ height: 12 }} />
            <KineticTitle text="Black-owned." size={110} italic color="#FFB300" delay={42} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 3 — QR scan + savings (7–11s, 210–330) */}
      <Sequence from={210} durationInFrames={130}>
        <CinematicImage
          src="images/qr-scan.jpg"
          durationInFrames={130}
          zoomFrom={1.1}
          zoomTo={1.25}
          tint="rgba(0,8,20,0.4)"
        />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <BigStat />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 4 — CTA (11–17s, 330–510) */}
      <Sequence from={330} durationInFrames={180}>
        <ClosingCTAVertical />
      </Sequence>
    </AbsoluteFill>
  );
};

import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500"], subsets: ["latin"] });

const BigStat = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 14, stiffness: 95 } });
  const scale = interpolate(sp, [0, 1], [0.7, 1]);
  const op = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div
        style={{
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 28,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: 8,
          textTransform: "uppercase",
          opacity: op,
          marginBottom: 24,
        }}
      >
        Save up to
      </div>
      <div
        style={{
          fontFamily: playfair,
          fontWeight: 900,
          fontSize: 380,
          color: "#FFB300",
          lineHeight: 1,
          letterSpacing: -10,
          opacity: op,
          transform: `scale(${scale})`,
          textShadow: "0 0 80px rgba(255,179,0,0.3)",
        }}
      >
        30%
      </div>
      <div
        style={{
          fontFamily: inter,
          fontWeight: 300,
          fontSize: 32,
          color: "rgba(255,255,255,0.9)",
          marginTop: 28,
          letterSpacing: 4,
          opacity: subOp,
        }}
      >
        every time you scan.
      </div>
    </div>
  );
};
