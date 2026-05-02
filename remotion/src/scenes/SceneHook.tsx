import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { GoldDivider } from "../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

// Scene 1: Cold open hook (~18s = 540 frames)
// Three big rhetorical questions, each lands with weight.
export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow drift on background highlight
  const drift = Math.sin(frame * 0.012) * 30;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000814", overflow: "hidden" }}>
      {/* Single dramatic gold beam from top-left */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -100,
          width: 1400,
          height: 1400,
          background: "radial-gradient(circle, rgba(255,179,0,0.10) 0%, transparent 60%)",
          filter: "blur(80px)",
          transform: `translate(${drift}px, ${drift * 0.5}px)`,
        }}
      />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 12%" }}>
        {/* Eyebrow */}
        <Sequence from={0} durationInFrames={540}>
          <Eyebrow />
        </Sequence>

        {/* Q1 0-180 */}
        <Sequence from={0} durationInFrames={180}>
          <BigQuestion text="Your entire C-suite." subtext="Working 24 / 7." />
        </Sequence>
        {/* Q2 180-360 */}
        <Sequence from={180} durationInFrames={180}>
          <BigQuestion text="33 executives." subtext="One subscription." />
        </Sequence>
        {/* Q3 360-540 */}
        <Sequence from={360} durationInFrames={180}>
          <BigQuestion text="This is Kayla." subtext="The future of business." gold />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 120, opacity: op, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 10, color: "#FFB300", textTransform: "uppercase" }}>
        1325 · A I  &nbsp;·&nbsp;  Capabilities Report
      </div>
      <GoldDivider width={300} />
    </div>
  );
};

const BigQuestion: React.FC<{ text: string; subtext: string; gold?: boolean }> = ({ text, subtext, gold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });
  const y = interpolate(sp, [0, 1], [40, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [150, 175], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blur = interpolate(frame, [0, 18], [10, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity: op * opOut,
        transform: `translateY(${y}px)`,
        filter: `blur(${blur}px)`,
        textAlign: "center",
        position: "absolute",
      }}
    >
      <div
        style={{
          fontFamily: playfair,
          fontWeight: 900,
          fontSize: 150,
          letterSpacing: -3,
          color: gold ? "#FFB300" : "#FFFFFF",
          lineHeight: 1.0,
        }}
      >
        {text}
      </div>
      <div
        style={{
          marginTop: 32,
          fontFamily: playfair,
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 64,
          color: gold ? "#FFFFFF" : "#FFB300",
          letterSpacing: -1,
        }}
      >
        {subtext}
      </div>
    </div>
  );
};
