import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "../components/CinematicBg";
import { GoldDivider } from "../components/GoldDivider";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

// Scene 6: ROI / $12,100 savings (~30s = 900 frames)
const ROLES = [
  { title: "Bookkeeper", cost: 3200 },
  { title: "Marketer", cost: 3800 },
  { title: "Sales Dev Rep", cost: 2600 },
  { title: "Ops Coordinator", cost: 2500 },
];

export const SceneROI: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <CinematicBg totalFrames={900} />
      <AbsoluteFill style={{ flexDirection: "row", padding: "8% 8%" }}>
        {/* LEFT: roles list */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
          <Sequence from={0} durationInFrames={900}>
            <RolesHeader />
          </Sequence>
          {ROLES.map((r, i) => (
            <Sequence key={i} from={60 + i * 50} durationInFrames={900}>
              <RoleCard title={r.title} cost={r.cost} />
            </Sequence>
          ))}
          <Sequence from={60 + ROLES.length * 50 + 30} durationInFrames={900}>
            <SubtotalLine />
          </Sequence>
        </div>
        {/* RIGHT: big savings number */}
        <div style={{ flex: 1.05, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingLeft: 60 }}>
          <Sequence from={380} durationInFrames={900}>
            <SavingsBadge />
          </Sequence>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const RolesHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, marginBottom: 8 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 18, letterSpacing: 8, color: "#FFB300", textTransform: "uppercase", marginBottom: 16 }}>
        ─── The Honest Math
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 78, color: "#FFFFFF", lineHeight: 1, letterSpacing: -2 }}>
        ~4 Roles
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 44, color: "#FFB300", marginTop: 4 }}>
        Covered by Kayla.
      </div>
      <GoldDivider width={180} delay={20} />
    </div>
  );
};

const RoleCard: React.FC<{ title: string; cost: number }> = ({ title, cost }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const x = interpolate(sp, [0, 1], [60, 0]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        opacity: op,
        transform: `translateX(${x}px)`,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderLeft: "3px solid #FFB300",
        borderRadius: 10,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 28, color: "#FFFFFF" }}>{title}</div>
      <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 24, color: "#FFB300" }}>
        ${cost.toLocaleString()}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>/mo</span>
      </div>
    </div>
  );
};

const SubtotalLine: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 18, letterSpacing: 4, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
        Total Payroll Replaced
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 38, color: "#FFFFFF" }}>$12,100<span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>/mo</span></div>
    </div>
  );
};

const SavingsBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const scale = interpolate(sp, [0, 1], [0.7, 1]);
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const num = Math.round(interpolate(frame, [0, 70], [0, 12100], { extrapolateRight: "clamp" }));
  const pulse = 1 + Math.sin(frame * 0.05) * 0.012;
  return (
    <div
      style={{
        opacity: op,
        transform: `scale(${scale * pulse})`,
        textAlign: "center",
        padding: "60px 70px",
        border: "2px solid #FFB300",
        borderRadius: 28,
        background: "linear-gradient(160deg, rgba(255,179,0,0.18), rgba(255,179,0,0.04))",
        boxShadow: "0 40px 100px rgba(255,179,0,0.25)",
      }}
    >
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 18, letterSpacing: 10, color: "#FFB300", textTransform: "uppercase", marginBottom: 12 }}>
        You Save
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 200, color: "#FFFFFF", lineHeight: 0.95, letterSpacing: -6 }}>
        ${num.toLocaleString()}<span style={{ fontSize: 60, color: "#FFB300" }}>+</span>
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 38, color: "#FFB300", marginTop: 4 }}>
        every month.
      </div>
      <div style={{ marginTop: 18, fontFamily: inter, fontSize: 18, color: "rgba(255,255,255,0.7)" }}>
        Same output · Around the clock · Fraction of the cost
      </div>
    </div>
  );
};
