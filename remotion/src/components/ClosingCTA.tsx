import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

export const ClosingCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const scale = interpolate(sp, [0, 1], [0.92, 1]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [10, 35], [0, 600], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ctaOp = interpolate(frame, [22, 40], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ctaY = interpolate(frame, [22, 40], [16, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div
        style={{
          fontFamily: playfair,
          fontWeight: 900,
          fontSize: 220,
          color: "#FFFFFF",
          letterSpacing: -6,
          opacity: op,
          transform: `scale(${scale})`,
          textShadow: "0 0 60px rgba(255,179,0,0.25)",
        }}
      >
        1325<span style={{ color: "#FFB300" }}>.AI</span>
      </div>

      <div
        style={{
          height: 2,
          width: lineW,
          background: "linear-gradient(90deg, transparent, #FFB300, transparent)",
          marginTop: 16,
          marginBottom: 36,
        }}
      />

      <div
        style={{
          fontFamily: inter,
          fontWeight: 300,
          fontSize: 32,
          color: "rgba(255,255,255,0.92)",
          letterSpacing: 4,
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
          textAlign: "center",
        }}
      >
        Join the movement at <span style={{ color: "#FFB300", fontWeight: 700, letterSpacing: 2 }}>1325.ai</span>
      </div>

      <div
        style={{
          marginTop: 28,
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 18,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        Plans from $19/mo · 30-Day Free Trial
      </div>
    </AbsoluteFill>
  );
};
