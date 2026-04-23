import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: string;
}

export const TitleCard = ({ eyebrow, title, subtitle, accent = "#FFB300" }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle settle motion only — content is visible from frame 0 so the poster frame isn't black
  const sp = spring({ frame: frame + 8, fps, config: { damping: 22, stiffness: 80 } });
  const titleY = interpolate(sp, [0, 1], [20, 0]);
  const titleOp = 1;
  const eyeOp = 1;
  const subOp = 1;
  const lineW = interpolate(frame, [0, 30], [500, 500], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Pulsing glow behind the logo (matches home page treatment)
  const glowPulse = interpolate(frame % 90, [0, 45, 90], [0.55, 0.95, 0.55]);
  const logoSp = spring({ frame: frame + 4, fps, config: { damping: 18, stiffness: 90 } });
  const logoScale = interpolate(logoSp, [0, 1], [0.92, 1]);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at center, #001028 0%, #000814 70%)", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
      {eyebrow && (
        <div style={{ position: "relative", width: 320, height: 320, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Glow aura */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `radial-gradient(circle at center, ${accent} 0%, rgba(255,179,0,0.45) 28%, rgba(255,179,0,0) 65%)`,
              opacity: glowPulse,
              filter: "blur(20px)",
            }}
          />
          <Img
            src={staticFile("images/logo-1325ai.png")}
            style={{
              position: "relative",
              width: 280,
              height: 280,
              objectFit: "contain",
              transform: `scale(${logoScale})`,
              filter: `drop-shadow(0 0 40px rgba(255,179,0,${glowPulse * 0.8}))`,
            }}
          />
        </div>
      )}
      {eyebrow && (
        <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 28, color: accent, letterSpacing: 14, textTransform: "uppercase", opacity: eyeOp, marginBottom: 32 }}>
          {eyebrow}
        </div>
      )}
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 156, color: "#FFFFFF", lineHeight: 1, opacity: titleOp, transform: `translateY(${titleY}px)`, maxWidth: 1600 }}>
        {title}
      </div>
      <div style={{ height: 3, width: lineW, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, marginTop: 36, marginBottom: 28 }} />
      {subtitle && (
        <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 36, color: "#E8E8E8", letterSpacing: 2, opacity: subOp, maxWidth: 1400 }}>
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
