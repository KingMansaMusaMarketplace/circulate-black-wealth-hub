import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";
import { CinematicBg } from "./components/CinematicBg";
import { KineticTitle } from "./components/KineticTitle";
import { LogoBumper } from "./components/LogoBumper";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: inter } = loadInter("normal", {
  weights: ["300", "500", "700", "900"],
  subsets: ["latin"],
});
const { fontFamily: playfair } = loadPlayfair("normal", {
  weights: ["700", "900"], subsets: ["latin"],
});

// 35s @ 30fps = 1050 frames. Logo intro 30 + 6 scenes.
const INTRO = 30;
export const SHORT_TOTAL = INTRO + 1020;

// ───────── Scene 1: HOOK (0–4s) ─────────
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const flashOp = interpolate(frame, [0, 6, 12], [0, 1, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 70, flexDirection: "column" }}>
      <AbsoluteFill style={{ background: "rgba(255,179,0,0.18)", opacity: flashOp }} />
      <KineticTitle text="AI replaced" size={140} delay={4} />
      <div style={{ height: 22 }} />
      <KineticTitle text="4 of my" size={140} delay={28} />
      <div style={{ height: 22 }} />
      <KineticTitle text="employees." size={170} italic color="#FFB300" delay={52} />
    </AbsoluteFill>
  );
};

// ───────── Scene 2: MEET KAYLA (4–10s) ─────────
const SceneKayla: React.FC = () => {
  const frame = useCurrentFrame();
  const orbOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const orbScale = interpolate(
    spring({ frame, fps: 30, config: { damping: 14, stiffness: 80 } }),
    [0, 1], [0.6, 1]
  );
  const pulse = 1;
  const glow = 0.6;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 60, flexDirection: "column" }}>
      <div
        style={{
          width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #003366 0%, #001a33 60%, #000814 100%)",
          border: "3px solid #FFB300",
          opacity: orbOp,
          transform: `scale(${orbScale * pulse})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 60,
        }}
      >
        <div
          style={{
            fontFamily: playfair, fontWeight: 900, fontSize: 110, color: "#FFB300",
            letterSpacing: 4,
          }}
        >
          KAYLA
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <KineticTitle text="Your 24/7" size={90} delay={40} />
      </div>
      <div style={{ height: 18 }} />
      <KineticTitle text="AI Employee" size={100} italic color="#FFB300" delay={60} />
    </AbsoluteFill>
  );
};

// ───────── Scene 3: THE NUMBER (10–17s) ─────────
const SceneNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const labelOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const numSp = spring({ frame: frame - 8, fps: 30, config: { damping: 12, stiffness: 90 } });
  const numScale = interpolate(numSp, [0, 1], [0.55, 1]);
  const numOp = interpolate(frame, [8, 24], [0, 1], { extrapolateRight: "clamp" });
  // count-up from 0 to 12100
  const count = Math.floor(interpolate(frame, [10, 70], [0, 12100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const subOp = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" });
  const rolesOp = interpolate(frame, [130, 160], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 60, flexDirection: "column" }}>
      <div
        style={{
          fontFamily: inter, fontWeight: 500, fontSize: 38, color: "#FFFFFF",
          letterSpacing: 10, textTransform: "uppercase", opacity: labelOp, marginBottom: 30,
        }}
      >
        Saved every month
      </div>
      <div
        style={{
          fontFamily: playfair, fontWeight: 900, fontSize: 280, color: "#FFB300",
          lineHeight: 1, letterSpacing: -8, opacity: numOp, transform: `scale(${numScale})`,
        }}
      >
        ${count.toLocaleString()}
      </div>
      <div
        style={{
          marginTop: 40, fontFamily: inter, fontWeight: 300, fontSize: 46, color: "#FFFFFF",
          letterSpacing: 3, opacity: subOp, textAlign: "center",
        }}
      >
        for small business owners
      </div>
      <div
        style={{
          marginTop: 30, fontFamily: inter, fontWeight: 700, fontSize: 36,
          color: "#FFB300", letterSpacing: 6, opacity: rolesOp, textAlign: "center",
        }}
      >
        ~4 ROLES COVERED
      </div>
    </AbsoluteFill>
  );
};

// ───────── Scene 4: THE BIG WHY (17–26s) ─────────
const SceneWhy: React.FC = () => {
  const frame = useCurrentFrame();
  const op1 = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const numSp = spring({ frame: frame - 30, fps: 30, config: { damping: 13, stiffness: 75 } });
  const numScale = interpolate(numSp, [0, 1], [0.6, 1]);
  const numOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const labelOp = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" });
  const reclaimOp = interpolate(frame, [150, 180], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 60, flexDirection: "column" }}>
      <div
        style={{
          fontFamily: inter, fontWeight: 500, fontSize: 36, color: "#FFFFFF",
          letterSpacing: 10, textTransform: "uppercase", opacity: op1, marginBottom: 24,
        }}
      >
        Reclaiming
      </div>
      <div
        style={{
          fontFamily: playfair, fontWeight: 900, fontSize: 320, color: "#FFB300",
          lineHeight: 1, letterSpacing: -10, opacity: numOp, transform: `scale(${numScale})`,
        }}
      >
        $1.6T
      </div>
      <div
        style={{
          marginTop: 30, fontFamily: inter, fontWeight: 700, fontSize: 50, color: "#FFFFFF",
          letterSpacing: 5, opacity: labelOp, textAlign: "center",
        }}
      >
        in Black spending power
      </div>
      <div
        style={{
          marginTop: 32, fontFamily: inter, fontWeight: 300, fontSize: 38, color: "#FFB300",
          letterSpacing: 6, opacity: reclaimOp, textAlign: "center", fontStyle: "italic",
        }}
      >
        — circulated, not extracted.
      </div>
    </AbsoluteFill>
  );
};

// ───────── Scene 5: CTA (26–34s) ─────────
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const logoSp = spring({ frame, fps, config: { damping: 13, stiffness: 100 } });
  const logoScale = interpolate(logoSp, [0, 1], [0.6, 1]);
  const logoOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const glow = 0.55;
  const lineW = interpolate(frame, [40, 70], [0, 540], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [55, 85], [0, 1], { extrapolateRight: "clamp" });
  const tagOp = interpolate(frame, [90, 120], [0, 1], { extrapolateRight: "clamp" });
  const freeOp = interpolate(frame, [140, 170], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 60 }}>
      <div
        style={{
          fontFamily: inter, fontWeight: 500, fontSize: 30, color: "#FFB300",
          letterSpacing: 10, textTransform: "uppercase", opacity: logoOp, marginBottom: 36,
        }}
      >
        Hire Kayla today
      </div>
      <div
        style={{
          width: 880, height: 880, opacity: logoOp,
          transform: `scale(${logoScale})`,
          WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 92%)",
          maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 92%)",
          filter: `drop-shadow(0 0 120px rgba(255,179,0,${glow}))`,
          marginTop: -30, marginBottom: -50,
        }}
      >
        <Img
          src={staticFile("images/logo-1325ai.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div
        style={{
          height: 2, width: lineW,
          background: "linear-gradient(90deg, transparent, #FFB300, transparent)",
          marginTop: -30, marginBottom: 36,
        }}
      />
      <div
        style={{
          fontFamily: inter, fontWeight: 300, fontSize: 56, color: "#FFFFFF",
          letterSpacing: 3, opacity: ctaOp, textAlign: "center",
        }}
      >
        Visit <span style={{ color: "#FFB300", fontWeight: 700 }}>1325.ai</span>
      </div>
      <div
        style={{
          marginTop: 36, fontFamily: inter, fontWeight: 700, fontSize: 42,
          color: "#FFFFFF", letterSpacing: 6, opacity: tagOp, textAlign: "center",
        }}
      >
        FREE FOR FOUNDING
      </div>
      <div
        style={{
          marginTop: 12, fontFamily: inter, fontWeight: 700, fontSize: 42,
          color: "#FFB300", letterSpacing: 6, opacity: freeOp, textAlign: "center",
        }}
      >
        MEMBERS
      </div>
    </AbsoluteFill>
  );
};

export const ShortVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <Sequence from={0} durationInFrames={INTRO}>
        <LogoBumper size={920} vertical />
      </Sequence>

      <Sequence from={INTRO}>
        <AbsoluteFill style={{ backgroundColor: "#000814" }}>
          <CinematicBg totalFrames={1020} />

          {/* Scene 1: Hook 0–4s (0–120) */}
          <Sequence from={0} durationInFrames={120}>
            <SceneHook />
          </Sequence>

          {/* Scene 2: Kayla 4–10s (120–300) */}
          <Sequence from={120} durationInFrames={180}>
            <SceneKayla />
          </Sequence>

          {/* Scene 3: Number 10–17s (300–510) */}
          <Sequence from={300} durationInFrames={210}>
            <SceneNumber />
          </Sequence>

          {/* Scene 4: Why 17–26s (510–780) */}
          <Sequence from={510} durationInFrames={270}>
            <SceneWhy />
          </Sequence>

          {/* Scene 5: CTA 26–34s (780–1020) */}
          <Sequence from={780} durationInFrames={240}>
            <SceneCTA />
          </Sequence>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
