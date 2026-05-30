// 1920x1080 — How to list a property for yearly leases on Mansa Stays.
import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "./components/CinematicBg";
import { KineticTitle } from "./components/KineticTitle";

const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: playfairItalic } = loadPlayfair("italic", { weights: ["400", "700"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "400", "500", "700"], subsets: ["latin"] });

export const LEASE_TOTAL = 3600; // 120s @ 30fps
const SCENE_LEN = 450; // 8 × 15s

// ---------- Shared bits ----------
const Eyebrow = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 22], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, color: "#FFB300", letterSpacing: 10, textTransform: "uppercase", opacity: op, transform: `translateY(${y}px)` }}>{text}</div>;
};

const SubLine = ({ text, delay = 0, size = 28, maxWidth = 780 }: { text: string; delay?: number; size?: number; maxWidth?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 26], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ fontFamily: inter, fontWeight: 300, fontSize: size, color: "rgba(255,255,255,0.82)", lineHeight: 1.45, maxWidth, opacity: op, transform: `translateY(${y}px)` }}>{text}</div>;
};

const StepBadge = ({ step, total = 7, delay = 0 }: { step: number; total?: number; delay?: number }) => {
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

const UIPanel = ({ children, delay = 0, width = 760 }: { children: React.ReactNode; delay?: number; width?: number }) => {
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
  return <div style={{ aspectRatio: "4/3", borderRadius: 10, background: `linear-gradient(135deg, ${hues[index]}, rgba(0,8,20,0.6))`, border: "1px solid rgba(255,255,255,0.1)", opacity: op, transform: `scale(${scale})` }} />;
};

// ---------- Layouts ----------
const SceneShell = ({ children }: { children: React.ReactNode }) => (
  <AbsoluteFill style={{ padding: "120px 140px", justifyContent: "center", alignItems: "stretch" }}>{children}</AbsoluteFill>
);

const StepScene = ({ step, eyebrow, title, italicTitle, description, panel }: {
  step: number; eyebrow: string; title: string; italicTitle?: string; description: string; panel: React.ReactNode;
}) => (
  <AbsoluteFill style={{ padding: "100px 140px", display: "flex", flexDirection: "row", alignItems: "center", gap: 100 }}>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
      <StepBadge step={step} />
      <div style={{ marginTop: 4 }}><Eyebrow text={eyebrow} delay={10} /></div>
      <div style={{ marginTop: 6 }}>
        <KineticTitle text={title} size={96} delay={20} align="left" />
        {italicTitle && (
          <div style={{ marginTop: 6 }}>
            <KineticTitle text={italicTitle} size={96} color="#FFB300" italic delay={50} align="left" />
          </div>
        )}
      </div>
      <div style={{ marginTop: 20 }}>
        <SubLine text={description} delay={90} size={28} maxWidth={780} />
      </div>
    </div>
    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
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
    <SceneShell>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <Eyebrow text="MANSA STAYS · YEARLY LEASES" delay={0} />
        <KineticTitle text="Your Property." size={140} delay={20} />
        <div style={{ marginTop: -30 }}>
          <KineticTitle text="Your Tenant." size={140} color="#FFB300" italic delay={50} />
        </div>
        <div style={{ marginTop: 30, opacity: subOp, fontFamily: inter, fontWeight: 300, fontSize: 36, color: "rgba(255,255,255,0.78)", textAlign: "center", maxWidth: 1200, lineHeight: 1.4 }}>
          A two-minute walkthrough on how to list your property for a yearly lease —
          <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}> free to list, $99 only when the lease is signed.</span>
        </div>
        <div style={{ marginTop: 28, opacity: ctaOp, fontFamily: inter, fontWeight: 500, fontSize: 18, color: "#FFB300", letterSpacing: 8 }}>
          ────  7 SIMPLE STEPS  ────
        </div>
      </div>
    </SceneShell>
  );
};

// ---------- Scene 2: Sign in & open Create Lease ----------
const Scene2 = () => (
  <StepScene step={1} eyebrow="GET STARTED" title="Open Create" italicTitle="Lease."
    description="Visit mansamusamarketplace.com/stays/host/lease/new. Sign in — or create a free landlord account in seconds."
    panel={
      <UIPanel width={620}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 36, color: "#fff", marginBottom: 6 }}>Welcome, Landlord</div>
        <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 18, color: "rgba(255,255,255,0.6)", marginBottom: 28 }}>Sign in to begin your yearly lease listing</div>
        <Field label="Email" value="susan@yourdomain.com" delay={20} />
        <Field label="Password" value="••••••••••" delay={60} />
        <Sequence from={120} layout="none">
          <div style={{ marginTop: 8, padding: "16px 22px", borderRadius: 12, background: "linear-gradient(90deg, #FFB300, #FFD66E)", color: "#001028", fontFamily: inter, fontWeight: 700, fontSize: 20, textAlign: "center", letterSpacing: 2 }}>
            CONTINUE  →
          </div>
        </Sequence>
      </UIPanel>
    } />
);

// ---------- Scene 3: Photos ----------
const Scene3 = () => (
  <StepScene step={2} eyebrow="BRING IT TO LIFE" title="Upload your" italicTitle="best photos."
    description="At least one photo is required. JPG, PNG or WEBP — under 10 MB each. iPhone hosts: convert HEIC to JPG first. Bright daylight shots rent faster."
    panel={
      <UIPanel width={680}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 22 }}>Property Photos</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {Array.from({ length: 9 }).map((_, i) => <PhotoTile key={i} index={i} delay={20 + i * 6} />)}
        </div>
        <div style={{ marginTop: 18, fontFamily: inter, fontWeight: 500, fontSize: 16, color: "#FFB300", letterSpacing: 2 }}>
          <DelayedText text="✓  9 PHOTOS UPLOADED" delay={120} />
        </div>
      </UIPanel>
    } />
);

// ---------- Scene 4: Title, Type, Description ----------
const Scene4 = () => (
  <StepScene step={3} eyebrow="THE BASICS" title="Tell renters" italicTitle="about it."
    description="Pick a title that sells the dream. Choose a property type — apartment, townhouse, single-family. Add a short description that paints the picture."
    panel={
      <UIPanel width={620}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 22 }}>Listing Details</div>
        <Field label="Listing Title" value="Sunlit Bronzeville 2-Bed" delay={10} />
        <Field label="Property Type" value="Apartment · Entire Unit" delay={50} />
        <Field label="Description" value="Renovated. Quiet street. Walk to L." delay={90} />
      </UIPanel>
    } />
);

// ---------- Scene 5: Address ----------
const Scene5 = () => (
  <StepScene step={4} eyebrow="WHERE IT LIVES" title="Add your" italicTitle="address."
    description="Enter the street, city, state and ZIP. Renters see the neighborhood — your exact address stays private until you accept their application."
    panel={
      <UIPanel width={620}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 22 }}>Location</div>
        <Field label="Street Address" value="1325 S King Dr" delay={10} />
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}><Field label="City" value="Chicago" delay={50} /></div>
          <div style={{ width: 110 }}><Field label="State" value="IL" delay={70} /></div>
          <div style={{ width: 140 }}><Field label="ZIP" value="60616" delay={90} /></div>
        </div>
        <Sequence from={140} layout="none">
          <div style={{ marginTop: 6, height: 120, borderRadius: 12, background: "radial-gradient(circle at 50% 60%, rgba(255,179,0,0.25), rgba(0,116,217,0.15) 60%, transparent 80%)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: 999, background: "#FFB300", boxShadow: "0 0 0 8px rgba(255,179,0,0.25), 0 0 0 18px rgba(255,179,0,0.12)" }} />
          </div>
        </Sequence>
      </UIPanel>
    } />
);

// ---------- Scene 6: Bedrooms / Bath / Occupants / Available date ----------
const Scene6 = () => (
  <StepScene step={5} eyebrow="THE SPECS" title="Bedrooms," italicTitle="baths, move-in."
    description="Set bedrooms, bathrooms and the maximum number of occupants. Choose your available-from date so renters know when they can move in."
    panel={
      <UIPanel width={620}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 22 }}>Specifications</div>
        <div style={{ display: "flex", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
          <Chip label="2 Bedrooms" active delay={20} />
          <Chip label="1.5 Baths" active delay={40} />
          <Chip label="Sleeps 4" active delay={60} />
          <Chip label="Furnished" active delay={80} />
        </div>
        <Field label="Available From" value="August 1, 2026" delay={110} />
        <Field label="Utilities Included" value="Water · Trash" delay={150} />
      </UIPanel>
    } />
);

// ---------- Scene 7: Rent, Deposit, Term ----------
const Scene7 = () => {
  const frame = useCurrentFrame();
  const rent = Math.round(interpolate(frame - 90, [0, 60], [0, 2150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <StepScene step={6} eyebrow="SET YOUR RENT" title="Earn on" italicTitle="your terms."
      description="Set the monthly rent, security deposit, and the lease term — usually twelve months. You can update anytime before a tenant applies."
      panel={
        <UIPanel width={620}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 22 }}>Rent & Terms</div>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Monthly Rent</div>
            <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 84, color: "#FFB300", lineHeight: 1 }}>
              ${rent.toLocaleString()}<span style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", marginLeft: 8 }}>/ mo</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}><Field label="Security Deposit" value="$2,150" delay={170} /></div>
            <div style={{ flex: 1 }}><Field label="Lease Term" value="12 months" delay={200} /></div>
          </div>
        </UIPanel>
      } />
  );
};

// ---------- Scene 8: Screening + Acknowledgments + Publish ----------
const Scene8 = () => {
  const frame = useCurrentFrame();
  const checkOp = interpolate(frame, [120, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const welcomeOp = interpolate(frame, [220, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [320, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "100px 140px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 32 }}>
      <StepBadge step={7} />
      <Eyebrow text="SCREENING & PUBLISH" delay={20} />
      <KineticTitle text="Set your screening —" size={88} delay={30} />
      <div style={{ marginTop: -10 }}>
        <KineticTitle text="then publish." size={88} color="#FFB300" italic delay={60} />
      </div>

      <Sequence from={120} layout="none">
        <div style={{ opacity: checkOp, display: "flex", gap: 32, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {["Min Credit 650 ✓", "Income 3× Rent ✓", "Section 8 Welcome ✓", "Fair Housing ✓", "No Broker Fees ✓"].map((t) => (
            <div key={t} style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, color: "#FFB300", letterSpacing: 2 }}>{t}</div>
          ))}
        </div>
      </Sequence>

      <Sequence from={220} layout="none">
        <div style={{ opacity: welcomeOp, marginTop: 40, textAlign: "center" }}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 60, color: "#fff" }}>
            Free to list. <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}>$99 only when signed.</span>
          </div>
          <div style={{ marginTop: 18, fontFamily: inter, fontWeight: 300, fontSize: 28, color: "rgba(255,255,255,0.75)", maxWidth: 1200 }}>
            No broker fees. No monthly subscription. You only pay when both you and your tenant confirm the lease in-app —
            and you're part of a movement circulating wealth through Black-owned housing.
          </div>
        </div>
      </Sequence>

      <Sequence from={320} layout="none">
        <div style={{ opacity: ctaOp, marginTop: 40, padding: "18px 40px", borderRadius: 999, border: "1px solid rgba(255,179,0,0.6)", background: "rgba(255,179,0,0.08)", fontFamily: inter, fontWeight: 600, fontSize: 22, color: "#FFB300", letterSpacing: 6 }}>
          MANSAMUSAMARKETPLACE.COM / STAYS
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

const TitleStamp = () => {
  const frame = useCurrentFrame();
  // Hold full opacity 0-45, fade 45-65
  const op = interpolate(frame, [0, 45, 65], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={{ background: "rgba(0,8,20,0.78)", opacity: op, alignItems: "center", justifyContent: "center", padding: 80 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 26, color: "#FFB300", letterSpacing: 12, textTransform: "uppercase", marginBottom: 32 }}>
        Mansa Stays • Landlord Guide
      </div>
      <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 140, color: "#FFFFFF", textAlign: "center", lineHeight: 1.05, letterSpacing: -2, maxWidth: 1600 }}>
        How to List your <span style={{ fontStyle: "italic", color: "#FFD66E", fontFamily: playfairItalic }}>Leasing</span> Property
      </div>
      <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 30, color: "rgba(255,255,255,0.75)", marginTop: 32, letterSpacing: 2 }}>
        A 2-minute walkthrough for yearly leases
      </div>
    </AbsoluteFill>
  );
};

export const LeaseListingVideo = () => (
  <AbsoluteFill style={{ background: "#000814" }}>
    <CinematicBg totalFrames={LEASE_TOTAL} />
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
    <Sequence from={0} durationInFrames={70} layout="none"><TitleStamp /></Sequence>
  </AbsoluteFill>
);
