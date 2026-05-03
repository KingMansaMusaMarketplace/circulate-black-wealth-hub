import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../../components/CinematicBg";
import { GoldDivider } from "../../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const ROLES = [
  { title: "Bookkeeper", cost: 3200 },
  { title: "Marketer", cost: 3800 },
  { title: "Sales Dev Rep", cost: 2600 },
  { title: "Ops Coordinator", cost: 2500 },
];

export const SceneROIV: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={durationInFrames} />
      <AbsoluteFill style={{ padding: "100px 6% 60px 6%", flexDirection: "column" }}>
        <Header frame={frame} />
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 12 }}>
          {ROLES.map((r, i) => (
            <RoleCard key={i} title={r.title} cost={r.cost} frame={frame - (40 + i * 28)} />
          ))}
        </div>
        <SavingsBadge frame={frame - 200} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Header: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, textAlign: "center" }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 10, color: "#FFB300", textTransform: "uppercase", marginBottom: 16 }}>
        ─── The Honest Math
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 110, color: "#FFFFFF", lineHeight: 1, letterSpacing: -3 }}>
        ~4 Roles
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 56, color: "#FFB300", marginTop: 6 }}>
        Covered.
      </div>
      <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}><GoldDivider width={220} delay={20} /></div>
    </div>
  );
};

const RoleCard: React.FC<{ title: string; cost: number; frame: number }> = ({ title, cost, frame }) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const x = interpolate(sp, [0, 1], [70, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div style={{ opacity: op, transform: `translateX(${x}px)`, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderLeft: "4px solid #FFB300", borderRadius: 12, padding: "26px 30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 44, color: "#FFFFFF" }}>{title}</div>
      <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 36, color: "#FFB300" }}>
        ${cost.toLocaleString()}<span style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", marginLeft: 4 }}>/mo</span>
      </div>
    </div>
  );
};

const SavingsBadge: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const scale = interpolate(sp, [0, 1], [0.7, 1]);
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const num = Math.round(interpolate(frame, [0, 70], [0, 12100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
  const pulse = 1 + Math.sin(frame * 0.05) * 0.012;
  return (
    <div style={{ marginTop: 50, opacity: op, transform: `scale(${scale * pulse})`, textAlign: "center", padding: "44px 30px", border: "2px solid #FFB300", borderRadius: 24, background: "linear-gradient(160deg, rgba(255,179,0,0.18), rgba(255,179,0,0.04))", boxShadow: "0 30px 80px rgba(255,179,0,0.22)" }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, letterSpacing: 10, color: "#FFB300", textTransform: "uppercase", marginBottom: 12 }}>
        You Save
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 200, color: "#FFFFFF", lineHeight: 0.95, letterSpacing: -8 }}>
        ${num.toLocaleString()}<span style={{ fontSize: 60, color: "#FFB300" }}>+</span>
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 44, color: "#FFB300", marginTop: 6 }}>
        every month.
      </div>
    </div>
  );
};
