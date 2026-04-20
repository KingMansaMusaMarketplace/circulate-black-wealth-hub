import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

export const ClosingCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo hero reveal
  const logoSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.7, 1]);
  const logoOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Logo settles up after frame 50 to make room for text
  const logoShiftY = interpolate(frame, [45, 70], [0, -90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoSettleScale = interpolate(frame, [45, 70], [1, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glow pulse
  const glow = interpolate(frame % 60, [0, 30, 60], [0.35, 0.6, 0.35]);

  // Divider line
  const lineW = interpolate(frame, [55, 80], [0, 700], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Text CTA fade in after logo settles
  const ctaOp = interpolate(frame, [65, 90], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ctaY = interpolate(frame, [65, 90], [16, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      {/* Logo - oversized for cinematic readability */}
      <div
        style={{
          width: 880,
          height: 880,
          opacity: logoOp,
          transform: `translateY(${logoShiftY}px) scale(${logoScale * logoSettleScale})`,
          WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 73%, rgba(0,0,0,0) 90%)",
          maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 73%, rgba(0,0,0,0) 90%)",
          filter: `drop-shadow(0 0 110px rgba(255,179,0,${glow}))`,
          marginBottom: -80,
        }}
      >
        <Img src={staticFile("images/logo-1325ai.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      <div
        style={{
          height: 2,
          width: lineW,
          background: "linear-gradient(90deg, transparent, #FFB300, transparent)",
          marginTop: -10,
          marginBottom: 32,
        }}
      />

      <div
        style={{
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 44,
          color: "#FFFFFF",
          letterSpacing: 4,
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
          textAlign: "center",
        }}
      >
        Visit <span style={{ color: "#FFB300", fontWeight: 700, letterSpacing: 2 }}>1325.ai</span>
      </div>

      <div
        style={{
          marginTop: 28,
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 30,
          color: "#FFFFFF",
          letterSpacing: 8,
          textTransform: "uppercase",
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
          textAlign: "center",
        }}
      >
        Plans from $19/mo · <span style={{ color: "#FFB300" }}>30-Day Free Trial</span>
      </div>
    </AbsoluteFill>
  );
};
