import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../components/CinematicBg";
import { GoldDivider } from "../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

// Scene 4: 99/100 score breakdown (~40s = 1200 frames)
// Big circular score on left, three pillars on right.
const PILLARS = [
  { num: "01", title: "Shared Business Context", sub: "Every agent reads & writes to one unified memory before any decision." },
  { num: "02", title: "Server-Side Orchestration", sub: "Coordinated, idempotent, fully auditable — not scattered tabs." },
  { num: "03", title: "Reasoning Transparency", sub: "Every recommendation ships with a Why-This-Card explainer." },
];

export const SceneScore: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={1200} />
      <AbsoluteFill style={{ flexDirection: "row", padding: "7% 7%" }}>
        {/* LEFT: score */}
        <div style={{ flex: 0.95, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Sequence from={0} durationInFrames={1200}>
            <ScoreRing />
          </Sequence>
        </div>
        {/* RIGHT: pillars */}
        <div style={{ flex: 1.05, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, paddingLeft: 40 }}>
          <Sequence from={20} durationInFrames={1200}>
            <PillarsHeader />
          </Sequence>
          {PILLARS.map((p, i) => (
            <Sequence key={i} from={140 + i * 70} durationInFrames={1200}>
              <PillarRow num={p.num} title={p.title} sub={p.sub} />
            </Sequence>
          ))}
          <Sequence from={140 + PILLARS.length * 70 + 60} durationInFrames={1200}>
            <LearningCallout />
          </Sequence>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ScoreRing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const progress = interpolate(sp, [0, 1], [0, 0.99]);
  const num = Math.round(interpolate(frame, [0, 60], [0, 99], { extrapolateRight: "clamp" }));
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.04) * 0.012;

  const SIZE = 480;
  const STROKE = 22;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;

  return (
    <div style={{ opacity: op, position: "relative", width: SIZE, height: SIZE, transform: `scale(${pulse})` }}>
      <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="rgba(255,255,255,0.08)" strokeWidth={STROKE} fill="none" />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke="#FFB300"
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
          style={{ filter: "drop-shadow(0 0 30px rgba(255,179,0,0.5))" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 16, letterSpacing: 6, color: "#FFB300", textTransform: "uppercase" }}>
          Agentic Maturity
        </div>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 6 }}>
          <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 220, color: "#FFFFFF", lineHeight: 1, letterSpacing: -6 }}>{num}</div>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 60, color: "rgba(255,255,255,0.45)", marginLeft: 6 }}>/100</div>
        </div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 18, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
          Shared brain · Server orchestration · Transparent
        </div>
      </div>
    </div>
  );
};

const PillarsHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, marginBottom: 6 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 18, letterSpacing: 8, color: "#FFB300", textTransform: "uppercase", marginBottom: 14 }}>
        ─── Why 99 / 100
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 64, color: "#FFFFFF", lineHeight: 1, letterSpacing: -1.5 }}>
        Three pillars.
      </div>
      <GoldDivider width={180} delay={20} />
    </div>
  );
};

const PillarRow: React.FC<{ num: string; title: string; sub: string }> = ({ num, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const x = interpolate(sp, [0, 1], [60, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, transform: `translateX(${x}px)`, display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 56, color: "#FFB300", lineHeight: 1, minWidth: 90 }}>{num}</div>
      <div>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 32, color: "#FFFFFF", lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontFamily: inter, fontSize: 18, color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 1.4 }}>{sub}</div>
      </div>
    </div>
  );
};

const LearningCallout: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 16, stiffness: 100 } });
  const op = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(sp, [0, 1], [0.92, 1]);
  return (
    <div
      style={{
        opacity: op,
        transform: `scale(${scale})`,
        marginTop: 14,
        padding: "16px 22px",
        border: "1px dashed rgba(255,179,0,0.5)",
        borderRadius: 10,
        background: "rgba(255,179,0,0.06)",
        fontFamily: inter,
        fontSize: 17,
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <span style={{ color: "#FFB300", fontWeight: 700 }}>+ Closed-loop learning:</span> measurably smarter every single week.
    </div>
  );
};
