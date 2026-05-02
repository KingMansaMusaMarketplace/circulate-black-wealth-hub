import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { GoldDivider } from "../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

// Scene 1: Cold open hook (~18s = 540 frames)
// Three rhetorical beats. Frame-driven phases instead of nested Sequences
// so every element stays inside the centered absolute layout.
export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.012) * 30;

  // 0-180 = beat 1, 180-360 = beat 2, 360-540 = beat 3
  const phase = frame < 180 ? 0 : frame < 360 ? 1 : 2;
  const localFrame = frame - phase * 180;

  const beats = [
    { text: "Your entire C-suite.", subtext: "Working 24 / 7." },
    { text: "33 executives.", subtext: "One subscription." },
    { text: "This is Kayla.", subtext: "The future of business.", gold: true },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000814", overflow: "hidden" }}>
      {/* Gold ambient beam */}
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

      {/* Eyebrow stays through the whole scene */}
      <Eyebrow frame={frame} />

      {/* Centered beat */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 12%" }}>
        <BigBeat key={phase} localFrame={localFrame} {...beats[phase]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 90, left: 0, right: 0, opacity: op, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 10, color: "#FFB300", textTransform: "uppercase" }}>
        1325 · A I  ·  Capabilities Report
      </div>
      <GoldDivider width={300} />
    </div>
  );
};

const BigBeat: React.FC<{ localFrame: number; text: string; subtext: string; gold?: boolean }> = ({ localFrame, text, subtext, gold }) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame: localFrame, fps, config: { damping: 22, stiffness: 90 } });
  const y = interpolate(sp, [0, 1], [40, 0]);
  const opIn = interpolate(localFrame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(localFrame, [150, 175], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blur = interpolate(localFrame, [0, 18], [10, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{ opacity: opIn * opOut, transform: `translateY(${y}px)`, filter: `blur(${blur}px)`, textAlign: "center" }}>
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
