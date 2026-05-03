import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../../components/CinematicBg";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const COMPETITORS = [
  { name: "ChatGPT", verdict: "1 chatbot. Waits for prompts.", limits: ["No shared memory", "No business context"], score: 60 },
  { name: "Real C-Suite", verdict: "$2M+ per year.", limits: ["Months to hire", "Sleeps 8 hrs/day"], score: 70 },
];

export const SceneCompetitiveV: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const titleDur = Math.round(durationInFrames * 0.15);
  const rowDur = Math.round(durationInFrames * 0.30);
  const kaylaDur = durationInFrames - titleDur - rowDur * 2;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={durationInFrames} />
      <Sequence from={0} durationInFrames={titleDur} layout="none"><TitleBeat dur={titleDur} /></Sequence>
      {COMPETITORS.map((c, i) => (
        <Sequence key={i} from={titleDur + i * rowDur} durationInFrames={rowDur} layout="none">
          <CompetitorCard {...c} dur={rowDur} />
        </Sequence>
      ))}
      <Sequence from={titleDur + rowDur * 2} durationInFrames={kaylaDur} layout="none"><KaylaCard dur={kaylaDur} /></Sequence>
    </AbsoluteFill>
  );
};

const TitleBeat: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });
  const y = interpolate(sp, [0, 1], [40, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [dur - 20, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 8%" }}>
      <div style={{ opacity: op * opOut, transform: `translateY(${y}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 10, color: "#FFB300", textTransform: "uppercase", marginBottom: 24 }}>
          ─── The Competition
        </div>
        <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 170, color: "#FFFFFF", lineHeight: 0.95, letterSpacing: -4 }}>
          Compare.
        </div>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 80, color: "#FFB300", marginTop: 18 }}>
          Then decide.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CompetitorCard: React.FC<{ name: string; verdict: string; limits: string[]; score: number; dur: number }> = ({ name, verdict, limits, score, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });
  const y = interpolate(sp, [0, 1], [60, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [dur - 26, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barW = interpolate(spring({ frame: frame - 25, fps, config: { damping: 22, stiffness: 80 } }), [0, 1], [0, score]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 6%" }}>
      <div style={{ opacity: op * opOut, transform: `translateY(${y}px)`, width: "100%", background: "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 22, padding: "50px 50px" }}>
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 18, letterSpacing: 8, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
          Competitor
        </div>
        <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 110, color: "#FFFFFF", lineHeight: 1, marginTop: 8, letterSpacing: -3 }}>
          {name}
        </div>
        <div style={{ fontFamily: playfair, fontStyle: "italic", fontSize: 42, color: "#FFB300", marginTop: 14 }}>
          {verdict}
        </div>

        <div style={{ marginTop: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 16, letterSpacing: 6, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
              Score
            </div>
            <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 130, color: "#FFFFFF", lineHeight: 1 }}>
              {Math.round(barW)}<span style={{ fontSize: 50, color: "rgba(255,255,255,0.45)" }}>/100</span>
            </div>
          </div>
        </div>
        <div style={{ width: "100%", height: 12, borderRadius: 8, background: "rgba(255,255,255,0.08)", marginTop: 8, overflow: "hidden" }}>
          <div style={{ width: `${barW}%`, height: "100%", background: "linear-gradient(90deg,#7a1f1f,#c97474)", borderRadius: 8 }} />
        </div>

        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 12 }}>
          {limits.map((l, i) => (
            <div key={i} style={{ fontFamily: inter, fontSize: 24, color: "rgba(255,255,255,0.85)", background: "rgba(200,80,80,0.14)", border: "1px solid rgba(200,80,80,0.4)", padding: "14px 22px", borderRadius: 10 }}>
              ✕ {l}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const KaylaCard: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const scale = interpolate(sp, [0, 1], [0.9, 1]);
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const barW = interpolate(spring({ frame: frame - 30, fps, config: { damping: 22, stiffness: 80 } }), [0, 1], [0, 99]);
  const wins = ["✓ Shared agentic memory", "✓ All 33 roles, one platform", "✓ Always-on autonomous action"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 6%" }}>
      <div style={{ opacity: op, transform: `scale(${scale})`, width: "100%", background: "linear-gradient(160deg, rgba(255,179,0,0.20), rgba(255,179,0,0.04))", border: "2px solid #FFB300", borderRadius: 22, padding: "50px", boxShadow: "0 30px 90px rgba(255,179,0,0.22)" }}>
        <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 18, letterSpacing: 8, color: "#FFB300", textTransform: "uppercase" }}>
          The Winner
        </div>
        <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 110, color: "#FFFFFF", lineHeight: 1.0, marginTop: 8, letterSpacing: -3 }}>
          Kayla
        </div>
        <div style={{ fontFamily: playfair, fontStyle: "italic", fontSize: 38, color: "#FFB300", marginTop: 10 }}>
          One unified workforce.
        </div>

        <div style={{ marginTop: 36 }}>
          <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 16, letterSpacing: 6, color: "#FFB300", textTransform: "uppercase" }}>Score</div>
          <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 160, color: "#FFB300", lineHeight: 1 }}>
            {Math.round(barW)}<span style={{ fontSize: 60, color: "rgba(255,255,255,0.55)" }}>/100</span>
          </div>
          <div style={{ width: "100%", height: 14, borderRadius: 8, background: "rgba(255,255,255,0.10)", marginTop: 8, overflow: "hidden" }}>
            <div style={{ width: `${barW}%`, height: "100%", background: "linear-gradient(90deg,#FFB300,#FFE08A)", borderRadius: 8, boxShadow: "0 0 20px rgba(255,179,0,0.7)" }} />
          </div>
        </div>

        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 12 }}>
          {wins.map((w, i) => (
            <div key={i} style={{ fontFamily: inter, fontSize: 24, color: "#FFFFFF", background: "rgba(255,179,0,0.18)", border: "1px solid rgba(255,179,0,0.55)", padding: "14px 22px", borderRadius: 10, fontWeight: 500 }}>
              {w}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
