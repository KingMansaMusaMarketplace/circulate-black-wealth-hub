import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

export const AgenticClosingCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSp = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const logoScale = interpolate(logoSp, [0, 1], [0.6, 1]);
  const logoOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const logoShiftY = interpolate(frame, [55, 85], [0, -110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoSettleScale = interpolate(frame, [55, 85], [1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glow = interpolate(frame % 60, [0, 30, 60], [0.3, 0.65, 0.3]);
  const lineW = interpolate(frame, [70, 100], [0, 800], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const priceOp = interpolate(frame, [85, 115], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const priceY = interpolate(frame, [85, 115], [30, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const priceScale = spring({ frame: frame - 85, fps, config: { damping: 12, stiffness: 90 } });

  const ctaOp = interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at center, #001028 0%, #000814 80%)", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div
        style={{
          width: 760,
          height: 760,
          opacity: logoOp,
          transform: `translateY(${logoShiftY}px) scale(${logoScale * logoSettleScale})`,
          WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 73%, rgba(0,0,0,0) 90%)",
          maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 73%, rgba(0,0,0,0) 90%)",
          filter: `drop-shadow(0 0 100px rgba(255,179,0,${glow}))`,
          marginBottom: -60,
        }}
      >
        <Img src={staticFile("images/logo-1325ai.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      <div style={{ height: 2, width: lineW, background: "linear-gradient(90deg, transparent, #FFB300, transparent)", marginTop: -10, marginBottom: 32 }} />

      <div
        style={{
          fontFamily: playfair,
          fontWeight: 900,
          fontSize: 128,
          color: "#FFFFFF",
          opacity: priceOp,
          transform: `translateY(${priceY}px) scale(${interpolate(priceScale, [0, 1], [0.85, 1])})`,
          letterSpacing: -2,
        }}
      >
        <span style={{ color: "#FFB300" }}>$299</span>
        <span style={{ fontFamily: inter, fontWeight: 300, fontSize: 56, color: "#E8E8E8", marginLeft: 16 }}>/month</span>
      </div>

      <div
        style={{
          marginTop: 28,
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 38,
          color: "#FFFFFF",
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: ctaOp,
          textAlign: "center",
        }}
      >
        Hire All 33 AI Employees Today
      </div>

      <div
        style={{
          marginTop: 22,
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 44,
          color: "#FFB300",
          letterSpacing: 4,
          opacity: ctaOp,
        }}
      >
        Visit 1325.ai
      </div>
    </AbsoluteFill>
  );
};
