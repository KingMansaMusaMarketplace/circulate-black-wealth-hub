import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
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

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at center, #001028 0%, #000814 70%)", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
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
