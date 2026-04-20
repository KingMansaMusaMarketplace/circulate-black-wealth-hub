import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

export const ClosingCTAVertical = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const scale = interpolate(sp, [0, 1], [0.85, 1]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [10, 35], [0, 500], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ctaOp = interpolate(frame, [22, 42], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ctaY = interpolate(frame, [22, 42], [20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const tagOp = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 60 }}>
      <div
        style={{
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 26,
          color: "#FFB300",
          letterSpacing: 10,
          textTransform: "uppercase",
          opacity: op,
          marginBottom: 40,
        }}
      >
        Join The Movement
      </div>

      <div
        style={{
          fontFamily: playfair,
          fontWeight: 900,
          fontSize: 280,
          color: "#FFFFFF",
          letterSpacing: -6,
          opacity: op,
          transform: `scale(${scale})`,
          textShadow: "0 0 60px rgba(255,179,0,0.3)",
          lineHeight: 1,
        }}
      >
        1325<span style={{ color: "#FFB300" }}>.AI</span>
      </div>

      <div
        style={{
          height: 2,
          width: lineW,
          background: "linear-gradient(90deg, transparent, #FFB300, transparent)",
          marginTop: 24,
          marginBottom: 60,
        }}
      />

      <div
        style={{
          fontFamily: inter,
          fontWeight: 300,
          fontSize: 44,
          color: "#FFFFFF",
          letterSpacing: 2,
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
          textAlign: "center",
        }}
      >
        Visit <span style={{ color: "#FFB300", fontWeight: 700 }}>1325.ai</span>
      </div>

      <div
        style={{
          marginTop: 60,
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 22,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: 4,
          textAlign: "center",
          opacity: tagOp,
          maxWidth: 800,
          lineHeight: 1.6,
        }}
      >
        PLANS FROM $19/MO
        <br />
        30-DAY FREE TRIAL
      </div>
    </AbsoluteFill>
  );
};
