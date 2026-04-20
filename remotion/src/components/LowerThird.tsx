import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500"], subsets: ["latin"] });

interface Props {
  line1: string;
  line2: string;
  delay?: number;
}

export const LowerThird = ({ line1, line2, delay = 0 }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp1 = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 100 } });
  const sp2 = spring({ frame: frame - delay - 10, fps, config: { damping: 18, stiffness: 100 } });
  const y1 = interpolate(sp1, [0, 1], [30, 0]);
  const y2 = interpolate(sp2, [0, 1], [30, 0]);
  const op1 = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const op2 = interpolate(frame - delay - 10, [0, 14], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div style={{ maxWidth: 900 }}>
      <div
        style={{
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 22,
          color: "#FFB300",
          letterSpacing: 8,
          textTransform: "uppercase",
          marginBottom: 24,
          opacity: op1,
          transform: `translateY(${y1}px)`,
        }}
      >
        ─── A Choice
      </div>
      <div
        style={{
          fontFamily: playfair,
          fontWeight: 700,
          fontSize: 96,
          color: "#FFFFFF",
          lineHeight: 1.05,
          letterSpacing: -1.5,
          opacity: op1,
          transform: `translateY(${y1}px)`,
        }}
      >
        {line1}
      </div>
      <div
        style={{
          fontFamily: playfair,
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 96,
          color: "#FFB300",
          lineHeight: 1.05,
          letterSpacing: -1.5,
          opacity: op2,
          transform: `translateY(${y2}px)`,
        }}
      >
        {line2}
      </div>
    </div>
  );
};
