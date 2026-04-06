import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/Playfair";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600"], subsets: ["latin"] });

const GOLD = "#D4AF37";

const ValueCard = ({ text, delay, icon }: { text: string; delay: number; icon: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 150 } });
  const x = interpolate(progress, [0, 1], [-80, 0]);
  const opacity = interpolate(progress, [0, 0.3, 1], [0, 0.5, 1]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 24,
      opacity,
      transform: `translateX(${x}px)`,
      marginBottom: 28,
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}44)`,
        border: `1px solid ${GOLD}66`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{
        fontFamily: inter,
        fontSize: 34,
        fontWeight: 600,
        color: "rgba(255,255,255,0.9)",
      }}>
        {text}
      </span>
    </div>
  );
};

export const Scene2Value = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 160px" }}>
      <div>
        <div style={{
          fontFamily: playfair,
          fontSize: 72,
          fontWeight: 700,
          color: "#FFFFFF",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 60,
          lineHeight: 1.15,
        }}>
          What if every purchase{"\n"}
          <span style={{ color: GOLD }}>built wealth?</span>
        </div>

        <ValueCard icon="💰" text="5-30% discounts at every visit" delay={25} />
        <ValueCard icon="⭐" text="Earn loyalty points that turn into rewards" delay={40} />
        <ValueCard icon="🤝" text="Circulate wealth within the community" delay={55} />
        <ValueCard icon="🆓" text="100% FREE — No credit card required" delay={70} />
      </div>
    </AbsoluteFill>
  );
};
