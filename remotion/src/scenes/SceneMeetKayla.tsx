import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../components/CinematicBg";
import { GoldDivider } from "../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const TIERS = [
  { label: "C-SUITE", count: 9, examples: "CEO · COO · CFO · CMO · CRO · CTO · CGO · CLO · CIRO" },
  { label: "FINANCE", count: 5, examples: "Bookkeeper · Tax · Invoicing · Collections · Budget" },
  { label: "MARKETING", count: 5, examples: "Content · Social · SEO · Email · Brand" },
  { label: "OPERATIONS", count: 5, examples: "Support · Schedule · Vendor · Quality · HR" },
  { label: "GROWTH", count: 4, examples: "Research · SDR · Funnel · Partnerships" },
  { label: "COMMUNITY", count: 5, examples: "Reviews · PR · Events · Loyalty · Ambassadors" },
];

// Scene 2: Meet Kayla & the 33 (~32s = 960 frames)
export const SceneMeetKayla: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title block
  const tSp = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });
  const tY = interpolate(tSp, [0, 1], [40, 0]);
  const tOp = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={960} />

      <AbsoluteFill style={{ flexDirection: "row", padding: "8% 8%" }}>
        {/* LEFT: title block */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 60 }}>
          <div style={{ opacity: tOp, transform: `translateY(${tY}px)` }}>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 8, color: "#FFB300", textTransform: "uppercase", marginBottom: 28 }}>
              ─── Chapter 01
            </div>
            <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 110, color: "#FFFFFF", lineHeight: 1.0, letterSpacing: -2.5 }}>
              Meet
            </div>
            <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 130, color: "#FFB300", lineHeight: 1.0, letterSpacing: -2.5 }}>
              Kayla.
            </div>
            <div style={{ marginTop: 36 }}><GoldDivider width={260} delay={20} /></div>
            <div style={{ marginTop: 28, fontFamily: inter, fontWeight: 400, fontSize: 28, color: "rgba(255,255,255,0.80)", lineHeight: 1.5, maxWidth: 540 }}>
              CEO of an entire AI workforce. <br />
              33 specialized agents. <br />
              9 C-suite roles. 5 departments.
            </div>
          </div>
        </div>

        {/* RIGHT: org chart */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 14 }}>
          <div style={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", gap: 14 }}>
            {TIERS.map((t, i) => {
              const delay = 30 + i * 30;
              return (
                <TierRow
                  key={i}
                  label={t.label}
                  count={t.count}
                  examples={t.examples}
                  highlight={i === 0}
                  frame={frame - delay}
                />
              );
            })}
            <TotalBadge frame={frame - (30 + TIERS.length * 30 + 30)} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TierRow: React.FC<{ label: string; count: number; examples: string; highlight?: boolean; frame: number }> = ({ label, count, examples, highlight, frame }) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const x = interpolate(sp, [0, 1], [60, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        opacity: op,
        transform: `translateX(${x}px)`,
        background: highlight ? "linear-gradient(90deg, rgba(255,179,0,0.12), rgba(255,179,0,0.02))" : "rgba(255,255,255,0.04)",
        border: highlight ? "1px solid rgba(255,179,0,0.45)" : "1px solid rgba(255,255,255,0.10)",
        borderRadius: 14,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div
        style={{
          minWidth: 64,
          height: 64,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: highlight ? "#FFB300" : "rgba(255,179,0,0.15)",
          color: highlight ? "#000814" : "#FFB300",
          fontFamily: playfair,
          fontWeight: 900,
          fontSize: 34,
        }}
      >
        {count}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 16, letterSpacing: 4, color: highlight ? "#FFB300" : "#FFFFFF" }}>
          {label}
        </div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
          {examples}
        </div>
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
    <div
      style={{
        marginTop: 14,
        opacity: op,
        transform: `scale(${scale})`,
        textAlign: "center",
        padding: "18px 32px",
        border: "2px solid #FFB300",
        borderRadius: 14,
        background: "rgba(255,179,0,0.08)",
      }}
    >
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 14, letterSpacing: 6, color: "#FFB300" }}>TOTAL WORKFORCE</div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 60, color: "#FFFFFF", lineHeight: 1 }}>33 Agents</div>
      <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>One shared brain · Always on</div>
    </div>
  );
};
