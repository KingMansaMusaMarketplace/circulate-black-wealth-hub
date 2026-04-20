import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CinematicBg } from "./components/CinematicBg";
import { CinematicImage } from "./components/CinematicImage";
import { KineticTitle } from "./components/KineticTitle";
import { LowerThird } from "./components/LowerThird";
import { GoldDivider } from "./components/GoldDivider";
import { ClosingCTA } from "./components/ClosingCTA";

// 30s @ 30fps = 900 frames; VO is ~23.7s = 711 frames. We use 780 frames (26s) total.
// Scenes are aligned to VO rhythm; audio plays globally.

export const MainVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={900} />

      {/* Voiceover plays for the entire video */}
      <Audio src={staticFile("audio/vo-30.mp3")} volume={1} />

      {/* SCENE 1 — "Every dollar you spend... is a vote." (0–4.0s, 0–120) */}
      <Sequence from={0} durationInFrames={130}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <KineticTitle text="Every dollar" size={150} delay={6} />
          <div style={{ height: 30 }} />
          <KineticTitle text="is a vote." size={170} italic color="#FFB300" delay={48} />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 2 — "...the kind of community you want to live in." (4.0–8.5s, 120–255) */}
      <Sequence from={120} durationInFrames={140}>
        <CinematicImage
          src="images/community.jpg"
          durationInFrames={140}
          zoomFrom={1.08}
          zoomTo={1.22}
          panX={-30}
          tint="rgba(0,15,40,0.55)"
        />
        <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "flex-end", padding: "0 0 140px 120px" }}>
          <LowerThird
            line1="The community"
            line2="you want to live in."
            delay={20}
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 3 — "1325.AI helps you find Black-owned businesses near you." (8.5–13s, 255–390) */}
      <Sequence from={255} durationInFrames={140}>
        <CinematicImage
          src="images/owner-1.jpg"
          durationInFrames={140}
          zoomFrom={1.05}
          zoomTo={1.15}
          panX={20}
          panY={-15}
          tint="rgba(0,8,20,0.45)"
        />
        <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center", padding: "0 120px 0 0" }}>
          <div style={{ maxWidth: 720, textAlign: "right" }}>
            <KineticTitle
              text="Find Black-owned"
              size={88}
              delay={10}
              align="right"
            />
            <div style={{ height: 16 }} />
            <KineticTitle
              text="businesses near you."
              size={88}
              italic
              color="#FFB300"
              delay={42}
              align="right"
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 4 — "And rewards you for showing up." (13–16s, 390–480) */}
      <Sequence from={390} durationInFrames={100}>
        <CinematicImage
          src="images/qr-scan.jpg"
          durationInFrames={100}
          zoomFrom={1.10}
          zoomTo={1.25}
          panX={-15}
          tint="rgba(0,8,20,0.4)"
        />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", padding: "0 0 120px 0" }}>
          <KineticTitle
            text="Scan. Save. Repeat."
            size={120}
            delay={12}
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 5 — Stats: "Save 5 to 30%, Earn points, Unlock rewards." (16–21s, 480–630) */}
      <Sequence from={480} durationInFrames={155}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <StatsTriad />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 6 — "This isn't just shopping. This is circulation." (21–24s, 630–720) */}
      <Sequence from={630} durationInFrames={95}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <KineticTitle
            text="Not shopping."
            size={130}
            color="rgba(255,255,255,0.55)"
            delay={6}
          />
          <div style={{ height: 24 }} />
          <GoldDivider delay={28} width={520} />
          <div style={{ height: 24 }} />
          <KineticTitle
            text="Circulation."
            size={180}
            italic
            color="#FFB300"
            delay={36}
          />
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 7 — CTA: Logo + "Join the movement at 1325.ai." (24–30s, 720–900) */}
      <Sequence from={720} durationInFrames={180}>
        <ClosingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};

// Inline stats component
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: inter } = loadFont("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });
const { fontFamily: playfairStat } = loadPlayfair("normal", { weights: ["700", "900"], subsets: ["latin"] });

const StatsTriad = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { big: "30%", label: "Off Every Scan", delay: 0 },
    { big: "Points", label: "Every Purchase", delay: 25 },
    { big: "Rewards", label: "Real Value", delay: 50 },
  ];

  return (
    <div style={{ display: "flex", gap: 100, alignItems: "center" }}>
      {stats.map((s, i) => {
        const sp = spring({ frame: frame - s.delay, fps, config: { damping: 16, stiffness: 95 } });
        const y = interpolate(sp, [0, 1], [40, 0]);
        const op = interpolate(frame - s.delay, [0, 14], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        return (
          <div
            key={i}
            style={{
              transform: `translateY(${y}px)`,
              opacity: op,
              textAlign: "center",
              minWidth: 320,
            }}
          >
            <div
              style={{
                fontFamily: playfairStat,
                fontWeight: 900,
                fontSize: 140,
                color: "#FFB300",
                lineHeight: 1,
                letterSpacing: -3,
              }}
            >
              {s.big}
            </div>
            <div
              style={{
                fontFamily: inter,
                fontWeight: 300,
                fontSize: 26,
                color: "rgba(255,255,255,0.85)",
                marginTop: 18,
                letterSpacing: 6,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
