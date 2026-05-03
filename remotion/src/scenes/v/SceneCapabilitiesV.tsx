import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../../components/CinematicBg";
import { GoldDivider } from "../../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

type Dept = { name: string; tag: string; caps: { title: string; sub: string }[] };

const DEPTS: Dept[] = [
  { name: "Finance", tag: "FORECAST · RECONCILE", caps: [
    { title: "Cash-Flow Forecast", sub: "Real-time 90-day projections" },
    { title: "Auto-Reconciliation", sub: "Bank + ledger sync, daily" },
    { title: "Tax Strategy", sub: "Quarterly prep, deduction-aware" },
    { title: "Price Optimizer", sub: "Margin-aware recommendations" },
  ]},
  { name: "Marketing", tag: "CONTENT · CAMPAIGNS", caps: [
    { title: "Content Studio", sub: "Long-form + social, on-brand" },
    { title: "Campaign Engine", sub: "Multi-channel launch & test" },
    { title: "SEO Specialist", sub: "Keyword + on-page automation" },
    { title: "Email Strategist", sub: "Sequences that convert" },
  ]},
  { name: "Operations", tag: "SUPPORT · SCHEDULE", caps: [
    { title: "Customer Support", sub: "Sub-second response, 24/7" },
    { title: "Smart Scheduler", sub: "Calendar + booking automation" },
    { title: "Vendor Liaison", sub: "Procurement + contract terms" },
    { title: "Quality Auditor", sub: "Transaction-level monitoring" },
  ]},
  { name: "Growth", tag: "RESEARCH · OUTBOUND", caps: [
    { title: "Lead Researcher", sub: "ICP-matched prospect lists" },
    { title: "Outbound SDR", sub: "Personalized at scale" },
    { title: "Funnel Optimizer", sub: "A/B tests every step" },
    { title: "Partnership Scout", sub: "Strategic alliance discovery" },
  ]},
  { name: "Community", tag: "REVIEWS · PR · LOYALTY", caps: [
    { title: "Reviews Manager", sub: "Reputation defense + response" },
    { title: "PR Liaison", sub: "Press pitching + media outreach" },
    { title: "Event Coordinator", sub: "Activations end-to-end" },
    { title: "Loyalty Programs", sub: "Tier rewards that re-engage" },
  ]},
];

export const SceneCapabilitiesV: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const PER = Math.floor(durationInFrames / DEPTS.length);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={durationInFrames} />
      {DEPTS.map((d, i) => (
        <Sequence key={i} from={i * PER} durationInFrames={PER} layout="none">
          <DeptScene dept={d} per={PER} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const DeptScene: React.FC<{ dept: Dept; per: number }> = ({ dept, per }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });
  const yTitle = interpolate(sp, [0, 1], [40, 0]);
  const opTitle = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [per - 28, per], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ padding: "120px 6% 80px 6%", opacity: opOut }}>
      {/* TOP: dept title */}
      <div style={{ opacity: opTitle, transform: `translateY(${yTitle}px)`, textAlign: "center", marginBottom: 50 }}>
        <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 10, color: "#FFB300", textTransform: "uppercase", marginBottom: 18 }}>
          {dept.tag}
        </div>
        <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 150, color: "#FFFFFF", lineHeight: 0.95, letterSpacing: -3 }}>
          {dept.name}
        </div>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 50, color: "#FFB300", marginTop: 12 }}>
          Department
        </div>
        <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}><GoldDivider width={240} delay={20} /></div>
        <div style={{ marginTop: 16, fontFamily: inter, fontSize: 24, color: "rgba(255,255,255,0.65)" }}>
          {dept.caps.length} specialist agents · always on
        </div>
      </div>

      {/* BOTTOM: capability cards stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {dept.caps.map((c, i) => (
          <CapCard key={i} idx={i} title={c.title} sub={c.sub} frame={frame - (40 + i * 22)} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CapCard: React.FC<{ idx: number; title: string; sub: string; frame: number }> = ({ idx, title, sub, frame }) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const x = interpolate(sp, [0, 1], [90, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        opacity: op,
        transform: `translateX(${x}px)`,
        background: "linear-gradient(90deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,179,0,0.22)",
        borderLeft: "4px solid #FFB300",
        borderRadius: 14,
        padding: "22px 28px",
        display: "flex",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div style={{ minWidth: 78, height: 78, borderRadius: 14, background: "rgba(255,179,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: playfair, fontWeight: 900, fontSize: 38, color: "#FFB300" }}>
        {String(idx + 1).padStart(2, "0")}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 44, color: "#FFFFFF", lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 26, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};
