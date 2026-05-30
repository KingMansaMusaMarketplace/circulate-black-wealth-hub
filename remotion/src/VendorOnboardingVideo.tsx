// 1920x1080 — How a Business Joins 1325.AI in 3 Steps (Vendor Onboarding)
import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Audio, staticFile } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "./components/CinematicBg";
import { KineticTitle } from "./components/KineticTitle";

const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: playfairItalic } = loadPlayfair("italic", { weights: ["400", "700"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "400", "500", "700"], subsets: ["latin"] });

// 90s @ 30fps = 2700 frames
export const VENDOR_ONBOARDING_TOTAL = 2700;

// ============ Shared atoms (high-contrast / readable) ============
const Eyebrow = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 22], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 24, color: "#FFB300", letterSpacing: 8, textTransform: "uppercase", opacity: op, transform: `translateY(${y}px)` }}>{text}</div>;
};

const SubLine = ({ text, delay = 0, size = 28, maxWidth = 900 }: { text: string; delay?: number; size?: number; maxWidth?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 26], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ fontFamily: inter, fontWeight: 400, fontSize: size, color: "rgba(255,255,255,0.95)", lineHeight: 1.5, maxWidth, opacity: op, transform: `translateY(${y}px)` }}>{text}</div>;
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
      <span style={{ fontFamily: inter, fontWeight: 400, fontSize: 18, color: "rgba(255,255,255,0.88)", letterSpacing: 4 }}>OF {String(total).padStart(2, "0")}</span>
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
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.92)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
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
    <div style={{ padding: "12px 22px", borderRadius: 999, border: `1px solid ${active ? "rgba(255,179,0,0.7)" : "rgba(255,255,255,0.18)"}`, background: active ? "rgba(255,179,0,0.12)" : "rgba(255,255,255,0.04)", color: active ? "#FFD66E" : "rgba(255,255,255,0.95)", fontFamily: inter, fontWeight: 500, fontSize: 20, opacity: op, transform: `scale(${scale})`, whiteSpace: "nowrap" }}>
      {label}
    </div>
  );
};

// ============ Scene 1: Hook (0–12s, 360f) ============
const SceneHook = () => {
  const frame = useCurrentFrame();
  const subOp = interpolate(frame, [110, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [220, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "120px 140px", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <Eyebrow text="1325.AI · BUSINESS GUIDE" delay={0} />
        <KineticTitle text="Grow your business." size={130} delay={20} />
        <div style={{ marginTop: -20 }}>
          <KineticTitle text="Reach new customers." size={130} color="#FFB300" italic delay={50} />
        </div>
        <div style={{ marginTop: 30, opacity: subOp, fontFamily: inter, fontWeight: 500, fontSize: 34, color: "rgba(255,255,255,0.95)", textAlign: "center", maxWidth: 1300, lineHeight: 1.4 }}>
          How to list your Black-owned business on 1325.AI —
          <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}> in three simple steps.</span>
        </div>
        <div style={{ marginTop: 28, opacity: ctaOp, fontFamily: inter, fontWeight: 600, fontSize: 18, color: "#FFB300", letterSpacing: 8 }}>
          ────  90 SECOND WALKTHROUGH  ────
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ Scene 2: Why list (12–24s, 360f) ============
const SceneWhy = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: "100px 140px", justifyContent: "center", alignItems: "center", gap: 40 }}>
      <Eyebrow text="WHY LIST YOUR BUSINESS" delay={0} />
      <KineticTitle text="Free listing." size={108} delay={20} />
      <div style={{ marginTop: -20 }}>
        <KineticTitle text="More foot traffic." size={108} color="#FFB300" italic delay={60} />
      </div>
      <div style={{ display: "flex", gap: 60, marginTop: 60 }}>
        {[
          { num: "$0", label: "TO JOIN · 100% FREE", delay: 150 },
          { num: "+38%", label: "AVG. REPEAT VISITS", delay: 200 },
          { num: "24/7", label: "KAYLA AI MANAGES IT", delay: 250 },
        ].map((s) => {
          const op = interpolate(frame - s.delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const y = interpolate(frame - s.delay, [0, 24], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={s.label} style={{ opacity: op, transform: `translateY(${y}px)`, textAlign: "center" }}>
              <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 110, color: "#FFB300", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 18, color: "rgba(255,255,255,0.92)", letterSpacing: 4, marginTop: 12 }}>{s.label}</div>
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
        <KineticTitle text={title} size={88} delay={20} align="left" />
        {italicTitle && (
          <div style={{ marginTop: 6 }}>
            <KineticTitle text={italicTitle} size={88} color="#FFB300" italic delay={50} align="left" />
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

// ============ Scene 3: Step 1 — Claim/List Business (24–40s) ============
const SceneStep1 = () => (
  <StepScene step={1} eyebrow="STEP ONE · 2 MINUTES"
    title="Claim or list" italicTitle="your business."
    description="Visit 1325.ai and create your free business account. Add your name, category, hours, photos, and the discount you want to offer members. Listing is free — forever."
    panel={
      <UIPanel width={640}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 32, color: "#fff", marginBottom: 6 }}>List Your Business</div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 18, color: "rgba(255,255,255,0.85)", marginBottom: 24 }}>Free forever · No contracts.</div>
        <Field label="Business Name" value="Soul Kitchen Chicago" delay={20} />
        <Field label="Category" value="Restaurant · Soul Food" delay={55} />
        <Field label="Member Discount" value="15% off every order" delay={90} />
        <Sequence from={140} layout="none">
          <div style={{ marginTop: 8, padding: "16px 22px", borderRadius: 12, background: "linear-gradient(90deg, #FFB300, #FFD66E)", color: "#001028", fontFamily: inter, fontWeight: 700, fontSize: 20, textAlign: "center", letterSpacing: 2 }}>
            CREATE FREE LISTING  →
          </div>
        </Sequence>
        <Sequence from={195} layout="none">
          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Chip label="✓ No fees" active delay={0} />
            <Chip label="✓ No contracts" active delay={15} />
            <Chip label="✓ Live in minutes" active delay={30} />
          </div>
        </Sequence>
      </UIPanel>
    } />
);

// ============ Scene 4: Step 2 — Generate QR & Tools (40–56s) ============
const QRMock = ({ delay }: { delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 110 } });
  const scale = interpolate(sp, [0, 1], [0.7, 1]);
  const op = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, transform: `scale(${scale})`, width: 200, height: 200, padding: 14, background: "#fff", borderRadius: 14, boxShadow: "0 20px 60px rgba(255,179,0,0.25)", position: "relative", flexShrink: 0 }}>
      <div style={{ width: "100%", height: "100%", background: `
        repeating-linear-gradient(0deg, #001028 0 12px, transparent 12px 24px),
        repeating-linear-gradient(90deg, #001028 0 12px, transparent 12px 24px)
      ` }} />
      {[
        { top: 6, left: 6 }, { top: 6, right: 6 }, { bottom: 6, left: 6 },
      ].map((p, i) => (
        <div key={i} style={{ position: "absolute", ...p, width: 44, height: 44, border: "8px solid #001028", background: "#fff" }} />
      ))}
    </div>
  );
};

const SceneStep2 = () => (
  <StepScene step={2} eyebrow="STEP TWO · INSTANT TOOLS"
    title="Print your QR." italicTitle="Track every scan."
    description="We auto-generate a unique QR code for your storefront and checkout. Print it, place it, done — every scan is tracked, redeemed instantly, and adds the customer to your loyalty list."
    panel={
      <UIPanel width={680}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 6 }}>Your Storefront Toolkit</div>
        <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 16, color: "rgba(255,255,255,0.85)", marginBottom: 24 }}>Auto-generated · Ready to print</div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
          <QRMock delay={20} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 18, color: "#FFD66E", letterSpacing: 2 }}>SOUL KITCHEN · CHICAGO</div>
            <Sequence from={60} layout="none">
              <Chip label="⬇ Print-ready PDF" active delay={0} />
            </Sequence>
            <Sequence from={90} layout="none">
              <Chip label="⬇ Window decal" active delay={0} />
            </Sequence>
            <Sequence from={120} layout="none">
              <Chip label="⬇ Receipt sticker" active delay={0} />
            </Sequence>
          </div>
        </div>

        <Sequence from={160} layout="none">
          <div style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.92)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Live scans today</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontFamily: playfair, fontWeight: 700, fontSize: 50, color: "#FFB300" }}>42</span>
              <span style={{ fontFamily: inter, fontWeight: 600, fontSize: 18, color: "#7ec1ff" }}>+18 new customers</span>
            </div>
          </div>
        </Sequence>
      </UIPanel>
    } />
);

// ============ Scene 5: Step 3 — Get Customers / Kayla (56–74s) ============
const SceneStep3 = () => {
  const frame = useCurrentFrame();
  const customerOp = interpolate(frame, [120, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const customerY = interpolate(frame, [120, 160], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const salesOp = interpolate(frame, [200, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const salesY = interpolate(frame, [200, 240], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const monthOp = interpolate(frame, [320, 380], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <StepScene step={3} eyebrow="STEP THREE · GROW ON AUTOPILOT"
      title="Customers arrive." italicTitle="Kayla handles the rest."
      description="Members find you in the directory and walk in. Kayla — your AI employee — manages bookings, replies to reviews, posts updates, and shows you exactly what's working. You focus on serving customers."
      panel={
        <UIPanel width={640}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 6 }}>Today's Activity</div>
          <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 16, color: "rgba(255,255,255,0.85)", marginBottom: 22 }}>Managed by Kayla AI</div>

          {/* New customer */}
          <div style={{ opacity: customerOp, transform: `translateY(${customerY}px)`, padding: "16px 18px", borderRadius: 12, background: "rgba(255,179,0,0.10)", border: "1px solid rgba(255,179,0,0.45)", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 18, color: "#fff" }}>New customer scan</div>
              <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 14, color: "rgba(255,255,255,0.78)" }}>Joined your loyalty list</div>
            </div>
            <span style={{ fontFamily: playfair, fontWeight: 700, fontSize: 28, color: "#FFD66E" }}>+18</span>
          </div>

          {/* Sales */}
          <div style={{ opacity: salesOp, transform: `translateY(${salesY}px)`, padding: "16px 18px", borderRadius: 12, background: "rgba(0,116,217,0.14)", border: "1px solid rgba(0,116,217,0.50)", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 18, color: "#fff" }}>Discount sales</div>
              <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 14, color: "rgba(255,255,255,0.78)" }}>42 orders today</div>
            </div>
            <span style={{ fontFamily: playfair, fontWeight: 700, fontSize: 28, color: "#7ec1ff" }}>$1,284</span>
          </div>

          {/* Monthly */}
          <div style={{ opacity: monthOp, marginTop: 18, padding: "16px 18px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.18)", textAlign: "center" }}>
            <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.92)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>This month</div>
            <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 44, color: "#FFB300" }}>$28,460 in revenue</div>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 16, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>from 1325.AI members</div>
          </div>
        </UIPanel>
      } />
  );
};

// ============ Scene 6: Closing CTA (74–90s) ============
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const sumOp = interpolate(frame, [100, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [240, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const urlOp = interpolate(frame, [320, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "100px 140px", justifyContent: "center", alignItems: "center", gap: 30 }}>
      <Eyebrow text="THAT'S IT · THREE STEPS" delay={0} />
      <KineticTitle text="List. Print. Grow." size={108} delay={20} />
      <div style={{ marginTop: -10 }}>
        <KineticTitle text="It's that simple." size={96} color="#FFB300" italic delay={60} />
      </div>

      <div style={{ opacity: sumOp, display: "flex", gap: 40, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { n: "01", t: "Claim Your Listing" },
          { n: "02", t: "Print Your QR" },
          { n: "03", t: "Grow With Kayla" },
        ].map((s) => (
          <div key={s.n} style={{ padding: "20px 28px", borderRadius: 16, border: "1px solid rgba(255,179,0,0.4)", background: "rgba(255,179,0,0.06)", textAlign: "center", minWidth: 260 }}>
            <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 48, color: "#FFB300" }}>{s.n}</div>
            <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,0.95)", letterSpacing: 2, marginTop: 4 }}>{s.t}</div>
          </div>
        ))}
      </div>

      <div style={{ opacity: ctaOp, marginTop: 36, fontFamily: playfair, fontWeight: 700, fontSize: 50, color: "#fff", textAlign: "center" }}>
        List your business today —{" "}
        <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}>join the movement.</span>
      </div>

      <div style={{ opacity: urlOp, marginTop: 30, padding: "18px 40px", borderRadius: 999, border: "1px solid rgba(255,179,0,0.6)", background: "rgba(255,179,0,0.08)", fontFamily: inter, fontWeight: 600, fontSize: 24, color: "#FFB300", letterSpacing: 6 }}>
        1325.AI / BUSINESS-SIGNUP
      </div>
    </AbsoluteFill>
  );
};

// ============ Title stamp ============
const TitleStamp = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 45, 65], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ background: "rgba(0,8,20,0.78)", opacity: op, alignItems: "center", justifyContent: "center", padding: 80 }}>
      <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 26, color: "#FFB300", letterSpacing: 12, textTransform: "uppercase", marginBottom: 32 }}>
        1325.AI • Business Guide
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 130, color: "#FFFFFF", textAlign: "center", lineHeight: 1.05, letterSpacing: -2, maxWidth: 1700 }}>
        List Your Business in <span style={{ fontStyle: "italic", color: "#FFD66E", fontFamily: playfairItalic }}>3 Steps</span>
      </div>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 30, color: "rgba(255,255,255,0.85)", marginTop: 32, letterSpacing: 2 }}>
        A 90-second walkthrough for business owners
      </div>
    </AbsoluteFill>
  );
};

// ============ Root composition ============
export const VendorOnboardingVideo = () => (
  <AbsoluteFill style={{ background: "#000814" }}>
    <Audio src={staticFile("audio/vo-vendor-onboarding.mp3")} volume={1} />
    <CinematicBg totalFrames={VENDOR_ONBOARDING_TOTAL} />
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
