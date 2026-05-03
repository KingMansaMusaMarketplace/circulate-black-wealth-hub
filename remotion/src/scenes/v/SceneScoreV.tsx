import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../../components/CinematicBg";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

export const SceneScoreV: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={durationInFrames} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 8%" }}>
        <Header frame={frame} />
        <ScoreRing frame={frame - 30} />
        <Caption frame={frame - 90} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Header: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, textAlign: "center", marginBottom: 50 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 10, color: "#FFB300", textTransform: "uppercase", marginBottom: 16 }}>
        ─── Capabilities Score
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 90, color: "#FFFFFF", lineHeight: 1, letterSpacing: -2 }}>
        Top-tier
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 60, color: "#FFB300", marginTop: 6 }}>
        coverage.
      </div>
    </div>
  );
};

const ScoreRing: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const progress = interpolate(sp, [0, 1], [0, 0.94]);
  const num = Math.round(interpolate(frame, [0, 60], [0, 94], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.04) * 0.012;

  const SIZE = 720;
  const STROKE = 32;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;

  return (
    <div style={{ opacity: op, position: "relative", width: SIZE, height: SIZE, transform: `scale(${pulse})` }}>
      <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="rgba(255,255,255,0.08)" strokeWidth={STROKE} fill="none" />
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="#FFB300" strokeWidth={STROKE} fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} style={{ filter: "drop-shadow(0 0 40px rgba(255,179,0,0.6))" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 8, color: "#FFB300", textTransform: "uppercase" }}>
          Capabilities
        </div>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 8 }}>
          <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 280, color: "#FFFFFF", lineHeight: 1, letterSpacing: -8 }}>{num}</div>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 80, color: "rgba(255,255,255,0.45)", marginLeft: 8 }}>/100</div>
        </div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 22, color: "rgba(255,255,255,0.65)", marginTop: 8 }}>
          Every business function
        </div>
      </div>
    </div>
  );
};

const Caption: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, marginTop: 50, padding: "26px 40px", border: "1px dashed rgba(255,179,0,0.5)", borderRadius: 14, background: "rgba(255,179,0,0.06)", fontFamily: inter, fontSize: 30, color: "rgba(255,255,255,0.90)", textAlign: "center" }}>
      <span style={{ color: "#FFB300", fontWeight: 700 }}>Closed-loop learning:</span> smarter every week.
    </div>
  );
};
