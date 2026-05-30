// 1920x1080 — How to Save at a Black-Owned Business in 3 Steps (1325.AI)
import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "./components/CinematicBg";
import { KineticTitle } from "./components/KineticTitle";

const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: playfairItalic } = loadPlayfair("italic", { weights: ["400", "700"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "400", "500", "700"], subsets: ["latin"] });

// 90s @ 30fps = 2700 frames
export const CUSTOMER_FLOW_TOTAL = 2700;

// ============ Shared atoms ============
const Eyebrow = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 22], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, color: "#FFB300", letterSpacing: 10, textTransform: "uppercase", opacity: op, transform: `translateY(${y}px)` }}>{text}</div>;
};

const SubLine = ({ text, delay = 0, size = 28, maxWidth = 900 }: { text: string; delay?: number; size?: number; maxWidth?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 26], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ fontFamily: inter, fontWeight: 300, fontSize: size, color: "rgba(255,255,255,0.82)", lineHeight: 1.45, maxWidth, opacity: op, transform: `translateY(${y}px)` }}>{text}</div>;
};

const StepBadge = ({ step, total = 3, delay = 0 }: { step: number; total?: number; delay?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 110 } });
  const scale = interpolate(sp, [0, 1], [0.6, 1]);
  const op = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "12px 26px", border: "1px solid rgba(255,179,0,0.55)", borderRadius: 999, background: "rgba(255,179,0,0.06)", opacity: op, transform: `scale(${scale})` }}>
      <span style={{ fontFamily: inter, fontWeight: 700, fontSize: 18, color: "#FFB300", letterSpacing: 4 }}>STEP {String(step).padStart(2, "0")}</span>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: "#FFB300" }} />
      <span style={{ fontFamily: inter, fontWeight: 400, fontSize: 18, color: "rgba(255,255,255,0.7)", letterSpacing: 4 }}>OF {String(total).padStart(2, "0")}</span>
    </div>
  );
};

const UIPanel = ({ children, delay = 0, width = 680 }: { children: React.ReactNode; delay?: number; width?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 90 } });
  const y = interpolate(sp, [0, 1], [60, 0]);
  const op = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ width, padding: 36, borderRadius: 22, background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 30px 80px rgba(0,0,0,0.45)", opacity: op, transform: `translateY(${y}px)` }}>
      {children}
    </div>
  );
};

const Field = ({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const fillWidth = interpolate(frame - delay, [0, 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showVal = interpolate(frame - delay, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ position: "relative", padding: "14px 18px", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, minHeight: 26 }}>
        <span style={{ fontFamily: inter, fontWeight: 400, fontSize: 22, color: "#fff", opacity: showVal }}>{value}</span>
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 2, width: `${fillWidth}%`, background: "linear-gradient(90deg, #FFB300, #FFD66E)", borderRadius: 2 }} />
      </div>
    </div>
  );
};

const Chip = ({ label, delay = 0, active = false }: { label: string; delay?: number; active?: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 140 } });
  const scale = interpolate(sp, [0, 1], [0.7, 1]);
  const op = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ padding: "12px 22px", borderRadius: 999, border: `1px solid ${active ? "rgba(255,179,0,0.7)" : "rgba(255,255,255,0.18)"}`, background: active ? "rgba(255,179,0,0.12)" : "rgba(255,255,255,0.04)", color: active ? "#FFD66E" : "rgba(255,255,255,0.85)", fontFamily: inter, fontWeight: 500, fontSize: 20, opacity: op, transform: `scale(${scale})`, whiteSpace: "nowrap" }}>
      {label}
    </div>
  );
};

// ============ Scene 1: Title / Hook (0–12s, 360f) ============
const SceneHook = () => {
  const frame = useCurrentFrame();
  const subOp = interpolate(frame, [110, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [220, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "120px 140px", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <Eyebrow text="1325.AI · CUSTOMER GUIDE" delay={0} />
        <KineticTitle text="Save money." size={140} delay={20} />
        <div style={{ marginTop: -30 }}>
          <KineticTitle text="Build community wealth." size={140} color="#FFB300" italic delay={50} />
        </div>
        <div style={{ marginTop: 30, opacity: subOp, fontFamily: inter, fontWeight: 300, fontSize: 34, color: "rgba(255,255,255,0.78)", textAlign: "center", maxWidth: 1300, lineHeight: 1.4 }}>
          How to save 5–30% at Black-owned businesses near you —
          <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}> in three simple steps.</span>
        </div>
        <div style={{ marginTop: 28, opacity: ctaOp, fontFamily: inter, fontWeight: 500, fontSize: 18, color: "#FFB300", letterSpacing: 8 }}>
          ────  90 SECOND WALKTHROUGH  ────
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ Scene 2: Why it matters (12–24s, 360f) ============
const SceneWhy = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: "100px 140px", justifyContent: "center", alignItems: "center", gap: 40 }}>
      <Eyebrow text="EVERY DOLLAR COUNTS" delay={0} />
      <KineticTitle text="Shop Black-owned." size={108} delay={20} />
      <div style={{ marginTop: -20 }}>
        <KineticTitle text="Get instant discounts." size={108} color="#FFB300" italic delay={60} />
      </div>
      <div style={{ display: "flex", gap: 60, marginTop: 60 }}>
        {[
          { num: "5–30%", label: "OFF EVERY PURCHASE", delay: 150 },
          { num: "$0", label: "TO JOIN · 100% FREE", delay: 200 },
          { num: "6–9×", label: "DOLLARS CIRCULATE", delay: 250 },
        ].map((s) => {
          const op = interpolate(frame - s.delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const y = interpolate(frame - s.delay, [0, 24], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={s.label} style={{ opacity: op, transform: `translateY(${y}px)`, textAlign: "center" }}>
              <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 110, color: "#FFB300", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 18, color: "rgba(255,255,255,0.7)", letterSpacing: 4, marginTop: 12 }}>{s.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============ Step layout ============
const StepScene = ({ step, eyebrow, title, italicTitle, description, panel }: {
  step: number; eyebrow: string; title: string; italicTitle?: string; description: string; panel: React.ReactNode;
}) => (
  <AbsoluteFill style={{ padding: "100px 140px", display: "flex", flexDirection: "row", alignItems: "center", gap: 90 }}>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
      <StepBadge step={step} />
      <div style={{ marginTop: 4 }}><Eyebrow text={eyebrow} delay={10} /></div>
      <div style={{ marginTop: 6 }}>
        <KineticTitle text={title} size={92} delay={20} align="left" />
        {italicTitle && (
          <div style={{ marginTop: 6 }}>
            <KineticTitle text={italicTitle} size={92} color="#FFB300" italic delay={50} align="left" />
          </div>
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        <SubLine text={description} delay={90} size={26} maxWidth={760} />
      </div>
    </div>
    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
      <Sequence from={70} layout="none">{panel}</Sequence>
    </div>
  </AbsoluteFill>
);

// ============ Scene 3: Step 1 — Sign Up (24–40s, 480f) ============
const SceneStep1 = () => (
  <StepScene step={1} eyebrow="STEP ONE · 30 SECONDS"
    title="Sign up —" italicTitle="it's free."
    description="Visit 1325.ai and create your free account. No credit card. No subscription. Full access to the directory in 30 seconds."
    panel={
      <UIPanel width={620}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 6 }}>Join 1325.AI</div>
        <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 18, color: "rgba(255,255,255,0.6)", marginBottom: 28 }}>Free forever — community first.</div>
        <Field label="Email" value="you@example.com" delay={20} />
        <Field label="Password" value="••••••••••" delay={60} />
        <Sequence from={110} layout="none">
          <div style={{ marginTop: 8, padding: "16px 22px", borderRadius: 12, background: "linear-gradient(90deg, #FFB300, #FFD66E)", color: "#001028", fontFamily: inter, fontWeight: 700, fontSize: 20, textAlign: "center", letterSpacing: 2 }}>
            CREATE FREE ACCOUNT  →
          </div>
        </Sequence>
        <Sequence from={170} layout="none">
          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Chip label="✓ No credit card" active delay={0} />
            <Chip label="✓ Free forever" active delay={15} />
            <Chip label="✓ 30 seconds" active delay={30} />
          </div>
        </Sequence>
      </UIPanel>
    } />
);

// ============ Scene 4: Step 2 — Discover (40–56s, 480f) ============
const DirectoryCard = ({ delay, name, category, distance, discount }: { delay: number; name: string; category: string; distance: string; discount: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 110 } });
  const y = interpolate(sp, [0, 1], [40, 0]);
  const op = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, transform: `translateY(${y}px)`, padding: "18px 20px", borderRadius: 14, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 56, height: 56, borderRadius: 12, background: "linear-gradient(135deg, #003366, #FFB300)", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 22, color: "#fff" }}>{name}</div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 14, color: "rgba(255,255,255,0.6)", letterSpacing: 1 }}>{category} · {distance}</div>
      </div>
      <div style={{ padding: "8px 14px", borderRadius: 999, background: "rgba(255,179,0,0.15)", border: "1px solid rgba(255,179,0,0.5)", fontFamily: inter, fontWeight: 700, fontSize: 16, color: "#FFD66E", letterSpacing: 1 }}>{discount}</div>
    </div>
  );
};

const SceneStep2 = () => (
  <StepScene step={2} eyebrow="STEP TWO · FIND THEM"
    title="Discover" italicTitle="businesses near you."
    description="Search by category, neighborhood or distance. Filter by food, beauty, retail and more. See ratings, hours and the exact discount waiting for you."
    panel={
      <UIPanel width={680}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 6 }}>Directory · Chicago</div>
        <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 22 }}>247 businesses within 5 miles</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
          <Chip label="All" active delay={10} />
          <Chip label="Food" delay={20} />
          <Chip label="Beauty" delay={30} />
          <Chip label="Retail" delay={40} />
          <Chip label="Services" delay={50} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <DirectoryCard delay={80} name="Soul Kitchen" category="Restaurant" distance="0.4 mi" discount="−15%" />
          <DirectoryCard delay={115} name="Crown Cuts" category="Barbershop" distance="0.9 mi" discount="−10%" />
          <DirectoryCard delay={150} name="Heritage Books" category="Retail" distance="1.2 mi" discount="−20%" />
          <DirectoryCard delay={185} name="Glow Spa" category="Beauty" distance="2.1 mi" discount="−25%" />
        </div>
      </UIPanel>
    } />
);

// ============ Scene 5: Step 3 — Scan & Save (56–74s, 540f) ============
const SceneStep3 = () => {
  const frame = useCurrentFrame();
  // Panel appears at ~70, then internal animation
  // Scan ring 100-180, discount popup 200-240, points popup 280-320, total reveal 360+
  const ringScale = interpolate(frame, [100, 180], [0.4, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringOp = interpolate(frame, [100, 160, 200], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const discountOp = interpolate(frame, [200, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const discountY = interpolate(frame, [200, 240], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pointsOp = interpolate(frame, [280, 320], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pointsY = interpolate(frame, [280, 320], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const savedOp = interpolate(frame, [360, 400], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <StepScene step={3} eyebrow="STEP THREE · AT CHECKOUT"
      title="Scan the QR." italicTitle="Save instantly."
      description="Visit a business and scan the QR code at checkout with the 1325.AI app. Your discount applies on the spot — and you earn loyalty points every time."
      panel={
        <UIPanel width={620}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 6 }}>Soul Kitchen</div>
          <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 22 }}>Scan to apply your discount</div>

          {/* QR code mock */}
          <div style={{ position: "relative", aspectRatio: "1/1", maxWidth: 280, margin: "0 auto 22px", padding: 18, borderRadius: 18, background: "#fff", boxShadow: "0 20px 60px rgba(255,179,0,0.25)" }}>
            <div style={{ width: "100%", height: "100%", background: `
              repeating-linear-gradient(0deg, #001028 0 14px, transparent 14px 28px),
              repeating-linear-gradient(90deg, #001028 0 14px, transparent 14px 28px)
            ` }} />
            {/* corner squares */}
            {[
              { top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 },
            ].map((p, i) => (
              <div key={i} style={{ position: "absolute", ...p, width: 56, height: 56, border: "10px solid #001028", background: "#fff" }} />
            ))}
            {/* scanning ring */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ width: 240, height: 240, borderRadius: "50%", border: "3px solid #FFB300", opacity: ringOp, transform: `scale(${ringScale})`, boxShadow: "0 0 40px rgba(255,179,0,0.6)" }} />
            </div>
          </div>

          {/* Discount popup */}
          <div style={{ opacity: discountOp, transform: `translateY(${discountY}px)`, padding: "14px 18px", borderRadius: 12, background: "linear-gradient(90deg, rgba(255,179,0,0.18), rgba(255,179,0,0.06))", border: "1px solid rgba(255,179,0,0.55)", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: inter, fontWeight: 500, fontSize: 18, color: "rgba(255,255,255,0.85)" }}>Discount applied</span>
            <span style={{ fontFamily: playfair, fontWeight: 700, fontSize: 28, color: "#FFD66E" }}>−15%</span>
          </div>

          {/* Points popup */}
          <div style={{ opacity: pointsOp, transform: `translateY(${pointsY}px)`, padding: "14px 18px", borderRadius: 12, background: "rgba(0,116,217,0.18)", border: "1px solid rgba(0,116,217,0.55)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: inter, fontWeight: 500, fontSize: 18, color: "rgba(255,255,255,0.85)" }}>Loyalty points earned</span>
            <span style={{ fontFamily: playfair, fontWeight: 700, fontSize: 28, color: "#7ec1ff" }}>+25 pts</span>
          </div>

          {/* You saved */}
          <div style={{ opacity: savedOp, marginTop: 20, padding: "16px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)", textAlign: "center" }}>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.55)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>You saved today</div>
            <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 44, color: "#FFB300" }}>$7.50</div>
          </div>
        </UIPanel>
      } />
  );
};

// ============ Scene 6: Closing CTA (74–90s, 480f) ============
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const sumOp = interpolate(frame, [100, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [240, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const urlOp = interpolate(frame, [320, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "100px 140px", justifyContent: "center", alignItems: "center", gap: 30 }}>
      <Eyebrow text="THAT'S IT · THREE STEPS" delay={0} />
      <KineticTitle text="Sign up. Discover." size={96} delay={20} />
      <div style={{ marginTop: -10 }}>
        <KineticTitle text="Scan & save." size={96} color="#FFB300" italic delay={60} />
      </div>

      <div style={{ opacity: sumOp, display: "flex", gap: 40, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { n: "01", t: "Sign Up Free" },
          { n: "02", t: "Discover Businesses" },
          { n: "03", t: "Scan & Save" },
        ].map((s) => (
          <div key={s.n} style={{ padding: "20px 28px", borderRadius: 16, border: "1px solid rgba(255,179,0,0.4)", background: "rgba(255,179,0,0.06)", textAlign: "center", minWidth: 240 }}>
            <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 48, color: "#FFB300" }}>{s.n}</div>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 20, color: "rgba(255,255,255,0.85)", letterSpacing: 2, marginTop: 4 }}>{s.t}</div>
          </div>
        ))}
      </div>

      <div style={{ opacity: ctaOp, marginTop: 36, fontFamily: playfair, fontWeight: 700, fontSize: 50, color: "#fff", textAlign: "center" }}>
        Start saving today —{" "}
        <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}>support your community.</span>
      </div>

      <div style={{ opacity: urlOp, marginTop: 30, padding: "18px 40px", borderRadius: 999, border: "1px solid rgba(255,179,0,0.6)", background: "rgba(255,179,0,0.08)", fontFamily: inter, fontWeight: 600, fontSize: 24, color: "#FFB300", letterSpacing: 6 }}>
        1325.AI
      </div>
    </AbsoluteFill>
  );
};

// ============ Title stamp overlay ============
const TitleStamp = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 45, 65], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ background: "rgba(0,8,20,0.78)", opacity: op, alignItems: "center", justifyContent: "center", padding: 80 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 26, color: "#FFB300", letterSpacing: 12, textTransform: "uppercase", marginBottom: 32 }}>
        1325.AI • Customer Guide
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 130, color: "#FFFFFF", textAlign: "center", lineHeight: 1.05, letterSpacing: -2, maxWidth: 1600 }}>
        How to Save in <span style={{ fontStyle: "italic", color: "#FFD66E", fontFamily: playfairItalic }}>3 Steps</span>
      </div>
      <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 30, color: "rgba(255,255,255,0.75)", marginTop: 32, letterSpacing: 2 }}>
        A 90-second walkthrough for new members
      </div>
    </AbsoluteFill>
  );
};

// ============ Root composition ============
export const CustomerFlowVideo = () => (
  <AbsoluteFill style={{ background: "#000814" }}>
    <CinematicBg totalFrames={CUSTOMER_FLOW_TOTAL} />
    <Series>
      <Series.Sequence durationInFrames={360}><SceneHook /></Series.Sequence>
      <Series.Sequence durationInFrames={360}><SceneWhy /></Series.Sequence>
      <Series.Sequence durationInFrames={480}><SceneStep1 /></Series.Sequence>
      <Series.Sequence durationInFrames={480}><SceneStep2 /></Series.Sequence>
      <Series.Sequence durationInFrames={540}><SceneStep3 /></Series.Sequence>
      <Series.Sequence durationInFrames={480}><SceneCTA /></Series.Sequence>
    </Series>
    <Sequence from={0} durationInFrames={70} layout="none"><TitleStamp /></Sequence>
  </AbsoluteFill>
);
