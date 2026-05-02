import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../components/CinematicBg";
import { GoldDivider } from "../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

// Scene 7: Closing CTA (~30s = 900 frames)
export const SceneClosing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 22, stiffness: 80 } });
  const op = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(sp, [0, 1], [50, 0]);
  const logoScale = interpolate(spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 100 } }), [0, 1], [0.6, 1]);
  const logoOp = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" });

  // staggered lines
  const opLine1 = interpolate(frame, [80, 105], [0, 1], { extrapolateRight: "clamp" });
  const opLine2 = interpolate(frame, [140, 165], [0, 1], { extrapolateRight: "clamp" });
  const opUrl = interpolate(frame, [220, 250], [0, 1], { extrapolateRight: "clamp" });
  const opStats = interpolate(frame, [310, 340], [0, 1], { extrapolateRight: "clamp" });

  // Subtle drift on URL
  const urlPulse = 1 + Math.sin(frame * 0.04) * 0.015;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={900} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 8%" }}>
        {/* Logo */}
        <div style={{ opacity: logoOp, transform: `scale(${logoScale})`, marginBottom: 40 }}>
          <Img
            src={staticFile("images/logo-1325ai.png")}
            style={{
              width: 200,
              height: 200,
              objectFit: "contain",
              filter: "drop-shadow(0 0 60px rgba(255,179,0,0.45))",
              WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
              maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
            }}
          />
        </div>

        {/* Eyebrow */}
        <div style={{ opacity: op, transform: `translateY(${y}px)`, fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 12, color: "#FFB300", textTransform: "uppercase", marginBottom: 20 }}>
          The Future of Business
        </div>

        {/* Line 1 */}
        <div style={{ opacity: opLine1, fontFamily: playfair, fontWeight: 900, fontSize: 130, color: "#FFFFFF", lineHeight: 1, letterSpacing: -3 }}>
          Fully staffed.
        </div>
        {/* Line 2 */}
        <div style={{ opacity: opLine2, fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 80, color: "#FFB300", lineHeight: 1, marginTop: 12 }}>
          Always on.
        </div>

        <div style={{ marginTop: 50 }}><GoldDivider width={300} delay={140} /></div>

        {/* URL */}
        <div
          style={{
            opacity: opUrl,
            transform: `scale(${urlPulse})`,
            marginTop: 50,
            padding: "26px 60px",
            border: "2px solid #FFB300",
            borderRadius: 16,
            background: "rgba(255,179,0,0.10)",
            boxShadow: "0 30px 80px rgba(255,179,0,0.20)",
            fontFamily: playfair,
            fontWeight: 900,
            fontSize: 76,
            color: "#FFFFFF",
            letterSpacing: -1,
          }}
        >
          1325<span style={{ color: "#FFB300" }}>.ai</span>
        </div>

        {/* Stats row */}
        <div
          style={{
            opacity: opStats,
            marginTop: 50,
            display: "flex",
            gap: 80,
            fontFamily: inter,
            color: "rgba(255,255,255,0.85)",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <span>33 Agents</span>
          <span style={{ color: "#FFB300" }}>·</span>
          <span>One Subscription</span>
          <span style={{ color: "#FFB300" }}>·</span>
          <span>99/100 Maturity</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
