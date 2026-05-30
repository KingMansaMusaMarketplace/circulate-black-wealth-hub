// 1080x1920 Vertical version for Instagram Reels / TikTok.
// Reuses the same Mansa Stays brand language, restructured for portrait.
import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, Audio, staticFile } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "./components/CinematicBg";
import { KineticTitle } from "./components/KineticTitle";

const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: playfairItalic } = loadPlayfair("italic", { weights: ["400", "700"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "400", "500", "700"], subsets: ["latin"] });

export const MANSA_STAYS_V_TOTAL = 3600; // 120s @ 30fps
const SCENE_LEN = 450;

// ---------- Shared bits (portrait-tuned sizes) ----------
const Eyebrow = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 22], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 26, color: "#FFB300", letterSpacing: 10, textTransform: "uppercase", opacity: op, transform: `translateY(${y}px)`, textAlign: "center" }}>
      {text}
    </div>
  );
};

const SubLine = ({ text, delay = 0, size = 34, color = "rgba(255,255,255,0.82)", maxWidth = 900 }: { text: string; delay?: number; size?: number; color?: string; maxWidth?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 26], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ fontFamily: inter, fontWeight: 300, fontSize: size, color, lineHeight: 1.45, maxWidth, opacity: op, transform: `translateY(${y}px)`, textAlign: "center" }}>
      {text}
    </div>
  );
};

const StepBadge = ({ step, total = 7, delay = 0 }: { step: number; total?: number; delay?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 110 } });
  const scale = interpolate(sp, [0, 1], [0.6, 1]);
  const op = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "14px 32px", border: "1px solid rgba(255,179,0,0.55)", borderRadius: 999, background: "rgba(255,179,0,0.06)", opacity: op, transform: `scale(${scale})` }}>
      <span style={{ fontFamily: inter, fontWeight: 700, fontSize: 22, color: "#FFB300", letterSpacing: 5 }}>STEP {String(step).padStart(2, "0")}</span>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: "#FFB300" }} />
      <span style={{ fontFamily: inter, fontWeight: 400, fontSize: 22, color: "rgba(255,255,255,0.7)", letterSpacing: 5 }}>OF {String(total).padStart(2, "0")}</span>
    </div>
  );
};

const UIPanel = ({ children, delay = 0, width = 880 }: { children: React.ReactNode; delay?: number; width?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 90 } });
  const y = interpolate(sp, [0, 1], [60, 0]);
  const op = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ width, padding: 44, borderRadius: 26, background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 30px 80px rgba(0,0,0,0.45)", opacity: op, transform: `translateY(${y}px)` }}>
      {children}
    </div>
  );
};

const Field = ({ label, value, delay = 0, filled = true }: { label: string; value: string; delay?: number; filled?: boolean }) => {
  const frame = useCurrentFrame();
  const fillWidth = interpolate(frame - delay, [0, 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showVal = interpolate(frame - delay, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 16, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ position: "relative", padding: "18px 22px", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, minHeight: 30 }}>
        <span style={{ fontFamily: inter, fontWeight: 400, fontSize: 26, color: "#fff", opacity: showVal }}>{value}</span>
        {filled && (
          <div style={{ position: "absolute", left: 0, bottom: 0, height: 2, width: `${fillWidth}%`, background: "linear-gradient(90deg, #FFB300, #FFD66E)", borderRadius: 2 }} />
        )}
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
    <div style={{ padding: "14px 26px", borderRadius: 999, border: `1px solid ${active ? "rgba(255,179,0,0.7)" : "rgba(255,255,255,0.18)"}`, background: active ? "rgba(255,179,0,0.12)" : "rgba(255,255,255,0.04)", color: active ? "#FFD66E" : "rgba(255,255,255,0.85)", fontFamily: inter, fontWeight: 500, fontSize: 24, opacity: op, transform: `scale(${scale})`, whiteSpace: "nowrap" }}>
      {label}
    </div>
  );
};

const DelayedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <span style={{ opacity: op }}>{text}</span>;
};

const PhotoTile = ({ index, delay = 0 }: { index: number; delay?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 130 } });
  const scale = interpolate(sp, [0, 1], [0.7, 1]);
  const op = interpolate(frame - delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hues = ["#003366", "#0a4a7a", "#FFB300", "#1a5a8a", "#c8951a", "#0a3a6a", "#FFD66E", "#0a2a4a", "#b8821a"];
  return <div style={{ aspectRatio: "4/3", borderRadius: 12, background: `linear-gradient(135deg, ${hues[index]}, rgba(0,8,20,0.6))`, border: "1px solid rgba(255,255,255,0.1)", opacity: op, transform: `scale(${scale})` }} />;
};

// ---------- Vertical layout shell ----------
const VShell = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill style={{ padding: "120px 80px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40 }}>
    {children}
  </AbsoluteFill>
);

const VStepScene = ({ step, eyebrow, title, italicTitle, description, panel }: {
  step: number; eyebrow: string; title: string; italicTitle?: string; description: string; panel: React.ReactNode;
}) => (
  <AbsoluteFill style={{ padding: "100px 80px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: 24, paddingTop: 140 }}>
    <StepBadge step={step} />
    <Eyebrow text={eyebrow} delay={10} />
    <div style={{ marginTop: 8, textAlign: "center" }}>
      <KineticTitle text={title} size={92} delay={20} />
      {italicTitle && (
        <div style={{ marginTop: 6 }}>
          <KineticTitle text={italicTitle} size={92} color="#FFB300" italic delay={50} />
        </div>
      )}
    </div>
    <div style={{ marginTop: 8 }}>
      <SubLine text={description} delay={90} size={28} maxWidth={880} />
    </div>
    <div style={{ marginTop: 24, display: "flex", justifyContent: "center", width: "100%" }}>
      <Sequence from={70} layout="none">{panel}</Sequence>
    </div>
  </AbsoluteFill>
);

// ---------- Scene 1: Hook ----------
const SceneHook = () => {
  const frame = useCurrentFrame();
  const subOp = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [240, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <VShell>
      <Eyebrow text="MANSA STAYS · HOST GUIDE" delay={0} />
      <KineticTitle text="Your Property." size={130} delay={20} />
      <div style={{ marginTop: -20 }}>
        <KineticTitle text="Your Story." size={130} color="#FFB300" italic delay={50} />
      </div>
      <div style={{ marginTop: 30, opacity: subOp, fontFamily: inter, fontWeight: 300, fontSize: 36, color: "rgba(255,255,255,0.78)", textAlign: "center", maxWidth: 900, lineHeight: 1.4 }}>
        A two-minute walkthrough on how to list your home on Mansa Stays —
        <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}> and welcome the world in.</span>
      </div>
      <div style={{ marginTop: 28, opacity: ctaOp, fontFamily: inter, fontWeight: 500, fontSize: 22, color: "#FFB300", letterSpacing: 8 }}>
        ────  7 SIMPLE STEPS  ────
      </div>
    </VShell>
  );
};

const Scene2 = () => (
  <VStepScene step={1} eyebrow="GET STARTED" title="Sign in to" italicTitle="Mansa Stays."
    description="Visit mansamusamarketplace.com/stays and click List Your Property."
    panel={
      <UIPanel width={820}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 40, color: "#fff", marginBottom: 8 }}>Welcome, Host</div>
        <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 22, color: "rgba(255,255,255,0.6)", marginBottom: 30 }}>Sign in to begin your listing</div>
        <Field label="Email" value="susan@yourdomain.com" delay={20} />
        <Field label="Password" value="••••••••••" delay={60} />
        <Sequence from={120} layout="none">
          <div style={{ marginTop: 10, padding: "18px 24px", borderRadius: 14, background: "linear-gradient(90deg, #FFB300, #FFD66E)", color: "#001028", fontFamily: inter, fontWeight: 700, fontSize: 24, textAlign: "center", letterSpacing: 2 }}>
            CONTINUE  →
          </div>
        </Sequence>
      </UIPanel>
    } />
);

const Scene3 = () => (
  <VStepScene step={2} eyebrow="THE BASICS" title="Name your" italicTitle="space."
    description="Give your listing a title that sells the dream."
    panel={
      <UIPanel width={820}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 24 }}>The Basics</div>
        <Field label="Listing Title" value="Sunlit Brownstone Retreat" delay={10} />
        <Field label="Property Type" value="Entire Home · Townhouse" delay={50} />
        <div style={{ display: "flex", gap: 14, marginTop: 6, flexWrap: "wrap" }}>
          <Chip label="2 Bedrooms" active delay={90} />
          <Chip label="2 Baths" active delay={105} />
          <Chip label="Sleeps 6" active delay={120} />
        </div>
      </UIPanel>
    } />
);

const Scene4 = () => (
  <VStepScene step={3} eyebrow="WHERE IT LIVES" title="Pin your" italicTitle="location."
    description="Your exact address stays private until a booking is confirmed."
    panel={
      <UIPanel width={820}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 24 }}>Location</div>
        <Field label="Street Address" value="1325 Bronzeville Ave" delay={10} />
        <div style={{ display: "flex", gap: 18 }}>
          <div style={{ flex: 1 }}><Field label="City" value="Chicago" delay={50} /></div>
          <div style={{ width: 180 }}><Field label="State" value="IL" delay={70} /></div>
        </div>
        <Sequence from={120} layout="none">
          <div style={{ marginTop: 8, height: 200, borderRadius: 14, background: "radial-gradient(circle at 50% 60%, rgba(255,179,0,0.25), rgba(0,116,217,0.15) 60%, transparent 80%)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 26, height: 26, borderRadius: 999, background: "#FFB300", boxShadow: "0 0 0 10px rgba(255,179,0,0.25), 0 0 0 22px rgba(255,179,0,0.12)" }} />
          </div>
        </Sequence>
      </UIPanel>
    } />
);

const Scene5 = () => {
  const amenities = ["Wi-Fi", "Kitchen", "Parking", "Washer", "A/C", "TV", "Workspace", "Heating", "Coffee Bar"];
  return (
    <VStepScene step={4} eyebrow="AMENITIES" title="Show what makes" italicTitle="it special."
      description="The more you share, the easier guests find the perfect stay."
      panel={
        <UIPanel width={880}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 26 }}>Amenities</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {amenities.map((a, i) => <Chip key={a} label={a} active delay={20 + i * 8} />)}
          </div>
        </UIPanel>
      } />
  );
};

const Scene6 = () => {
  const frame = useCurrentFrame();
  const price = Math.round(interpolate(frame - 90, [0, 60], [0, 189], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <VStepScene step={5} eyebrow="SET YOUR PRICE" title="Earn on" italicTitle="your terms."
      description="You can update pricing anytime."
      panel={
        <UIPanel width={820}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 24 }}>Pricing</div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 16, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Nightly Rate</div>
            <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 110, color: "#FFB300", lineHeight: 1 }}>
              ${price}<span style={{ fontSize: 34, color: "rgba(255,255,255,0.6)", marginLeft: 10 }}>/ night</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <div style={{ flex: 1 }}><Field label="Cleaning Fee" value="$75" delay={170} /></div>
            <div style={{ flex: 1 }}><Field label="Min Stay" value="2 nights" delay={200} /></div>
          </div>
        </UIPanel>
      } />
  );
};

const Scene7 = () => (
  <VStepScene step={6} eyebrow="BRING IT TO LIFE" title="Upload your" italicTitle="best photos."
    description="Up to 20 photos. iPhone: convert HEIC to JPG first."
    panel={
      <UIPanel width={880}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 24 }}>Photos</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {Array.from({ length: 9 }).map((_, i) => <PhotoTile key={i} index={i} delay={20 + i * 6} />)}
        </div>
        <div style={{ marginTop: 20, fontFamily: inter, fontWeight: 500, fontSize: 20, color: "#FFB300", letterSpacing: 2 }}>
          <DelayedText text="✓  9 OF 20 UPLOADED" delay={120} />
        </div>
      </UIPanel>
    } />
);

const Scene8 = () => {
  const frame = useCurrentFrame();
  const checkOp = interpolate(frame, [120, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const welcomeOp = interpolate(frame, [220, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [320, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "140px 80px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 32 }}>
      <StepBadge step={7} />
      <Eyebrow text="REVIEW & PUBLISH" delay={20} />
      <KineticTitle text="One last look —" size={88} delay={30} />
      <div style={{ marginTop: -10 }}>
        <KineticTitle text="then you're live." size={88} color="#FFB300" italic delay={60} />
      </div>
      <Sequence from={120} layout="none">
        <div style={{ opacity: checkOp, display: "flex", flexDirection: "column", gap: 14, marginTop: 24, alignItems: "center" }}>
          {["Basics ✓", "Location ✓", "Amenities ✓", "Pricing ✓", "Photos ✓"].map((t) => (
            <div key={t} style={{ fontFamily: inter, fontWeight: 500, fontSize: 26, color: "#FFB300", letterSpacing: 3 }}>{t}</div>
          ))}
        </div>
      </Sequence>
      <Sequence from={220} layout="none">
        <div style={{ opacity: welcomeOp, marginTop: 40, textAlign: "center" }}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 68, color: "#fff" }}>
            Welcome to <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}>Mansa Stays.</span>
          </div>
          <div style={{ marginTop: 20, fontFamily: inter, fontWeight: 300, fontSize: 28, color: "rgba(255,255,255,0.75)", maxWidth: 900 }}>
            Your listing is live. Welcome to a movement circulating wealth through Black-owned hospitality.
          </div>
        </div>
      </Sequence>
      <Sequence from={320} layout="none">
        <div style={{ opacity: ctaOp, marginTop: 30, padding: "20px 36px", borderRadius: 999, border: "1px solid rgba(255,179,0,0.6)", background: "rgba(255,179,0,0.08)", fontFamily: inter, fontWeight: 600, fontSize: 22, color: "#FFB300", letterSpacing: 4, textAlign: "center" }}>
          MANSAMUSAMARKETPLACE.COM / STAYS
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

export const MansaStaysVideoVertical = () => (
  <AbsoluteFill style={{ background: "#000814" }}>
    <CinematicBg totalFrames={MANSA_STAYS_V_TOTAL} />
    {/* VO muxed in post — system ffmpeg, native AAC */}
    <Series>
      <Series.Sequence durationInFrames={SCENE_LEN}><SceneHook /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_LEN}><Scene2 /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_LEN}><Scene3 /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_LEN}><Scene4 /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_LEN}><Scene5 /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_LEN}><Scene6 /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_LEN}><Scene7 /></Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_LEN}><Scene8 /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
