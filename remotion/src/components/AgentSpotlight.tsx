import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

interface Props {
  image: string;
  number: string;
  name: string;
  title: string;
  responsibility: string;
  accent?: string;
}

export const AgentSpotlight = ({ image, number, name, title, responsibility, accent = "#FFB300" }: Props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const imgSpring = spring({ frame, fps, config: { damping: 18, stiffness: 70 } });
  const imgScale = interpolate(imgSpring, [0, 1], [1.15, 1]);
  const imgOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  // Ken Burns slow drift
  const kenX = interpolate(frame, [0, durationInFrames], [0, -30]);
  const kenY = interpolate(frame, [0, durationInFrames], [0, -15]);

  const textOp = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(frame, [20, 45], [40, 0], { extrapolateRight: "clamp" });

  const numOp = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const numScale = interpolate(frame, [10, 30], [0.7, 1], { extrapolateRight: "clamp" });

  const lineW = interpolate(frame, [35, 60], [0, 480], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000814" }}>
      {/* Left: Portrait */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "55%", height: "100%", overflow: "hidden" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${imgScale}) translate(${kenX}px, ${kenY}px)`,
            opacity: imgOp,
          }}
        >
          <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Right edge gradient blend into dark */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(0,8,20,0) 60%, rgba(0,8,20,1) 100%)",
          }}
        />
        {/* Bottom shadow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>

      {/* Right: Editorial text */}
      <div
        style={{
          position: "absolute",
          left: "58%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "38%",
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 28,
            color: accent,
            letterSpacing: 8,
            opacity: numOp,
            transform: `scale(${numScale})`,
            transformOrigin: "left center",
            marginBottom: 16,
          }}
        >
          KAYLA · {number}
        </div>

        <div
          style={{
            fontFamily: playfair,
            fontWeight: 900,
            fontSize: 88,
            color: "#FFFFFF",
            lineHeight: 0.95,
            opacity: textOp,
            transform: `translateY(${textY}px)`,
            marginBottom: 18,
          }}
        >
          {name}
        </div>

        <div
          style={{
            height: 2,
            width: lineW,
            background: `linear-gradient(90deg, ${accent}, transparent)`,
            marginBottom: 22,
          }}
        />

        <div
          style={{
            fontFamily: inter,
            fontWeight: 500,
            fontSize: 32,
            color: accent,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: textOp,
            transform: `translateY(${textY}px)`,
            marginBottom: 28,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontFamily: inter,
            fontWeight: 300,
            fontSize: 26,
            color: "#E8E8E8",
            lineHeight: 1.5,
            opacity: textOp,
            transform: `translateY(${textY}px)`,
            maxWidth: 620,
          }}
        >
          {responsibility}
        </div>
      </div>
    </AbsoluteFill>
  );
};
