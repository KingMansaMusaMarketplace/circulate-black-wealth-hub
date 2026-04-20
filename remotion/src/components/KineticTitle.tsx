import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: playfair } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

interface Props {
  text: string;
  size?: number;
  color?: string;
  italic?: boolean;
  delay?: number;
  align?: "left" | "center" | "right";
  letterSpacing?: number;
}

// Apple-style word-by-word reveal: each word springs up + blurs in
export const KineticTitle = ({
  text,
  size = 140,
  color = "#FFFFFF",
  italic = false,
  delay = 0,
  align = "center",
  letterSpacing = -2,
}: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        gap: size * 0.18,
        fontFamily: playfair,
        fontWeight: 700,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        color,
        lineHeight: 1.05,
        letterSpacing,
        textAlign: align,
      }}
    >
      {words.map((w, i) => {
        const localFrame = frame - delay - i * 4;
        const sp = spring({
          frame: localFrame,
          fps,
          config: { damping: 18, stiffness: 90, mass: 0.9 },
        });
        const y = interpolate(sp, [0, 1], [size * 0.35, 0]);
        const opacity = interpolate(localFrame, [0, 12], [0, 1], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        });
        const blur = interpolate(localFrame, [0, 18], [14, 0], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${y}px)`,
              opacity,
              filter: `blur(${blur}px)`,
              willChange: "transform, opacity",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
