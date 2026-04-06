import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Playfair";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600"], subsets: ["latin"] });

const GOLD = "#D4AF37";

const StatBlock = ({ value, label, delay, accent }: { value: string; label: string; delay: number; accent?: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
  const scale = interpolate(s, [0, 1], [0.5, 1]);
  const opacity = interpolate(s, [0, 0.4, 1], [0, 0.6, 1]);
  const floatY = Math.sin((frame - delay) * 0.04) * 3;

  return (
    <div style={{
      textAlign: "center",
      opacity,
      transform: `scale(${scale}) translateY(${floatY}px)`,
      padding: "40px 50px",
      borderRadius: 24,
      background: accent ? `linear-gradient(135deg, ${GOLD}15, ${GOLD}08)` : "rgba(255,255,255,0.03)",
      border: `1px solid ${accent ? GOLD + "44" : "rgba(255,255,255,0.08)"}`,
    }}>
      <div style={{
        fontFamily: playfair,
        fontSize: accent ? 90 : 78,
        fontWeight: 900,
        color: accent ? GOLD : "#FFFFFF",
        lineHeight: 1,
        textShadow: accent ? `0 0 40px rgba(212,175,55,0.3)` : "none",
      }}>{value}</div>
      <div style={{
        fontFamily: inter,
        fontSize: 22,
        fontWeight: 400,
        color: "rgba(255,255,255,0.6)",
        marginTop: 12,
        letterSpacing: "2px",
        textTransform: "uppercase",
      }}>{label}</div>
    </div>
  );
};

export const Scene4Stats = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
        <StatBlock value="5-30%" label="Savings Every Purchase" delay={0} accent />
        <StatBlock value="100%" label="FREE to Join" delay={20} />
        <StatBlock value="10K+" label="Community Members" delay={40} />
        <StatBlock value="5" label="Cities & Growing" delay={60} />
      </div>
    </AbsoluteFill>
  );
};
