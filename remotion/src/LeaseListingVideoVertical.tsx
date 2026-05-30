// 1080x1920 Vertical — How to list a property for yearly leases (Reels/TikTok).
import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "./components/CinematicBg";
import { KineticTitle } from "./components/KineticTitle";

const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: playfairItalic } = loadPlayfair("italic", { weights: ["400", "700"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "400", "500", "700"], subsets: ["latin"] });

export const LEASE_V_TOTAL = 3600;
const SCENE_LEN = 450;

const Eyebrow = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 22], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 26, color: "#FFB300", letterSpacing: 10, textTransform: "uppercase", opacity: op, transform: `translateY(${y}px)`, textAlign: "center" }}>{text}</div>;
};

const SubLine = ({ text, delay = 0, size = 28, maxWidth = 880 }: { text: string; delay?: number; size?: number; maxWidth?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 26], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ fontFamily: inter, fontWeight: 300, fontSize: size, color: "rgba(255,255,255,0.82)", lineHeight: 1.45, maxWidth, opacity: op, transform: `translateY(${y}px)`, textAlign: "center" }}>{text}</div>;
};

const StepBadge = ({ step, total = 7 }: { step: number; total?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const scale = interpolate(sp, [0, 1], [0.6, 1]);
  const op = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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

const Field = ({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const fillWidth = interpolate(frame - delay, [0, 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showVal = interpolate(frame - delay, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 16, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ position: "relative", padding: "18px 22px", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, minHeight: 30 }}>
        <span style={{ fontFamily: inter, fontWeight: 400, fontSize: 26, color: "#fff", opacity: showVal }}>{value}</span>
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

const VShell = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill style={{ padding: "120px 80px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40 }}>{children}</AbsoluteFill>
);

const VStepScene = ({ step, eyebrow, title, italicTitle, description, panel }: {
  step: number; eyebrow: string; title: string; italicTitle?: string; description: string; panel: React.ReactNode;
}) => (
  <AbsoluteFill style={{ padding: "100px 80px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: 24, paddingTop: 140 }}>
    <StepBadge step={step} />
    <Eyebrow text={eyebrow} delay={10} />
    <div style={{ marginTop: 8, textAlign: "center" }}>
      <KineticTitle text={title} size={88} delay={20} />
      {italicTitle && (
        <div style={{ marginTop: 6 }}>
          <KineticTitle text={italicTitle} size={88} color="#FFB300" italic delay={50} />
        </div>
      )}
    </div>
    <div style={{ marginTop: 8 }}><SubLine text={description} delay={90} size={28} maxWidth={880} /></div>
    <div style={{ marginTop: 24, display: "flex", justifyContent: "center", width: "100%" }}>
      <Sequence from={70} layout="none">{panel}</Sequence>
    </div>
  </AbsoluteFill>
);

const SceneHook = () => {
  const frame = useCurrentFrame();
  const subOp = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [240, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <VShell>
      <Eyebrow text="MANSA STAYS · YEARLY LEASES" delay={0} />
      <KineticTitle text="Your Property." size={120} delay={20} />
      <div style={{ marginTop: -20 }}>
        <KineticTitle text="Your Tenant." size={120} color="#FFB300" italic delay={50} />
      </div>
      <div style={{ marginTop: 30, opacity: subOp, fontFamily: inter, fontWeight: 300, fontSize: 34, color: "rgba(255,255,255,0.78)", textAlign: "center", maxWidth: 900, lineHeight: 1.4 }}>
        How to list your property for a yearly lease —
        <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}> free to list, $99 only when signed.</span>
      </div>
      <div style={{ marginTop: 28, opacity: ctaOp, fontFamily: inter, fontWeight: 500, fontSize: 22, color: "#FFB300", letterSpacing: 8 }}>
        ────  7 SIMPLE STEPS  ────
      </div>
    </VShell>
  );
};

const Scene2 = () => (
  <VStepScene step={1} eyebrow="GET STARTED" title="Open Create" italicTitle="Lease."
    description="Visit /stays/host/lease/new. Sign in or create a free landlord account."
    panel={
      <UIPanel width={820}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 40, color: "#fff", marginBottom: 8 }}>Welcome, Landlord</div>
        <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 22, color: "rgba(255,255,255,0.6)", marginBottom: 30 }}>Sign in to list your yearly lease</div>
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
  <VStepScene step={2} eyebrow="BRING IT TO LIFE" title="Upload your" italicTitle="best photos."
    description="JPG, PNG or WEBP under 10 MB. iPhone: convert HEIC to JPG first."
    panel={
      <UIPanel width={880}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 24 }}>Property Photos</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {Array.from({ length: 9 }).map((_, i) => <PhotoTile key={i} index={i} delay={20 + i * 6} />)}
        </div>
        <div style={{ marginTop: 20, fontFamily: inter, fontWeight: 500, fontSize: 20, color: "#FFB300", letterSpacing: 2 }}>
          <DelayedText text="✓  9 PHOTOS UPLOADED" delay={120} />
        </div>
      </UIPanel>
    } />
);

const Scene4 = () => (
  <VStepScene step={3} eyebrow="THE BASICS" title="Tell renters" italicTitle="about it."
    description="A title that sells the dream, a property type, and a short description."
    panel={
      <UIPanel width={820}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 24 }}>Listing Details</div>
        <Field label="Listing Title" value="Sunlit Bronzeville 2-Bed" delay={10} />
        <Field label="Property Type" value="Apartment · Entire Unit" delay={50} />
        <Field label="Description" value="Renovated. Walk to L." delay={90} />
      </UIPanel>
    } />
);

const Scene5 = () => (
  <VStepScene step={4} eyebrow="WHERE IT LIVES" title="Add your" italicTitle="address."
    description="Renters see the neighborhood — your exact address stays private."
    panel={
      <UIPanel width={820}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 24 }}>Location</div>
        <Field label="Street Address" value="1325 S King Dr" delay={10} />
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}><Field label="City" value="Chicago" delay={50} /></div>
          <div style={{ width: 130 }}><Field label="State" value="IL" delay={70} /></div>
          <div style={{ width: 160 }}><Field label="ZIP" value="60616" delay={90} /></div>
        </div>
      </UIPanel>
    } />
);

const Scene6 = () => (
  <VStepScene step={5} eyebrow="THE SPECS" title="Bedrooms," italicTitle="baths, move-in."
    description="Set bedrooms, bathrooms, occupants, and your available-from date."
    panel={
      <UIPanel width={880}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 24 }}>Specifications</div>
        <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
          <Chip label="2 Bedrooms" active delay={20} />
          <Chip label="1.5 Baths" active delay={40} />
          <Chip label="Sleeps 4" active delay={60} />
          <Chip label="Furnished" active delay={80} />
        </div>
        <Field label="Available From" value="August 1, 2026" delay={110} />
      </UIPanel>
    } />
);

const Scene7 = () => {
  const frame = useCurrentFrame();
  const rent = Math.round(interpolate(frame - 90, [0, 60], [0, 2150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <VStepScene step={6} eyebrow="SET YOUR RENT" title="Earn on" italicTitle="your terms."
      description="Monthly rent, security deposit, and the lease term."
      panel={
        <UIPanel width={820}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 34, color: "#fff", marginBottom: 24 }}>Rent & Terms</div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 16, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Monthly Rent</div>
            <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 100, color: "#FFB300", lineHeight: 1 }}>
              ${rent.toLocaleString()}<span style={{ fontSize: 32, color: "rgba(255,255,255,0.6)", marginLeft: 10 }}>/ mo</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <div style={{ flex: 1 }}><Field label="Security Deposit" value="$2,150" delay={170} /></div>
            <div style={{ flex: 1 }}><Field label="Lease Term" value="12 months" delay={200} /></div>
          </div>
        </UIPanel>
      } />
  );
};

const Scene8 = () => {
  const frame = useCurrentFrame();
  const checkOp = interpolate(frame, [120, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const welcomeOp = interpolate(frame, [220, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [320, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "140px 80px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 32 }}>
      <StepBadge step={7} />
      <Eyebrow text="SCREENING & PUBLISH" delay={20} />
      <KineticTitle text="Set screening —" size={82} delay={30} />
      <div style={{ marginTop: -10 }}>
        <KineticTitle text="then publish." size={82} color="#FFB300" italic delay={60} />
      </div>
      <Sequence from={120} layout="none">
        <div style={{ opacity: checkOp, display: "flex", flexDirection: "column", gap: 14, marginTop: 24, alignItems: "center" }}>
          {["Min Credit 650 ✓", "Income 3× Rent ✓", "Section 8 Welcome ✓", "Fair Housing ✓", "No Broker Fees ✓"].map((t) => (
            <div key={t} style={{ fontFamily: inter, fontWeight: 500, fontSize: 26, color: "#FFB300", letterSpacing: 3 }}>{t}</div>
          ))}
        </div>
      </Sequence>
      <Sequence from={220} layout="none">
        <div style={{ opacity: welcomeOp, marginTop: 30, textAlign: "center" }}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 56, color: "#fff" }}>
            Free to list. <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}>$99 when signed.</span>
          </div>
          <div style={{ marginTop: 18, fontFamily: inter, fontWeight: 300, fontSize: 26, color: "rgba(255,255,255,0.75)", maxWidth: 900 }}>
            No broker fees. No subscription. Pay only when both parties confirm.
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

const TitleStampV = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 45, 65], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ background: "rgba(0,8,20,0.78)", opacity: op, alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 28, color: "#FFB300", letterSpacing: 10, textTransform: "uppercase", marginBottom: 36, textAlign: "center" }}>
        Mansa Stays<br/>Landlord Guide
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 130, color: "#FFFFFF", textAlign: "center", lineHeight: 1.05, letterSpacing: -2 }}>
        How to List<br/>your <span style={{ fontStyle: "italic", color: "#FFD66E", fontFamily: playfairItalic }}>Leasing</span><br/>Property
      </div>
      <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 32, color: "rgba(255,255,255,0.78)", marginTop: 40, letterSpacing: 2, textAlign: "center" }}>
        2-minute walkthrough
      </div>
    </AbsoluteFill>
  );
};

export const LeaseListingVideoVertical = () => (
  <AbsoluteFill style={{ background: "#000814" }}>
    <CinematicBg totalFrames={LEASE_V_TOTAL} />
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
    <Sequence from={0} durationInFrames={70} layout="none"><TitleStampV /></Sequence>
  </AbsoluteFill>
);
