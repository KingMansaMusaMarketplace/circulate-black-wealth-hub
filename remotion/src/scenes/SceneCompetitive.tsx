import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../components/CinematicBg";
import { GoldDivider } from "../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const COMPETITORS = [
  { name: "OpenAI · ChatGPT", verdict: "Powerful chatbot", limits: ["No shared memory", "No business context", "Waits for prompts"], score: 60 },
  { name: "Microsoft Copilot", verdict: "Document assistant", limits: ["Edits files, doesn't run business", "No autonomous action", "Per-app silos"], score: 65 },
  { name: "Salesforce Einstein", verdict: "CRM predictions", limits: ["7-figure implementation", "Only sees structured data", "Salesforce-locked"], score: 70 },
  { name: "Intuit QuickBooks AI", verdict: "Bookkeeping only", limits: ["Stops at the ledger", "No marketing or sales", "No community layer"], score: 55 },
];

// Scene 5: Competitive comparison (~55s = 1650 frames)
//   0-195   Title beat
//   195-1475 Four competitor rows (320 each)
//   1475-1650 Kayla winning row
export const SceneCompetitive: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={1650} />

      <Sequence from={0} durationInFrames={195} layout="none">
        <TitleBeat />
      </Sequence>

      {COMPETITORS.map((c, i) => (
        <Sequence key={i} from={195 + i * 320} durationInFrames={320} layout="none">
          <CompetitorRow {...c} />
        </Sequence>
      ))}

      <Sequence from={1475} durationInFrames={175} layout="none">
        <KaylaRow />
      </Sequence>
    </AbsoluteFill>
  );
};

const TitleBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });
  const y = interpolate(sp, [0, 1], [40, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [165, 195], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: op * opOut, transform: `translateY(${y}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 10, color: "#FFB300", textTransform: "uppercase", marginBottom: 24 }}>
          ─── Chapter 03 · The Competition
        </div>
        <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 140, color: "#FFFFFF", lineHeight: 1, letterSpacing: -3 }}>
          Compare.
        </div>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 64, color: "#FFB300", marginTop: 16 }}>
          Then decide.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CompetitorRow: React.FC<{ name: string; verdict: string; limits: string[]; score: number }> = ({ name, verdict, limits, score }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });
  const y = interpolate(sp, [0, 1], [50, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [290, 320], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barW = interpolate(spring({ frame: frame - 25, fps, config: { damping: 22, stiffness: 80 } }), [0, 1], [0, score]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 8%" }}>
      <div
        style={{
          opacity: op * opOut,
          transform: `translateY(${y}px)`,
          width: "85%",
          maxWidth: 1500,
          background: "linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: "44px 56px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 16, letterSpacing: 6, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
              Competitor
            </div>
            <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 60, color: "#FFFFFF", lineHeight: 1.05, marginTop: 6 }}>
              {name}
            </div>
            <div style={{ fontFamily: playfair, fontStyle: "italic", fontSize: 28, color: "#FFB300", marginTop: 8 }}>
              {verdict}
            </div>
          </div>
          <div style={{ minWidth: 360, textAlign: "right" }}>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 14, letterSpacing: 4, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
              Agentic Score
            </div>
            <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 90, color: "#FFFFFF", lineHeight: 1 }}>
              {Math.round(barW)}<span style={{ fontSize: 36, color: "rgba(255,255,255,0.45)" }}>/100</span>
            </div>
            <div style={{ width: 360, height: 8, borderRadius: 6, background: "rgba(255,255,255,0.08)", marginTop: 6, overflow: "hidden", marginLeft: "auto" }}>
              <div style={{ width: `${barW}%`, height: "100%", background: "linear-gradient(90deg,#7a1f1f,#c97474)", borderRadius: 6 }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 22 }}><GoldDivider width={120} delay={20} /></div>
        <div style={{ marginTop: 18, display: "flex", gap: 14, flexWrap: "wrap" }}>
          {limits.map((l, i) => (
            <div
              key={i}
              style={{
                fontFamily: inter,
                fontSize: 18,
                color: "rgba(255,255,255,0.78)",
                background: "rgba(200,80,80,0.12)",
                border: "1px solid rgba(200,80,80,0.35)",
                padding: "10px 18px",
                borderRadius: 8,
              }}
            >
              ✕ {l}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const KaylaRow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const scale = interpolate(sp, [0, 1], [0.9, 1]);
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const barW = interpolate(spring({ frame: frame - 30, fps, config: { damping: 22, stiffness: 80 } }), [0, 1], [0, 99]);
  const wins = ["✓ Shared agentic memory", "✓ All 33 roles in one platform", "✓ Patent-pending matchmaking", "✓ Always-on autonomous action"];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 8%" }}>
      <div
        style={{
          opacity: op,
          transform: `scale(${scale})`,
          width: "85%",
          maxWidth: 1500,
          background: "linear-gradient(90deg, rgba(255,179,0,0.18), rgba(255,179,0,0.04))",
          border: "2px solid #FFB300",
          borderRadius: 18,
          padding: "44px 56px",
          boxShadow: "0 30px 80px rgba(255,179,0,0.18)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 16, letterSpacing: 6, color: "#FFB300", textTransform: "uppercase" }}>
              The Winner
            </div>
            <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 70, color: "#FFFFFF", lineHeight: 1.05, marginTop: 6 }}>
              Kayla · 1325·AI
            </div>
            <div style={{ fontFamily: playfair, fontStyle: "italic", fontSize: 30, color: "#FFB300", marginTop: 8 }}>
              One unified workforce.
            </div>
          </div>
          <div style={{ minWidth: 360, textAlign: "right" }}>
            <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 14, letterSpacing: 4, color: "#FFB300", textTransform: "uppercase" }}>
              Agentic Score
            </div>
            <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 110, color: "#FFB300", lineHeight: 1 }}>
              {Math.round(barW)}<span style={{ fontSize: 40, color: "rgba(255,255,255,0.55)" }}>/100</span>
            </div>
            <div style={{ width: 360, height: 10, borderRadius: 6, background: "rgba(255,255,255,0.10)", marginTop: 6, overflow: "hidden", marginLeft: "auto" }}>
              <div style={{ width: `${barW}%`, height: "100%", background: "linear-gradient(90deg,#FFB300,#FFE08A)", borderRadius: 6, boxShadow: "0 0 20px rgba(255,179,0,0.7)" }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24, display: "flex", gap: 14, flexWrap: "wrap" }}>
          {wins.map((w, i) => (
            <div
              key={i}
              style={{
                fontFamily: inter,
                fontSize: 18,
                color: "#FFFFFF",
                background: "rgba(255,179,0,0.18)",
                border: "1px solid rgba(255,179,0,0.55)",
                padding: "10px 18px",
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              {w}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
