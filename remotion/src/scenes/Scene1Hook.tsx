import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Playfair";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600"], subsets: ["latin"] });

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5E6A3";

export const Scene1Hook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line 1: "SAVE MONEY."
  const line1Scale = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const line1Y = interpolate(line1Scale, [0, 1], [60, 0]);
  const line1Opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Line 2: "BUILD COMMUNITY."
  const line2Scale = spring({ frame: frame - 20, fps, config: { damping: 15, stiffness: 120 } });
  const line2Y = interpolate(line2Scale, [0, 1], [60, 0]);
  const line2Opacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" });

  // Subtitle
  const subOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(frame, [50, 70], [20, 0], { extrapolateRight: "clamp" });

  // Gold line accent
  const lineWidth = interpolate(frame, [40, 80], [0, 400], { extrapolateRight: "clamp" });

  // Gentle float
  const floatY = Math.sin(frame * 0.03) * 3;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `translateY(${floatY}px)` }}>
        {/* Main headline */}
        <div style={{
          fontFamily: playfair,
          fontSize: 110,
          fontWeight: 900,
          color: GOLD,
          lineHeight: 1.1,
          opacity: line1Opacity,
          transform: `translateY(${line1Y}px)`,
          textShadow: `0 0 80px rgba(212,175,55,0.3)`,
          letterSpacing: "-2px",
        }}>
          SAVE MONEY.
        </div>

        <div style={{
          fontFamily: playfair,
          fontSize: 110,
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.1,
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          letterSpacing: "-2px",
          marginTop: 10,
        }}>
          BUILD COMMUNITY.
        </div>

        {/* Gold accent line */}
        <div style={{
          width: lineWidth,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          margin: "30px auto",
        }} />

        {/* Subtitle */}
        <div style={{
          fontFamily: inter,
          fontSize: 32,
          fontWeight: 400,
          color: "rgba(255,255,255,0.7)",
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          letterSpacing: "4px",
          textTransform: "uppercase",
        }}>
          Support Black-Owned Businesses
        </div>
      </div>
    </AbsoluteFill>
  );
};
