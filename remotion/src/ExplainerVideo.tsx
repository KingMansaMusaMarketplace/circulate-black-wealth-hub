import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";
import { CinematicBg } from "./components/CinematicBg";
import { KineticTitle } from "./components/KineticTitle";
import { GoldDivider } from "./components/GoldDivider";
import { LogoBumper } from "./components/LogoBumper";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: inter } = loadInter("normal", {
  weights: ["300", "500", "700", "900"],
  subsets: ["latin"],
});
const { fontFamily: playfair } = loadPlayfair("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

// ── Timing (60s @ 30fps = 1800 frames) ──
const INTRO = 45;          // 1.5s  — Logo bumper
const S1 = 210;            // 7s    — Hook
const S2 = 300;            // 10s   — The Problem
const S3 = 420;            // 14s   — The Solution
const S4 = 420;            // 14s   — The Benefits
const S5 = 405;            // 13.5s — CTA
export const EXPLAINER_TOTAL = INTRO + S1 + S2 + S3 + S4 + S5; // 1800

// ═══════════════════════════════════════════
// SCENE 1: HOOK  —  "Meet 1325.AI"
// ═══════════════════════════════════════════
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const flashOp = interpolate(frame, [0, 8, 16], [0, 0.22, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        flexDirection: "column",
      }}
    >
      {/* Subtle gold flash */}
      <AbsoluteFill style={{ background: "rgba(255,179,0,0.12)", opacity: flashOp }} />

      <div
        style={{
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 28,
          color: "#FFB300",
          letterSpacing: 10,
          textTransform: "uppercase",
          marginBottom: 40,
          opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Introducing
      </div>

      <KineticTitle text="1325.AI" size={180} delay={14} />
      <div style={{ height: 32 }} />
      <KineticTitle text="The Future of" size={90} delay={50} />
      <div style={{ height: 18 }} />
      <KineticTitle text="Business" size={110} italic color="#FFB300" delay={80} />

      <div style={{ height: 50 }} />
      <GoldDivider delay={110} width={500} />

      <div
        style={{
          fontFamily: inter,
          fontWeight: 300,
          fontSize: 32,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: 4,
          textAlign: "center",
          marginTop: 40,
          opacity: interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [120, 150], [20, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        Powered by <span style={{ color: "#FFB300", fontWeight: 700 }}>42 Agentic AI Employees</span>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════
// SCENE 2: THE PROBLEM  —  "Hiring is expensive"
// ═══════════════════════════════════════════
const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const problems = [
    { text: "Hiring is", highlight: "expensive", delay: 0 },
    { text: "Operations are", highlight: "overwhelming", delay: 50 },
    { text: "Growth feels", highlight: "impossible", delay: 100 },
  ];

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 26,
          color: "#FFB300",
          letterSpacing: 10,
          textTransform: "uppercase",
          marginBottom: 60,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        The Problem
      </div>

      {problems.map((p, i) => {
        const sp = spring({ frame: frame - p.delay, fps, config: { damping: 16, stiffness: 85 } });
        const y = interpolate(sp, [0, 1], [50, 0]);
        const op = interpolate(frame - p.delay, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        return (
          <div
            key={i}
            style={{
              transform: `translateY(${y}px)`,
              opacity: op,
              textAlign: "center",
              marginBottom: i < problems.length - 1 ? 44 : 0,
            }}
          >
            <span
              style={{
                fontFamily: inter,
                fontWeight: 300,
                fontSize: 56,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: 2,
              }}
            >
              {p.text}{" "}
            </span>
            <span
              style={{
                fontFamily: playfair,
                fontWeight: 900,
                fontSize: 64,
                color: "#FFB300",
                fontStyle: "italic",
                letterSpacing: 1,
              }}
            >
              {p.highlight}
            </span>
          </div>
        );
      })}

      <div
        style={{
          marginTop: 60,
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 30,
          color: "#FFFFFF",
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: interpolate(frame, [180, 220], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [180, 220], [20, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        Sound familiar?
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════
// SCENE 3: THE SOLUTION  —  "42 Agentic AI Employees"
// ═══════════════════════════════════════════
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bigNumberSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 80 } });
  const bigNumberScale = interpolate(bigNumberSpring, [0, 1], [0.5, 1]);
  const bigNumberOp = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 26,
          color: "#FFB300",
          letterSpacing: 10,
          textTransform: "uppercase",
          marginBottom: 20,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        The Solution
      </div>

      {/* Big "42" */}
      <div
        style={{
          fontFamily: playfair,
          fontWeight: 900,
          fontSize: 320,
          color: "#FFB300",
          lineHeight: 1,
          letterSpacing: -14,
          opacity: bigNumberOp,
          transform: `scale(${bigNumberScale})`,
          textShadow: "0 0 80px rgba(255,179,0,0.35)",
        }}
      >
        42
      </div>

      <div
        style={{
          fontFamily: playfair,
          fontWeight: 700,
          fontSize: 52,
          color: "#FFFFFF",
          letterSpacing: 4,
          marginTop: 10,
          opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [60, 90], [20, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        Agentic AI Employees
      </div>

      <div style={{ height: 40 }} />
      <GoldDivider delay={100} width={480} />

      <div
        style={{
          fontFamily: inter,
          fontWeight: 300,
          fontSize: 34,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: 3,
          textAlign: "center",
          marginTop: 40,
          lineHeight: 1.5,
          opacity: interpolate(frame, [120, 160], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [120, 160], [20, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        Working <span style={{ color: "#FFB300", fontWeight: 700 }}>24/7</span> for your business
      </div>

      <div
        style={{
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 32,
          color: "#FFB300",
          letterSpacing: 6,
          textTransform: "uppercase",
          marginTop: 50,
          opacity: interpolate(frame, [200, 240], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [200, 240], [20, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        ~4 Roles Covered
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════
// SCENE 4: THE BENEFITS  —  Stats & Kayla
// ═══════════════════════════════════════════
const SceneBenefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.floor(
    interpolate(frame, [30, 120], [0, 18000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  const benefits = [
    { icon: "💰", label: "Saved Monthly", value: `$${count.toLocaleString()}+`, sub: "in operational costs" },
    { icon: "🤖", label: "Led by", value: "Kayla", sub: "Your AI Operations Manager" },
    { icon: "⚡", label: "Always On", value: "24/7", sub: "Never calls in sick" },
  ];

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 26,
          color: "#FFB300",
          letterSpacing: 10,
          textTransform: "uppercase",
          marginBottom: 60,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        What You Get
      </div>

      <div style={{ display: "flex", gap: 60, alignItems: "flex-start", justifyContent: "center" }}>
        {benefits.map((b, i) => {
          const sp = spring({ frame: frame - i * 35, fps, config: { damping: 15, stiffness: 90 } });
          const y = interpolate(sp, [0, 1], [60, 0]);
          const op = interpolate(frame - i * 35, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <div
              key={i}
              style={{
                transform: `translateY(${y}px)`,
                opacity: op,
                textAlign: "center",
                minWidth: 320,
                maxWidth: 360,
              }}
            >
              <div
                style={{
                  fontFamily: inter,
                  fontWeight: 500,
                  fontSize: 20,
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {b.label}
              </div>
              <div
                style={{
                  fontFamily: playfair,
                  fontWeight: 900,
                  fontSize: i === 0 ? 90 : 72,
                  color: "#FFB300",
                  lineHeight: 1.1,
                  letterSpacing: -2,
                  textShadow: "0 0 40px rgba(255,179,0,0.25)",
                }}
              >
                {b.value}
              </div>
              <div
                style={{
                  fontFamily: inter,
                  fontWeight: 300,
                  fontSize: 22,
                  color: "rgba(255,255,255,0.8)",
                  marginTop: 14,
                  letterSpacing: 1,
                }}
              >
                {b.sub}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ height: 60 }} />
      <GoldDivider delay={160} width={600} />

      <div
        style={{
          fontFamily: inter,
          fontWeight: 300,
          fontSize: 28,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: 3,
          textAlign: "center",
          marginTop: 40,
          lineHeight: 1.6,
          maxWidth: 900,
          opacity: interpolate(frame, [200, 250], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [200, 250], [20, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        From <span style={{ color: "#FFB300", fontWeight: 700 }}>sales</span> to{" "}
        <span style={{ color: "#FFB300", fontWeight: 700 }}>support</span> to{" "}
        <span style={{ color: "#FFB300", fontWeight: 700 }}>marketing</span> —
        <br />
        your AI team handles it all.
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════
// SCENE 5: CTA  —  "Visit 1325.ai"
// ═══════════════════════════════════════════
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSp = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });
  const logoScale = interpolate(logoSp, [0, 1], [0.65, 1]);
  const logoOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const lineW = interpolate(frame, [50, 80], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [70, 100], [20, 0], { extrapolateRight: "clamp" });

  const trialOp = interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" });
  const tagOp = interpolate(frame, [170, 200], [0, 1], { extrapolateRight: "clamp" });

  // Pulse glow
  const glow = interpolate(frame % 60, [0, 30, 60], [0.3, 0.6, 0.3]);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 60,
      }}
    >
      <div
        style={{
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 26,
          color: "#FFB300",
          letterSpacing: 10,
          textTransform: "uppercase",
          opacity: logoOp,
          marginBottom: 30,
        }}
      >
        Ready to scale?
      </div>

      {/* Logo */}
      <div
        style={{
          width: 480,
          height: 480,
          opacity: logoOp,
          transform: `scale(${logoScale})`,
          marginBottom: 10,
          filter: `drop-shadow(0 0 90px rgba(255,179,0,${glow}))`,
        }}
      >
        <Img
          src={staticFile("images/logo-1325ai.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          height: 2,
          width: lineW,
          background: "linear-gradient(90deg, transparent, #FFB300, transparent)",
          marginBottom: 36,
        }}
      />

      <div
        style={{
          fontFamily: inter,
          fontWeight: 300,
          fontSize: 56,
          color: "#FFFFFF",
          letterSpacing: 3,
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
          textAlign: "center",
        }}
      >
        Visit <span style={{ color: "#FFB300", fontWeight: 700 }}>1325.ai</span>
      </div>

      <div
        style={{
          marginTop: 32,
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 38,
          color: "#FFFFFF",
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: trialOp,
          transform: `translateY(${interpolate(frame, [120, 150], [15, 0], { extrapolateRight: "clamp" })}px)`,
          textAlign: "center",
        }}
      >
        30-Day Free Trial
      </div>

      <div
        style={{
          marginTop: 20,
          fontFamily: playfair,
          fontWeight: 700,
          fontSize: 28,
          color: "#FFB300",
          letterSpacing: 4,
          fontStyle: "italic",
          opacity: tagOp,
          transform: `translateY(${interpolate(frame, [170, 200], [15, 0], { extrapolateRight: "clamp" })}px)`,
          textAlign: "center",
        }}
      >
        Circulate Black Wealth
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════
// MAIN VIDEO COMPONENT
// ═══════════════════════════════════════════
export const ExplainerVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      {/* Logo bumper */}
      <Sequence from={0} durationInFrames={INTRO}>
        <LogoBumper size={880} />
      </Sequence>

      {/* Main content */}
      <Sequence from={INTRO}>
        <AbsoluteFill style={{ backgroundColor: "#000814" }}>
          <CinematicBg totalFrames={EXPLAINER_TOTAL - INTRO} />

          {/* Scene 1: Hook */}
          <Sequence from={0} durationInFrames={S1}>
            <SceneHook />
          </Sequence>

          {/* Scene 2: Problem */}
          <Sequence from={S1} durationInFrames={S2}>
            <SceneProblem />
          </Sequence>

          {/* Scene 3: Solution */}
          <Sequence from={S1 + S2} durationInFrames={S3}>
            <SceneSolution />
          </Sequence>

          {/* Scene 4: Benefits */}
          <Sequence from={S1 + S2 + S3} durationInFrames={S4}>
            <SceneBenefits />
          </Sequence>

          {/* Scene 5: CTA */}
          <Sequence from={S1 + S2 + S3 + S4} durationInFrames={S5}>
            <SceneCTA />
          </Sequence>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
