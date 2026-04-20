import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

export const ClosingCTAVertical = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo hero reveal (faster for reel)
  const logoSpring = spring({ frame, fps, config: { damping: 13, stiffness: 100 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.65, 1]);
  const logoOp = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });

  // Glow pulse
  const glow = interpolate(frame % 50, [0, 25, 50], [0.35, 0.6, 0.35]);

  // Divider
  const lineW = interpolate(frame, [40, 65], [0, 500], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // CTA text
  const ctaOp = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ctaY = interpolate(frame, [50, 75], [20, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Tagline
  const tagOp = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

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
          opacity: logoOp,
          marginBottom: 30,
        }}
      >
        Join The Movement
      </div>

      {/* Logo */}
      <div
        style={{
          width: 820,
          height: 820,
          opacity: logoOp,
          transform: `scale(${logoScale})`,
          WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 52%, rgba(0,0,0,0.6) 72%, rgba(0,0,0,0) 90%)",
          maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 52%, rgba(0,0,0,0.6) 72%, rgba(0,0,0,0) 90%)",
          filter: `drop-shadow(0 0 100px rgba(255,179,0,${glow}))`,
        }}
      >
        <Img src={staticFile("images/logo-1325ai.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      <div
        style={{
          height: 2,
          width: lineW,
          background: "linear-gradient(90deg, transparent, #FFB300, transparent)",
          marginTop: -40,
          marginBottom: 40,
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
          marginTop: 40,
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
