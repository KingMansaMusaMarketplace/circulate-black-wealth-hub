import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../../components/CinematicBg";
import { GoldDivider } from "../../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

export const SceneClosingV: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 22, stiffness: 80 } });
  const op = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(sp, [0, 1], [50, 0]);
  const logoScale = interpolate(spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 100 } }), [0, 1], [0.6, 1]);
  const logoOp = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });

  const opLine1 = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });
  const opLine2 = interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" });
  const opUrl = interpolate(frame, [180, 210], [0, 1], { extrapolateRight: "clamp" });
  const opStats = interpolate(frame, [260, 290], [0, 1], { extrapolateRight: "clamp" });

  const urlPulse = 1 + Math.sin(frame * 0.04) * 0.015;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={durationInFrames} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 8%", flexDirection: "column" }}>
        <div style={{ opacity: logoOp, transform: `scale(${logoScale})`, marginBottom: 30 }}>
          <Img
            src={staticFile("images/logo-1325ai.png")}
            style={{
              width: 360,
              height: 360,
              objectFit: "contain",
              filter: "drop-shadow(0 0 80px rgba(255,179,0,0.5))",
              WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
              maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
            }}
          />
        </div>

        <div style={{ opacity: op, transform: `translateY(${y}px)`, fontFamily: inter, fontWeight: 500, fontSize: 24, letterSpacing: 14, color: "#FFB300", textTransform: "uppercase", marginBottom: 24 }}>
          The Future of Business
        </div>

        <div style={{ opacity: opLine1, fontFamily: playfair, fontWeight: 900, fontSize: 150, color: "#FFFFFF", lineHeight: 1, letterSpacing: -3 }}>
          Fully staffed.
        </div>
        <div style={{ opacity: opLine2, fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 90, color: "#FFB300", lineHeight: 1, marginTop: 14 }}>
          Always on.
        </div>

        <div style={{ marginTop: 40 }}><GoldDivider width={300} delay={140} /></div>

        <div style={{ opacity: opUrl, transform: `scale(${urlPulse})`, marginTop: 40, padding: "28px 60px", border: "2px solid #FFB300", borderRadius: 18, background: "rgba(255,179,0,0.12)", boxShadow: "0 30px 80px rgba(255,179,0,0.25)", fontFamily: playfair, fontWeight: 900, fontSize: 100, color: "#FFFFFF", letterSpacing: -2 }}>
          1325<span style={{ color: "#FFB300" }}>.ai</span>
        </div>

        <div style={{ opacity: opStats, marginTop: 40, display: "flex", flexDirection: "column", gap: 10, fontFamily: inter, color: "rgba(255,255,255,0.85)", fontSize: 24, letterSpacing: 4, textTransform: "uppercase", fontWeight: 500 }}>
          <span>33 Agents · One Subscription</span>
          <span style={{ color: "#FFB300" }}>94/100 Capabilities Score</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
