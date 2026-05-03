import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { GoldDivider } from "../../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

// Vertical hook — same 3-beat structure, scaled for 1080x1920.
export const SceneHookV: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = Math.sin(frame * 0.012) * 30;

  const phaseLen = Math.floor(durationInFrames / 3);
  const phase = frame < phaseLen ? 0 : frame < phaseLen * 2 ? 1 : 2;
  const localFrame = frame - phase * phaseLen;

  const beats = [
    { text: "Your entire", text2: "C-suite.", subtext: "Working 24 / 7." },
    { text: "33 executives.", text2: "", subtext: "One subscription." },
    { text: "This is", text2: "Kayla.", subtext: "The future of business.", gold: true },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000814", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -300,
          left: -200,
          width: 1600,
          height: 1600,
          background: "radial-gradient(circle, rgba(255,179,0,0.10) 0%, transparent 60%)",
          filter: "blur(80px)",
          transform: `translate(${drift}px, ${drift * 0.5}px)`,
        }}
      />
      <Eyebrow frame={frame} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 8%" }}>
        <BigBeat key={phase} localFrame={localFrame} phaseLen={phaseLen} {...beats[phase]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 140, left: 0, right: 0, opacity: op, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 28, letterSpacing: 12, color: "#FFB300", textTransform: "uppercase", textAlign: "center" }}>
        1325 · A I
      </div>
      <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 18, letterSpacing: 6, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
        Capabilities Report
      </div>
      <GoldDivider width={260} />
    </div>
  );
};

const BigBeat: React.FC<{ localFrame: number; phaseLen: number; text: string; text2?: string; subtext: string; gold?: boolean }> = ({ localFrame, phaseLen, text, text2, subtext, gold }) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame: localFrame, fps, config: { damping: 22, stiffness: 90 } });
  const y = interpolate(sp, [0, 1], [40, 0]);
  const opIn = interpolate(localFrame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(localFrame, [phaseLen - 25, phaseLen], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blur = interpolate(localFrame, [0, 18], [10, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{ opacity: opIn * opOut, transform: `translateY(${y}px)`, filter: `blur(${blur}px)`, textAlign: "center" }}>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 140, letterSpacing: -3, color: gold ? "#FFB300" : "#FFFFFF", lineHeight: 1.0 }}>
        {text}
      </div>
      {text2 && (
        <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 140, letterSpacing: -3, color: gold ? "#FFB300" : "#FFFFFF", lineHeight: 1.0, marginTop: 8 }}>
          {text2}
        </div>
      )}
      <div style={{ marginTop: 50, fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 70, color: gold ? "#FFFFFF" : "#FFB300", letterSpacing: -1 }}>
        {subtext}
      </div>
    </div>
  );
};
