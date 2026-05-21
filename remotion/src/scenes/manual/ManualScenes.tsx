import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

const GOLD = "#FFB300";
const BLUE = "#003366";
const BG = "radial-gradient(circle at center, #001028 0%, #000814 75%)";

// Subtle animated gold ambient — reused in every scene
const AmbientGlow = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.012) * 30;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: -200, left: -100, width: 1400, height: 1400,
          background: "radial-gradient(circle, rgba(255,179,0,0.08) 0%, transparent 60%)",
          filter: "blur(80px)",
          transform: `translate(${drift}px, ${drift * 0.5}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -300, right: -100, width: 1200, height: 1200,
          background: "radial-gradient(circle, rgba(0,51,102,0.35) 0%, transparent 65%)",
          filter: "blur(90px)",
          transform: `translate(${-drift * 0.6}px, ${-drift * 0.4}px)`,
        }}
      />
    </>
  );
};

const Eyebrow = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [10, 40], [0, 220], { extrapolateRight: "clamp" });
  return (
    <div style={{ opacity: op, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, marginBottom: 38 }}>
      <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 22, color: GOLD, letterSpacing: 10, textTransform: "uppercase" }}>
        {text}
      </div>
      <div style={{ height: 2, width: lineW, background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Scene 2 — Founder Letter
// ────────────────────────────────────────────────────────────────────────────
export const SceneFounder = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleSp = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const titleY = interpolate(titleSp, [0, 1], [40, 0]);

  const body = "For two decades, small business owners were told that better software would set them free. What it delivered was thirty-six logins, four CRMs, and a Friday spreadsheet they still had to assemble themselves.";
  const bodyOp = interpolate(frame, [60, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bodyY = interpolate(frame, [60, 110], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const sigOp = interpolate(frame, [320, 380], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sigY = interpolate(frame, [320, 380], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const endingOp = interpolate(frame, [560, 620], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <AmbientGlow />
      <AbsoluteFill style={{ padding: "140px 180px", flexDirection: "column", justifyContent: "center" }}>
        <Eyebrow text="Letter to Investors" />
        <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 132, color: "#FFFFFF", lineHeight: 0.95, transform: `translateY(${titleY}px)`, marginBottom: 50 }}>
          From the Founder
        </div>
        <div style={{ fontFamily: inter, fontWeight: 300, fontStyle: "italic", fontSize: 38, color: "#E8E8E8", lineHeight: 1.5, opacity: bodyOp, transform: `translateY(${bodyY}px)`, maxWidth: 1500, marginBottom: 60 }}>
          “{body}”
        </div>
        <div style={{ opacity: endingOp, fontFamily: inter, fontWeight: 500, fontSize: 32, color: GOLD, marginBottom: 30, maxWidth: 1500 }}>
          1325.AI ends that era.
        </div>
        <div style={{ opacity: sigOp, transform: `translateY(${sigY}px)` }}>
          <div style={{ fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 56, color: "#FFFFFF" }}>
            — Thomas D. Bowling
          </div>
          <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 26, color: GOLD, letterSpacing: 4, marginTop: 10, textTransform: "uppercase" }}>
            Founder · Chairman · Chief Architect
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Scene 3 — The Problem
// ────────────────────────────────────────────────────────────────────────────
const ProblemStat = ({ delay, big, label }: { delay: number; big: string; label: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 90 } });
  const op = interpolate(frame - delay, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(sp, [0, 1], [40, 0]);
  return (
    <div style={{ opacity: op, transform: `translateY(${y}px)`, textAlign: "center" }}>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 140, color: GOLD, lineHeight: 1, letterSpacing: -2 }}>{big}</div>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 24, color: "#FFFFFF", letterSpacing: 4, textTransform: "uppercase", marginTop: 14 }}>{label}</div>
    </div>
  );
};

export const SceneProblem = () => {
  const frame = useCurrentFrame();
  const titleOp = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AmbientGlow />
      <AbsoluteFill style={{ padding: "120px 140px", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ opacity: titleOp, marginBottom: 30, fontFamily: inter, fontWeight: 700, fontSize: 22, color: GOLD, letterSpacing: 10, textTransform: "uppercase" }}>
          The Problem
        </div>
        <div style={{ opacity: titleOp, fontFamily: playfair, fontWeight: 900, fontSize: 96, color: "#FFFFFF", lineHeight: 1.05, maxWidth: 1500, marginBottom: 90 }}>
          Small business runs on <span style={{ color: GOLD }}>duct tape</span> and tabs.
        </div>
        <div style={{ display: "flex", gap: 120 }}>
          <ProblemStat delay={50}  big="36" label="Disconnected Logins" />
          <ProblemStat delay={100} big="4"  label="Separate CRMs" />
          <ProblemStat delay={150} big="$12,100" label="Wasted Every Month" />
        </div>
        <div style={{ opacity: interpolate(frame, [460, 520], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), marginTop: 80, fontFamily: inter, fontStyle: "italic", fontWeight: 300, fontSize: 36, color: "#E8E8E8", maxWidth: 1400, textAlign: "center" }}>
          Nothing talks. Nothing remembers. The owner is still the integration layer.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Scene 4 — Platform Overview
// ────────────────────────────────────────────────────────────────────────────
const PillarCard = ({ delay, eyebrow, value, label }: { delay: number; eyebrow: string; value: string; label: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 80 } });
  const op = interpolate(frame - delay, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(sp, [0, 1], [40, 0]);
  return (
    <div style={{
      opacity: op, transform: `translateY(${y}px)`,
      padding: "44px 38px",
      border: `1px solid rgba(255,179,0,0.35)`,
      background: "linear-gradient(180deg, rgba(255,179,0,0.06), rgba(0,51,102,0.10))",
      borderRadius: 14,
      width: 380, minHeight: 280,
    }}>
      <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 18, color: GOLD, letterSpacing: 4, textTransform: "uppercase", marginBottom: 22 }}>{eyebrow}</div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 84, color: "#FFFFFF", lineHeight: 1, letterSpacing: -1 }}>{value}</div>
      <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 22, color: "#CFD6E0", marginTop: 18, lineHeight: 1.35 }}>{label}</div>
    </div>
  );
};

export const ScenePlatform = () => {
  const frame = useCurrentFrame();
  const titleOp = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [60, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AmbientGlow />
      <AbsoluteFill style={{ padding: "100px 140px", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ opacity: titleOp, marginBottom: 22, fontFamily: inter, fontWeight: 700, fontSize: 22, color: GOLD, letterSpacing: 10, textTransform: "uppercase" }}>
          The 1325.AI Platform
        </div>
        <div style={{ opacity: titleOp, fontFamily: playfair, fontWeight: 900, fontSize: 110, color: "#FFFFFF", lineHeight: 1.0, maxWidth: 1600, marginBottom: 22 }}>
          One workforce. <span style={{ color: GOLD }}>Shared memory.</span> Best-in-class models.
        </div>
        <div style={{ opacity: subOp, fontFamily: inter, fontWeight: 300, fontStyle: "italic", fontSize: 30, color: "#E8E8E8", maxWidth: 1500, marginBottom: 70 }}>
          Kayla orchestrates 33 specialized agents across GPT, Claude, Gemini & Llama — every one of them aware of your business.
        </div>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          <PillarCard delay={180} eyebrow="Workforce"     value="33"   label="Specialized agents + Kayla the orchestrator" />
          <PillarCard delay={240} eyebrow="Infrastructure" value="149" label="Production edge functions" />
          <PillarCard delay={300} eyebrow="Data Layer"    value="316+" label="Live production database tables" />
          <PillarCard delay={360} eyebrow="Memory"        value="∞"    label="Cross-agent shared business context" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Scene 6 — ROI Grid
// ────────────────────────────────────────────────────────────────────────────
const ROIBlock = ({ delay, value, label, sub }: { delay: number; value: string; label: string; sub?: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 90 } });
  const op = interpolate(frame - delay, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(sp, [0, 1], [40, 0]);
  return (
    <div style={{ opacity: op, transform: `translateY(${y}px)`, textAlign: "center", padding: "10px 12px", minWidth: 0 }}>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 78, color: GOLD, lineHeight: 1, letterSpacing: -1, whiteSpace: "nowrap" }}>{value}</div>
      <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 20, color: "#FFFFFF", letterSpacing: 3, textTransform: "uppercase", marginTop: 14 }}>{label}</div>
      {sub && <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 18, color: "#CFD6E0", marginTop: 8 }}>{sub}</div>}
    </div>
  );
};

export const SceneROI = () => {
  const frame = useCurrentFrame();
  const titleOp = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AmbientGlow />
      <AbsoluteFill style={{ padding: "100px 100px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: titleOp, marginBottom: 22, fontFamily: inter, fontWeight: 700, fontSize: 22, color: GOLD, letterSpacing: 10, textTransform: "uppercase" }}>
          ROI & Unit Economics
        </div>
        <div style={{ opacity: titleOp, fontFamily: playfair, fontWeight: 900, fontSize: 112, color: "#FFFFFF", lineHeight: 1, textAlign: "center", maxWidth: 1600, marginBottom: 90 }}>
          The math is <span style={{ color: GOLD }}>devastating.</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 30, width: "100%", alignItems: "start" }}>
          <ROIBlock delay={80}  value="$19–$299" label="Monthly Plans" sub="Essentials to Pro" />
          <ROIBlock delay={140} value="~4 Roles" label="Coverage / Customer" sub="$12,100+/mo saved" />
          <ROIBlock delay={200} value="17.6×"    label="LTV / CAC" sub="Forbes-grade unit econ" />
          <ROIBlock delay={260} value="$96M"     label="FY28 ARR Plan" sub="16 revenue streams" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Scene 7 — Ancillary (Mansa Stays + Noire Rideshare)
// ────────────────────────────────────────────────────────────────────────────
const AncillaryHalf = ({ delay, eyebrow, title, bullets, side }: { delay: number; eyebrow: string; title: string; bullets: string[]; side: "L" | "R" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 80 } });
  const op = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(sp, [0, 1], [side === "L" ? -60 : 60, 0]);
  return (
    <div style={{ opacity: op, transform: `translateX(${x}px)`, flex: 1, padding: "50px 50px", border: `1px solid rgba(255,179,0,0.3)`, borderRadius: 14, background: "linear-gradient(180deg, rgba(0,51,102,0.18), rgba(0,8,20,0.4))" }}>
      <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 20, color: GOLD, letterSpacing: 6, textTransform: "uppercase", marginBottom: 20 }}>{eyebrow}</div>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 76, color: "#FFFFFF", lineHeight: 1, marginBottom: 36 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {bullets.map((b, i) => {
          const bop = interpolate(frame - delay - 30 - i * 10, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ opacity: bop, display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div style={{ width: 10, height: 10, background: GOLD, borderRadius: 2, marginTop: 14, flexShrink: 0, boxShadow: `0 0 12px ${GOLD}` }} />
              <div style={{ fontFamily: inter, fontWeight: 400, fontSize: 26, color: "#E8E8E8", lineHeight: 1.4 }}>{b}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SceneAncillary = () => {
  const frame = useCurrentFrame();
  const titleOp = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AmbientGlow />
      <AbsoluteFill style={{ padding: "90px 120px", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ opacity: titleOp, marginBottom: 18, fontFamily: inter, fontWeight: 700, fontSize: 22, color: GOLD, letterSpacing: 10, textTransform: "uppercase" }}>
          Ancillary Services · Live
        </div>
        <div style={{ opacity: titleOp, fontFamily: playfair, fontWeight: 900, fontSize: 96, color: "#FFFFFF", lineHeight: 1, marginBottom: 60 }}>
          More than software. <span style={{ color: GOLD }}>An ecosystem.</span>
        </div>
        <div style={{ display: "flex", gap: 50 }}>
          <AncillaryHalf
            delay={60}
            side="L"
            eyebrow="Mansa Stays"
            title="Short-Term Rentals"
            bullets={[
              "Stripe Connect host payouts",
              "650+ SEO landing pages live",
              "8% platform fee, 92% to host",
              "Black-owned + curated inventory",
            ]}
          />
          <AncillaryHalf
            delay={130}
            side="R"
            eyebrow="Noire Rideshare"
            title="Driver Network"
            bullets={[
              "80% driver take-rate",
              "B2B hotel concierge channel",
              "Surge-aware dispatch via Kayla",
              "Background-checked, vetted fleet",
            ]}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Scene 8 — IP & Moat
// ────────────────────────────────────────────────────────────────────────────
const MoatCard = ({ delay, value, label }: { delay: number; value: string; label: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 90 } });
  const op = interpolate(frame - delay, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(sp, [0, 1], [30, 0]);
  return (
    <div style={{ opacity: op, transform: `translateY(${y}px)`, padding: "36px 28px", border: `1px solid rgba(255,179,0,0.4)`, borderRadius: 12, textAlign: "center", minWidth: 260, background: "rgba(255,179,0,0.04)" }}>
      <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 84, color: GOLD, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 20, color: "#FFFFFF", letterSpacing: 3, textTransform: "uppercase", marginTop: 16, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
};

export const SceneMoat = () => {
  const frame = useCurrentFrame();
  const titleOp = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AmbientGlow />
      <AbsoluteFill style={{ padding: "120px 140px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: titleOp, marginBottom: 22, fontFamily: inter, fontWeight: 700, fontSize: 22, color: GOLD, letterSpacing: 10, textTransform: "uppercase" }}>
          Intellectual Property & Moat
        </div>
        <div style={{ opacity: titleOp, fontFamily: playfair, fontWeight: 900, fontSize: 112, color: "#FFFFFF", lineHeight: 1, textAlign: "center", maxWidth: 1700, marginBottom: 90 }}>
          Defensible. Patented. <span style={{ color: GOLD }}>Real.</span>
        </div>
        <div style={{ display: "flex", gap: 30, flexWrap: "wrap", justifyContent: "center" }}>
          <MoatCard delay={80}  value="27"  label="Patent Claims" />
          <MoatCard delay={130} value="USPTO" label="63 / 969,202" />
          <MoatCard delay={180} value="16"  label="Revenue Streams" />
          <MoatCard delay={230} value="NDA" label="First Investor Portal" />
        </div>
        <div style={{ opacity: interpolate(frame, [340, 400], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), marginTop: 70, fontFamily: inter, fontWeight: 300, fontStyle: "italic", fontSize: 32, color: "#E8E8E8", textAlign: "center", maxWidth: 1500 }}>
          Production infrastructure — not slideware.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Scene 9 — The Ask / Closing
// ────────────────────────────────────────────────────────────────────────────
export const SceneAsk = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyeOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const numSp = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 90 } });
  const numScale = interpolate(numSp, [0, 1], [0.85, 1]);
  const numOp = interpolate(frame, [20, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const subOp = interpolate(frame, [100, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sigOp = interpolate(frame, [350, 410], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [620, 690], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [620, 690], [25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glow = interpolate(frame % 60, [0, 30, 60], [0.4, 0.8, 0.4]);

  // Founder photo reveal near end
  const photoOp = interpolate(frame, [720, 800], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const photoY = interpolate(frame, [720, 800], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AmbientGlow />
      {/* Founder portrait — bottom right */}
      <div style={{
        position: "absolute",
        bottom: 0,
        right: 60,
        height: 780,
        opacity: photoOp,
        transform: `translateY(${photoY}px)`,
        filter: `drop-shadow(0 0 60px rgba(255,179,0,0.35))`,
      }}>
        <Img src={staticFile("images/founder.png")} style={{ height: "100%", width: "auto" }} />
      </div>

      <AbsoluteFill style={{ padding: "80px 140px", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ opacity: eyeOp, fontFamily: inter, fontWeight: 700, fontSize: 24, color: GOLD, letterSpacing: 12, textTransform: "uppercase", marginBottom: 40 }}>
          The Ask · Series A
        </div>
        <div style={{ opacity: numOp, transform: `scale(${numScale})`, fontFamily: playfair, fontWeight: 900, fontSize: 220, color: "#FFFFFF", lineHeight: 1, letterSpacing: -4 }}>
          <span style={{ color: GOLD, filter: `drop-shadow(0 0 30px rgba(255,179,0,${glow}))` }}>$30M</span>
          <span style={{ fontSize: 96, color: "#E8E8E8", marginLeft: 24, fontWeight: 700 }}>raise</span>
        </div>
        <div style={{ opacity: subOp, fontFamily: inter, fontWeight: 400, fontSize: 38, color: "#E8E8E8", marginTop: 24, letterSpacing: 1 }}>
          at <span style={{ color: GOLD, fontWeight: 700 }}>$100M post-money</span> valuation
        </div>

        <div style={{ height: 2, width: interpolate(frame, [250, 310], [0, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, marginTop: 60, marginBottom: 50 }} />

        <div style={{ opacity: sigOp, fontFamily: playfair, fontWeight: 700, fontStyle: "italic", fontSize: 44, color: "#FFFFFF", maxWidth: 1500 }}>
          “The agentic AI standard for SMB will be set in the next 24 months — we intend to set it.”
        </div>
        <div style={{ opacity: sigOp, fontFamily: inter, fontWeight: 500, fontSize: 26, color: GOLD, letterSpacing: 4, marginTop: 20, textTransform: "uppercase" }}>
          — Thomas D. Bowling, Founder · Chairman · Chief Architect
        </div>

        <div style={{ opacity: ctaOp, transform: `translateY(${ctaY}px)`, marginTop: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 34, color: "#FFFFFF", letterSpacing: 6, textTransform: "uppercase" }}>
            Visit
          </div>
          <div style={{ fontFamily: playfair, fontWeight: 900, fontSize: 132, color: GOLD, letterSpacing: -1, filter: `drop-shadow(0 0 40px rgba(255,179,0,${glow}))` }}>
            1325.ai
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
