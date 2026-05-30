import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { CinematicBg } from "./components/CinematicBg";
import { KineticTitle } from "./components/KineticTitle";

const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const { fontFamily: playfairItalic } = loadPlayfair("italic", { weights: ["400", "700"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "400", "500", "700"], subsets: ["latin"] });

export const MANSA_STAYS_TOTAL = 3600; // 120s @ 30fps

const SCENE_LEN = 450; // 15s per scene * 8 = 120s

// ---------- Shared helpers ----------
const Eyebrow = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 22], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        fontFamily: inter,
        fontWeight: 500,
        fontSize: 22,
        color: "#FFB300",
        letterSpacing: 10,
        textTransform: "uppercase",
        opacity: op,
        transform: `translateY(${y}px)`,
      }}
    >
      {text}
    </div>
  );
};

const SubLine = ({ text, delay = 0, size = 32, color = "rgba(255,255,255,0.82)", maxWidth = 1200 }: { text: string; delay?: number; size?: number; color?: string; maxWidth?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - delay, [0, 26], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        fontFamily: inter,
        fontWeight: 300,
        fontSize: size,
        color,
        lineHeight: 1.45,
        maxWidth,
        opacity: op,
        transform: `translateY(${y}px)`,
      }}
    >
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
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 26px",
        border: "1px solid rgba(255,179,0,0.55)",
        borderRadius: 999,
        background: "rgba(255,179,0,0.06)",
        opacity: op,
        transform: `scale(${scale})`,
      }}
    >
      <span style={{ fontFamily: inter, fontWeight: 700, fontSize: 18, color: "#FFB300", letterSpacing: 4 }}>
        STEP {String(step).padStart(2, "0")}
      </span>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: "#FFB300" }} />
      <span style={{ fontFamily: inter, fontWeight: 400, fontSize: 18, color: "rgba(255,255,255,0.7)", letterSpacing: 4 }}>
        OF {String(total).padStart(2, "0")}
      </span>
    </div>
  );
};

// Mock UI panel — feels like Mansa Stays interface
const UIPanel = ({ children, delay = 0, width = 760 }: { children: React.ReactNode; delay?: number; width?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 90 } });
  const y = interpolate(sp, [0, 1], [60, 0]);
  const op = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        width,
        padding: 36,
        borderRadius: 22,
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        opacity: op,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Field = ({ label, value, delay = 0, filled = true }: { label: string; value: string; delay?: number; filled?: boolean }) => {
  const frame = useCurrentFrame();
  const fillWidth = interpolate(frame - delay, [0, 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showVal = interpolate(frame - delay, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ position: "relative", padding: "14px 18px", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, minHeight: 26 }}>
        <span style={{ fontFamily: inter, fontWeight: 400, fontSize: 22, color: "#fff", opacity: showVal }}>{value}</span>
        {filled && (
          <div
            style={{
              position: "absolute",
              left: 0, bottom: 0,
              height: 2,
              width: `${fillWidth}%`,
              background: "linear-gradient(90deg, #FFB300, #FFD66E)",
              borderRadius: 2,
            }}
          />
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
    <div
      style={{
        padding: "12px 22px",
        borderRadius: 999,
        border: `1px solid ${active ? "rgba(255,179,0,0.7)" : "rgba(255,255,255,0.18)"}`,
        background: active ? "rgba(255,179,0,0.12)" : "rgba(255,255,255,0.04)",
        color: active ? "#FFD66E" : "rgba(255,255,255,0.85)",
        fontFamily: inter,
        fontWeight: 500,
        fontSize: 20,
        opacity: op,
        transform: `scale(${scale})`,
      }}
    >
      {label}
    </div>
  );
};

// ---------- Layouts ----------
const SceneShell = ({ children, align = "center" }: { children: React.ReactNode; align?: "center" | "split" }) => (
  <AbsoluteFill style={{ padding: "120px 140px", justifyContent: align === "center" ? "center" : "center", alignItems: "stretch" }}>
    {children}
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
        <Eyebrow text="MANSA STAYS · HOST GUIDE" delay={0} />
        <KineticTitle text="Your Property." size={140} delay={20} />
        <div style={{ marginTop: -30 }}>
          <KineticTitle text="Your Story." size={140} color="#FFB300" italic delay={50} />
        </div>
        <div style={{ marginTop: 30, opacity: subOp, fontFamily: inter, fontWeight: 300, fontSize: 36, color: "rgba(255,255,255,0.78)", textAlign: "center", maxWidth: 1200, lineHeight: 1.4 }}>
          A two-minute walkthrough on how to list your home on Mansa Stays —
          <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}> and welcome the world in.</span>
        </div>
        <div style={{ marginTop: 28, opacity: ctaOp, fontFamily: inter, fontWeight: 500, fontSize: 18, color: "#FFB300", letterSpacing: 8 }}>
          ────  7 SIMPLE STEPS  ────
        </div>
      </div>
    </SceneShell>
  );
};

// ---------- Step Scene Template ----------
const StepScene = ({
  step,
  eyebrow,
  title,
  italicTitle,
  description,
  panel,
}: {
  step: number;
  eyebrow: string;
  title: string;
  italicTitle?: string;
  description: string;
  panel: React.ReactNode;
}) => (
  <AbsoluteFill style={{ padding: "100px 140px", display: "flex", flexDirection: "row", alignItems: "center", gap: 100 }}>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
      <StepBadge step={step} />
      <div style={{ marginTop: 4 }}>
        <Eyebrow text={eyebrow} delay={10} />
      </div>
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
      <Sequence from={70}>{panel}</Sequence>
    </div>
  </AbsoluteFill>
);

// ---------- Scene 2: Sign In ----------
const Scene2 = () => (
  <StepScene
    step={1}
    eyebrow="GET STARTED"
    title="Sign in to"
    italicTitle="Mansa Stays."
    description="Visit mansamusamarketplace.com/stays and click List Your Property. Sign in with your email — or create a free host account in seconds."
    panel={
      <UIPanel width={620}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 36, color: "#fff", marginBottom: 6 }}>Welcome, Host</div>
        <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 18, color: "rgba(255,255,255,0.6)", marginBottom: 28 }}>Sign in to begin your listing</div>
        <Field label="Email" value="susan@yourdomain.com" delay={20} />
        <Field label="Password" value="••••••••••" delay={60} />
        <Sequence from={120}>
          <div style={{ marginTop: 8, padding: "16px 22px", borderRadius: 12, background: "linear-gradient(90deg, #FFB300, #FFD66E)", color: "#001028", fontFamily: inter, fontWeight: 700, fontSize: 20, textAlign: "center", letterSpacing: 2 }}>
            CONTINUE  →
          </div>
        </Sequence>
      </UIPanel>
    }
  />
);

// ---------- Scene 3: Basics ----------
const Scene3 = () => (
  <StepScene
    step={2}
    eyebrow="THE BASICS"
    title="Name your"
    italicTitle="space."
    description="Give your listing a title that sells the dream, choose your property type, and tell us how many guests you'll welcome."
    panel={
      <UIPanel width={620}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 22 }}>The Basics</div>
        <Field label="Listing Title" value="Sunlit Brownstone Retreat" delay={10} />
        <Field label="Property Type" value="Entire Home · Townhouse" delay={50} />
        <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
          <Sequence from={90}><Chip label="2 Bedrooms" active delay={0} /></Sequence>
          <Sequence from={105}><Chip label="2 Baths" active delay={0} /></Sequence>
          <Sequence from={120}><Chip label="Sleeps 6" active delay={0} /></Sequence>
        </div>
      </UIPanel>
    }
  />
);

// ---------- Scene 4: Location ----------
const Scene4 = () => (
  <StepScene
    step={3}
    eyebrow="WHERE IT LIVES"
    title="Pin your"
    italicTitle="location."
    description="Enter your street, city, and state. Guests see only the neighborhood — your exact address stays private until a booking is confirmed."
    panel={
      <UIPanel width={620}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 22 }}>Location</div>
        <Field label="Street Address" value="1325 Bronzeville Ave" delay={10} />
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}><Field label="City" value="Chicago" delay={50} /></div>
          <div style={{ width: 160 }}><Field label="State" value="IL" delay={70} /></div>
        </div>
        <Sequence from={120}>
          <div style={{ marginTop: 6, height: 140, borderRadius: 12, background: "radial-gradient(circle at 50% 60%, rgba(255,179,0,0.25), rgba(0,116,217,0.15) 60%, transparent 80%)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: 999, background: "#FFB300", boxShadow: "0 0 0 8px rgba(255,179,0,0.25), 0 0 0 18px rgba(255,179,0,0.12)" }} />
          </div>
        </Sequence>
      </UIPanel>
    }
  />
);

// ---------- Scene 5: Amenities ----------
const Scene5 = () => {
  const amenities = ["Wi-Fi", "Kitchen", "Free Parking", "Washer", "Air Conditioning", "TV", "Workspace", "Heating", "Coffee Bar"];
  return (
    <StepScene
      step={4}
      eyebrow="DETAILS & AMENITIES"
      title="Show what makes"
      italicTitle="it special."
      description="Tap the amenities your home offers — from Wi-Fi to a workspace. The more you share, the easier guests find the perfect stay."
      panel={
        <UIPanel width={680}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 24 }}>Amenities</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {amenities.map((a, i) => (
              <Sequence key={a} from={20 + i * 8}>
                <Chip label={a} active delay={0} />
              </Sequence>
            ))}
          </div>
        </UIPanel>
      }
    />
  );
};

// ---------- Scene 6: Pricing ----------
const Scene6 = () => {
  const frame = useCurrentFrame();
  // Number counter for nightly rate
  const price = Math.round(interpolate(frame - 90, [0, 60], [0, 189], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <StepScene
      step={5}
      eyebrow="SET YOUR PRICE"
      title="Earn on"
      italicTitle="your terms."
      description="Choose a nightly rate, a cleaning fee, and your minimum stay. You can update pricing anytime — and you keep more of every booking."
      panel={
        <UIPanel width={620}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 22 }}>Pricing</div>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Nightly Rate</div>
            <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 84, color: "#FFB300", lineHeight: 1 }}>
              ${price}<span style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", marginLeft: 8 }}>/ night</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}><Field label="Cleaning Fee" value="$75" delay={170} /></div>
            <div style={{ flex: 1 }}><Field label="Min Stay" value="2 nights" delay={200} /></div>
          </div>
        </UIPanel>
      }
    />
  );
};

// ---------- Scene 7: Photos ----------
const Scene7 = () => (
  <StepScene
    step={6}
    eyebrow="BRING IT TO LIFE"
    title="Upload your"
    italicTitle="best photos."
    description="Add up to 20 photos — JPG, PNG, or WEBP, under 10 MB each. iPhone users: convert HEIC to JPG first. Great light sells great stays."
    panel={
      <UIPanel width={680}>
        <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 30, color: "#fff", marginBottom: 22 }}>Photos</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <Sequence key={i} from={20 + i * 6}>
              <PhotoTile index={i} />
            </Sequence>
          ))}
        </div>
        <Sequence from={120}>
          <div style={{ marginTop: 18, fontFamily: inter, fontWeight: 500, fontSize: 16, color: "#FFB300", letterSpacing: 2 }}>
            ✓  9 OF 20 UPLOADED
          </div>
        </Sequence>
      </UIPanel>
    }
  />
);

const PhotoTile = ({ index }: { index: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 130 } });
  const scale = interpolate(sp, [0, 1], [0.7, 1]);
  const op = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hues = ["#003366", "#0a4a7a", "#FFB300", "#1a5a8a", "#c8951a", "#0a3a6a", "#FFD66E", "#0a2a4a", "#b8821a"];
  return (
    <div
      style={{
        aspectRatio: "4/3",
        borderRadius: 10,
        background: `linear-gradient(135deg, ${hues[index]}, rgba(0,8,20,0.6))`,
        border: "1px solid rgba(255,255,255,0.1)",
        opacity: op,
        transform: `scale(${scale})`,
      }}
    />
  );
};

// ---------- Scene 8: Review & Welcome ----------
const Scene8 = () => {
  const frame = useCurrentFrame();
  const checkOp = interpolate(frame, [120, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const welcomeOp = interpolate(frame, [220, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [320, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ padding: "100px 140px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 32 }}>
      <StepBadge step={7} />
      <Eyebrow text="REVIEW & PUBLISH" delay={20} />
      <KineticTitle text="One last look —" size={96} delay={30} />
      <div style={{ marginTop: -10 }}>
        <KineticTitle text="then you're live." size={96} color="#FFB300" italic delay={60} />
      </div>

      <Sequence from={120}>
        <div style={{ opacity: checkOp, display: "flex", gap: 36, marginTop: 24 }}>
          {["Basics ✓", "Location ✓", "Amenities ✓", "Pricing ✓", "Photos ✓"].map((t, i) => (
            <div key={t} style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, color: "#FFB300", letterSpacing: 2 }}>
              {t}
            </div>
          ))}
        </div>
      </Sequence>

      <Sequence from={220}>
        <div style={{ opacity: welcomeOp, marginTop: 50, textAlign: "center" }}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontSize: 64, color: "#fff" }}>
            Welcome to <span style={{ color: "#FFB300", fontStyle: "italic", fontFamily: playfairItalic }}>Mansa Stays.</span>
          </div>
          <div style={{ marginTop: 18, fontFamily: inter, fontWeight: 300, fontSize: 28, color: "rgba(255,255,255,0.75)", maxWidth: 1100 }}>
            Your listing is live. Guests can now discover your home —
            and you're part of a movement circulating wealth through Black-owned hospitality.
          </div>
        </div>
      </Sequence>

      <Sequence from={320}>
        <div style={{ opacity: ctaOp, marginTop: 40, padding: "18px 40px", borderRadius: 999, border: "1px solid rgba(255,179,0,0.6)", background: "rgba(255,179,0,0.08)", fontFamily: inter, fontWeight: 600, fontSize: 22, color: "#FFB300", letterSpacing: 6 }}>
          MANSAMUSAMARKETPLACE.COM / STAYS
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------- Root ----------
export const MansaStaysVideo = () => {
  return (
    <AbsoluteFill style={{ background: "#000814" }}>
      <CinematicBg totalFrames={MANSA_STAYS_TOTAL} />
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
};
