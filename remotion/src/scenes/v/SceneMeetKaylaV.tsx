import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../../components/CinematicBg";
import { GoldDivider } from "../../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const TIERS = [
  { label: "C-SUITE", count: 9, examples: "CEO · COO · CFO · CMO · CRO · CTO" },
  { label: "FINANCE", count: 5, examples: "Bookkeeper · Tax · Invoicing" },
  { label: "MARKETING", count: 5, examples: "Content · Social · SEO · Email" },
  { label: "OPERATIONS", count: 5, examples: "Support · Schedule · Vendor · HR" },
  { label: "GROWTH", count: 4, examples: "Research · SDR · Funnel" },
  { label: "COMMUNITY", count: 5, examples: "Reviews · PR · Events · Loyalty" },
];

export const SceneMeetKaylaV: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tSp = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });
  const tY = interpolate(tSp, [0, 1], [40, 0]);
  const tOp = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={durationInFrames} />

      {/* TOP: Title block */}
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, padding: "0 8%", textAlign: "center", opacity: tOp, transform: `translateY(${tY}px)` }}>
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 10, color: "#FFB300", textTransform: "uppercase", marginBottom: 22 }}>
          ─── Chapter 01
        </div>
        <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 130, color: "#FFFFFF", lineHeight: 0.95, letterSpacing: -3 }}>
          Meet
        </div>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 150, color: "#FFB300", lineHeight: 1, letterSpacing: -3, marginTop: 4 }}>
          Kayla.
        </div>
        <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}><GoldDivider width={300} delay={20} /></div>
        <div style={{ marginTop: 22, fontFamily: inter, fontWeight: 400, fontSize: 30, color: "rgba(255,255,255,0.80)", lineHeight: 1.4 }}>
          CEO of an entire AI workforce.<br />
          33 specialized agents · 5 departments
        </div>
      </div>

      {/* BOTTOM: Org chart stack */}
      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, padding: "0 6%", display: "flex", flexDirection: "column", gap: 14 }}>
        {TIERS.map((t, i) => (
          <TierRow key={i} {...t} highlight={i === 0} frame={frame - (40 + i * 28)} />
        ))}
        <TotalBadge frame={frame - (40 + TIERS.length * 28 + 30)} />
      </div>
    </AbsoluteFill>
  );
};

const TierRow: React.FC<{ label: string; count: number; examples: string; highlight?: boolean; frame: number }> = ({ label, count, examples, highlight, frame }) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const x = interpolate(sp, [0, 1], [80, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        opacity: op,
        transform: `translateX(${x}px)`,
        background: highlight ? "linear-gradient(90deg, rgba(255,179,0,0.14), rgba(255,179,0,0.02))" : "rgba(255,255,255,0.04)",
        border: highlight ? "1px solid rgba(255,179,0,0.5)" : "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        padding: "14px 22px",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div style={{ minWidth: 78, height: 78, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: highlight ? "#FFB300" : "rgba(255,179,0,0.15)", color: highlight ? "#000814" : "#FFB300", fontFamily: playfair, fontWeight: 900, fontSize: 42 }}>
        {count}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 28, letterSpacing: 4, color: highlight ? "#FFB300" : "#FFFFFF" }}>{label}</div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 22, color: "rgba(255,255,255,0.70)", marginTop: 6 }}>{examples}</div>
      </div>
    </div>
  );
};

const TotalBadge: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const scale = interpolate(sp, [0, 1], [0.6, 1]);
  const op = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div style={{ marginTop: 14, opacity: op, transform: `scale(${scale})`, textAlign: "center", padding: "26px 32px", border: "2px solid #FFB300", borderRadius: 16, background: "rgba(255,179,0,0.10)" }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 20, letterSpacing: 8, color: "#FFB300" }}>TOTAL WORKFORCE</div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 96, color: "#FFFFFF", lineHeight: 1, marginTop: 8 }}>33 Agents</div>
      <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 24, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>One shared brain · Always on</div>
    </div>
  );
};
