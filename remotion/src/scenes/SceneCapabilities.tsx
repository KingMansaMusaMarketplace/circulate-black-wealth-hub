import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../components/CinematicBg";
import { GoldDivider } from "../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

type Dept = {
  name: string;
  tag: string;
  caps: { title: string; sub: string }[];
};

const DEPTS: Dept[] = [
  { name: "Finance", tag: "FORECAST · RECONCILE · OPTIMIZE", caps: [
    { title: "Cash-Flow Forecast", sub: "Real-time 90-day projections" },
    { title: "Auto-Reconciliation", sub: "Bank + ledger sync, daily" },
    { title: "Tax Strategy", sub: "Deduction-aware quarterly prep" },
    { title: "Price Optimizer", sub: "Margin-aware recommendations" },
    { title: "Anomaly Detection", sub: "Flags fraud + leakage early" },
  ]},
  { name: "Marketing", tag: "CONTENT · CAMPAIGNS · BRAND", caps: [
    { title: "Content Studio", sub: "Long-form + social, on-brand" },
    { title: "Campaign Engine", sub: "Multi-channel launch & test" },
    { title: "SEO Specialist", sub: "Keyword + on-page automation" },
    { title: "Email Strategist", sub: "Sequences that actually convert" },
    { title: "Brand Designer", sub: "Visual assets in your palette" },
  ]},
  { name: "Operations", tag: "SUPPORT · SCHEDULE · QUALITY", caps: [
    { title: "Customer Support", sub: "Sub-second response, 24/7" },
    { title: "Smart Scheduler", sub: "Calendar + booking automation" },
    { title: "Vendor Liaison", sub: "Procurement + contract terms" },
    { title: "Quality Auditor", sub: "Transaction-level monitoring" },
    { title: "HR Coordinator", sub: "Onboarding + compliance" },
  ]},
  { name: "Growth", tag: "RESEARCH · OUTBOUND · FUNNEL", caps: [
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
    { title: "Ambassador Lead", sub: "Recruit + activate champions" },
  ]},
];

const PER = 558; // 18.6s per dept × 5 = 2790f

// Scene 3: Capabilities reel (~93s = 2790 frames)
// Each dept lives in its own Sequence so layout resets per dept.
export const SceneCapabilities: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={DEPTS.length * PER} />
      {DEPTS.map((d, i) => (
        <Sequence key={i} from={i * PER} durationInFrames={PER} layout="none">
          <DeptScene dept={d} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const DeptScene: React.FC<{ dept: Dept }> = ({ dept }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });
  const yTitle = interpolate(sp, [0, 1], [40, 0]);
  const opTitle = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [528, 558], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ flexDirection: "row", padding: "8% 8%", opacity: opOut }}>
      {/* LEFT: dept title */}
      <div style={{ flex: 0.9, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 60 }}>
        <div style={{ opacity: opTitle, transform: `translateY(${yTitle}px)` }}>
          <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 18, letterSpacing: 8, color: "#FFB300", textTransform: "uppercase", marginBottom: 22 }}>
            {dept.tag}
          </div>
          <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 130, color: "#FFFFFF", lineHeight: 0.95, letterSpacing: -3 }}>
            {dept.name}
          </div>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 44, color: "#FFB300", marginTop: 16 }}>
            Department
          </div>
          <div style={{ marginTop: 32 }}><GoldDivider width={220} delay={20} /></div>
          <div style={{ marginTop: 24, fontFamily: inter, fontSize: 22, color: "rgba(255,255,255,0.65)" }}>
            {dept.caps.length} specialist agents · always on
          </div>
        </div>
      </div>

      {/* RIGHT: capability cards (frame-staggered, in flex flow) */}
      <div style={{ flex: 1.1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
        {dept.caps.map((c, i) => (
          <CapCard key={i} idx={i} title={c.title} sub={c.sub} frame={frame - (40 + i * 18)} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CapCard: React.FC<{ idx: number; title: string; sub: string; frame: number }> = ({ idx, title, sub, frame }) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const x = interpolate(sp, [0, 1], [70, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        opacity: op,
        transform: `translateX(${x}px)`,
        background: "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,179,0,0.20)",
        borderLeft: "3px solid #FFB300",
        borderRadius: 12,
        padding: "18px 26px",
        display: "flex",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div
        style={{
          minWidth: 52,
          height: 52,
          borderRadius: 10,
          background: "rgba(255,179,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: playfair,
          fontWeight: 900,
          fontSize: 24,
          color: "#FFB300",
        }}
      >
        {String(idx + 1).padStart(2, "0")}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 28, color: "#FFFFFF", lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 16, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
};
