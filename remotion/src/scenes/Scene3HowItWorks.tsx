import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Playfair";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const GOLD = "#D4AF37";
const BLUE = "#1E3A8A";

const Step = ({ num, title, desc, delay }: { num: string; title: string; desc: string; delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 140 } });
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const opacity = interpolate(s, [0, 0.5, 1], [0, 0.8, 1]);
  const y = interpolate(s, [0, 1], [50, 0]);

  return (
    <div style={{
      flex: 1,
      textAlign: "center",
      opacity,
      transform: `translateY(${y}px) scale(${scale})`,
    }}>
      {/* Number circle */}
      <div style={{
        width: 90,
        height: 90,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${GOLD}, #C5981A)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px",
        boxShadow: `0 0 40px rgba(212,175,55,0.3)`,
      }}>
        <span style={{
          fontFamily: inter,
          fontSize: 42,
          fontWeight: 700,
          color: "#000",
        }}>{num}</span>
      </div>

      <div style={{
        fontFamily: inter,
        fontSize: 36,
        fontWeight: 700,
        color: "#FFFFFF",
        marginBottom: 12,
      }}>{title}</div>

      <div style={{
        fontFamily: inter,
        fontSize: 22,
        fontWeight: 400,
        color: "rgba(255,255,255,0.6)",
        maxWidth: 350,
        margin: "0 auto",
        lineHeight: 1.4,
      }}>{desc}</div>
    </div>
  );
};

export const Scene3HowItWorks = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const titleOpacity = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [30, 0]);

  // Connecting line between steps
  const lineWidth = interpolate(frame, [50, 120], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 120px" }}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <div style={{
          fontFamily: playfair,
          fontSize: 68,
          fontWeight: 700,
          color: GOLD,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 80,
          textShadow: `0 0 60px rgba(212,175,55,0.2)`,
        }}>
          How It Works
        </div>

        <div style={{ display: "flex", gap: 60, justifyContent: "center", alignItems: "flex-start" }}>
          <Step num="1" title="Discover" desc="Browse our directory of Black-owned businesses near you" delay={20} />
          <Step num="2" title="Visit" desc="Go to participating businesses in your area" delay={45} />
          <Step num="3" title="Scan & Save" desc="Scan QR code at checkout for instant discounts + points" delay={70} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
