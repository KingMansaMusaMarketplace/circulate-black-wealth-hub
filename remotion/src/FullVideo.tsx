import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Img } from "remotion";
import { CinematicBg } from "./components/CinematicBg";
import { CinematicImage } from "./components/CinematicImage";
import { KineticTitle } from "./components/KineticTitle";
import { LogoBumper } from "./components/LogoBumper";
import { ClosingCTA } from "./components/ClosingCTA";
import { GoldDivider } from "./components/GoldDivider";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

// 102s @ 30fps = 3060 frames. 36-frame intro bumper + 3024 frames of content.
const INTRO = 36;
const TOTAL = 3060;
const BODY = TOTAL - INTRO; // 3024

// Scene timings (in frames, relative to body start at INTRO)
// VO total ~99.75s = 2992 frames. Pad scenes to 3024.
//  S1 Hook         "Most directories... different."         0    -> 270   (270f, ~9s)
//  S2 Signup       "Joining is free... Loyalty Graph"       270  -> 540   (270f, 9s)
//  S3 Flywheel     "Every interaction... Flywheel"          540  -> 720   (180f, 6s)
//  S4 CONNECT                                                720  -> 1140  (420f, 14s)
//  S5 MONETIZE                                              1140 -> 1530  (390f, 13s)
//  S6 AMPLIFY                                               1530 -> 1920  (390f, 13s)
//  S7 LOOP                                                  1920 -> 2280  (360f, 12s)
//  S8 Manifesto    "This isn't a directory..."              2280 -> 2580  (300f, 10s)
//  S9 CTA close    "Visit 1325.AI..."                       2580 -> 3024  (444f, ~14.8s)

export const FullVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000814" }}>
      <Sequence from={0} durationInFrames={INTRO}>
        <LogoBumper size={760} />
      </Sequence>

      <Sequence from={INTRO}>
        <AbsoluteFill style={{ backgroundColor: "#000814" }}>
          <CinematicBg totalFrames={BODY} />
          <Audio src={staticFile("audio/vo-90.mp3")} volume={1} />

          {/* S1 — Hook */}
          <Sequence from={0} durationInFrames={270}>
            <SceneHook />
          </Sequence>

          {/* S2 — Signup */}
          <Sequence from={270} durationInFrames={270}>
            <SceneSignup />
          </Sequence>

          {/* S3 — Flywheel intro */}
          <Sequence from={540} durationInFrames={180}>
            <SceneFlywheelIntro />
          </Sequence>

          {/* S4 — CONNECT */}
          <Sequence from={720} durationInFrames={420}>
            <SceneCMAL
              label="01 · CONNECT"
              headline="Discover"
              accent="36,000+ verified."
              image="images/community.jpg"
              bullets={["Branded QR onboarding", "Earn instantly in-store", "HBCU partner discounts"]}
            />
          </Sequence>

          {/* S5 — MONETIZE */}
          <Sequence from={1140} durationInFrames={390}>
            <SceneCMAL
              label="02 · MONETIZE"
              headline="Points that"
              accent="travel."
              image="images/qr-scan.jpg"
              bullets={["Cross-business loyalty", "Mansa Stays redemption", "Digital Susu Circles"]}
            />
          </Sequence>

          {/* S6 — AMPLIFY */}
          <Sequence from={1530} durationInFrames={390}>
            <SceneCMAL
              label="03 · AMPLIFY"
              headline="Meet"
              accent="Kayla."
              image="images/owner-1.jpg"
              bullets={["CEO-class AI concierge", "28 specialized agents", "AI-driven review engine"]}
            />
          </Sequence>

          {/* S7 — LOOP */}
          <Sequence from={1920} durationInFrames={360}>
            <SceneCMAL
              label="04 · LOOP"
              headline="Wealth that"
              accent="circulates."
              image="images/customer.jpg"
              bullets={["Refer friends & businesses", "Real-time Impact Score", "Generational wealth"]}
            />
          </Sequence>

          {/* S8 — Manifesto */}
          <Sequence from={2280} durationInFrames={300}>
            <SceneManifesto />
          </Sequence>

          {/* S9 — Closing CTA */}
          <Sequence from={2580} durationInFrames={480}>
            <ClosingCTA />
          </Sequence>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================================
// SCENES
// ============================================================

const SceneHook = () => {
  return (
    <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", padding: "0 140px", flexDirection: "column" }}>
      <div style={{
        fontFamily: inter, fontWeight: 500, fontSize: 24, color: "#FFB300",
        letterSpacing: 10, textTransform: "uppercase", marginBottom: 36,
      }}>
        <FadeIn delay={6}>─── The Problem</FadeIn>
      </div>
      <KineticTitle text="Most directories" size={120} delay={14} align="left" />
      <div style={{ height: 18 }} />
      <KineticTitle text="are static lists." size={120} delay={42} align="left" />
      <div style={{ height: 36 }} />
      <KineticTitle text="We built something else." size={86} italic color="#FFB300" delay={150} align="left" />
    </AbsoluteFill>
  );
};

const SceneSignup = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 95 } });
  const scale = interpolate(sp, [0, 1], [0.6, 1]);
  const op = interpolate(frame, [12, 32], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{
        fontFamily: inter, fontWeight: 500, fontSize: 26, color: "rgba(255,255,255,0.7)",
        letterSpacing: 10, textTransform: "uppercase", marginBottom: 30, opacity: op,
      }}>
        Join in
      </div>
      <div style={{
        fontFamily: playfair, fontWeight: 900, fontSize: 200, color: "#FFB300",
        lineHeight: 1, letterSpacing: -6, opacity: op, transform: `scale(${scale})`,
        textShadow: "0 0 100px rgba(255,179,0,0.35)",
      }}>
        30-seconds
      </div>
      <div style={{ marginTop: 20 }}>
        <GoldDivider delay={50} width={520} />
      </div>
      <div style={{
        marginTop: 32, fontFamily: inter, fontWeight: 300, fontSize: 38, color: "#FFFFFF",
        letterSpacing: 3, textAlign: "center",
        opacity: interpolate(frame, [60, 85], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        No credit card. <span style={{ color: "#FFB300", fontWeight: 700 }}>Free, forever.</span>
      </div>
      <div style={{
        marginTop: 100, fontFamily: inter, fontWeight: 500, fontSize: 22, color: "rgba(255,179,0,0.85)",
        letterSpacing: 6, textTransform: "uppercase",
        opacity: interpolate(frame, [150, 180], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Patent-pending Loyalty Graph · cross-business points
      </div>
    </AbsoluteFill>
  );
};

const SceneFlywheelIntro = () => {
  const frame = useCurrentFrame();
  const rot = interpolate(frame, [0, 180], [0, 90]);
  const op = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(spring({ frame, fps: 30, config: { damping: 14, stiffness: 80 } }), [0, 1], [0.7, 1]);

  const labels = ["CONNECT", "MONETIZE", "AMPLIFY", "LOOP"];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{
        fontFamily: inter, fontWeight: 500, fontSize: 22, color: "#FFB300",
        letterSpacing: 10, textTransform: "uppercase", marginBottom: 90, opacity: op,
      }}>
        ─── The CMAL Flywheel
      </div>
      <div style={{ position: "relative", width: 560, height: 560, opacity: op, transform: `scale(${scale})` }}>
        {/* Outer ring */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "2px solid rgba(255,179,0,0.4)",
          transform: `rotate(${rot}deg)`,
          boxShadow: "0 0 60px rgba(255,179,0,0.2), inset 0 0 60px rgba(255,179,0,0.1)",
        }} />
        {/* Inner pulse */}
        <div style={{
          position: "absolute", inset: 100, borderRadius: "50%",
          border: "1px solid rgba(255,179,0,0.25)",
          transform: `rotate(${-rot * 1.5}deg)`,
        }} />
        {/* Quadrant labels */}
        {labels.map((label, i) => {
          const angle = (i * 90 - 90) * (Math.PI / 180);
          const r = 330;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          const lop = interpolate(frame, [30 + i * 12, 50 + i * 12], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={label} style={{
              position: "absolute", left: "50%", top: "50%",
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              fontFamily: playfair, fontWeight: 700, fontSize: 42, color: "#FFFFFF",
              letterSpacing: 3, opacity: lop, whiteSpace: "nowrap",
              textShadow: "0 0 30px rgba(0,0,0,0.8)",
            }}>
              {label}
            </div>
          );
        })}
        {/* Center logo mark */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Img src={staticFile("images/logo-1325ai.png")} style={{
            width: 200, height: 200, objectFit: "contain",
            opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" }),
            filter: "drop-shadow(0 0 40px rgba(255,179,0,0.5))",
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

interface CMALProps {
  label: string;
  headline: string;
  accent: string;
  image: string;
  bullets: string[];
}

const SceneCMAL = ({ label, headline, accent, image, bullets }: CMALProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Image fills right half */}
      <div style={{
        position: "absolute", right: 0, top: 0, width: "55%", height: "100%",
        opacity: interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" }),
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 25%)",
      }}>
        <CinematicImage src={image} durationInFrames={420} zoomFrom={1.05} zoomTo={1.18} tint="rgba(0,8,20,0.35)" vignette={false} />
      </div>

      {/* Left text panel */}
      <div style={{
        position: "absolute", left: 100, top: 0, bottom: 0, width: "55%",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{
          fontFamily: inter, fontWeight: 500, fontSize: 22, color: "#FFB300",
          letterSpacing: 8, textTransform: "uppercase", marginBottom: 32,
          opacity: interpolate(frame, [4, 24], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          {label}
        </div>
        <KineticTitle text={headline} size={96} delay={10} align="left" />
        <div style={{ height: 8 }} />
        <KineticTitle text={accent} size={108} italic color="#FFB300" delay={32} align="left" />
        <div style={{ marginTop: 50 }}>
          <GoldDivider delay={70} width={320} />
        </div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 22 }}>
          {bullets.map((b, i) => {
            const d = 90 + i * 16;
            const sp = spring({ frame: frame - d, fps, config: { damping: 18, stiffness: 110 } });
            const x = interpolate(sp, [0, 1], [-30, 0]);
            const op = interpolate(frame - d, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 18,
                opacity: op, transform: `translateX(${x}px)`,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFB300", boxShadow: "0 0 16px rgba(255,179,0,0.7)" }} />
                <div style={{
                  fontFamily: inter, fontWeight: 500, fontSize: 30, color: "rgba(255,255,255,0.92)", letterSpacing: 0.5,
                }}>
                  {b}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneManifesto = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 80 }}>
      <div style={{
        fontFamily: inter, fontWeight: 500, fontSize: 22, color: "rgba(255,255,255,0.6)",
        letterSpacing: 10, textTransform: "uppercase", marginBottom: 30,
        opacity: interpolate(frame, [4, 22], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        This isn't a directory.
      </div>
      <KineticTitle text="It's an" size={92} delay={20} />
      <div style={{ height: 8 }} />
      <KineticTitle text="Agentic Commerce" size={132} italic color="#FFB300" delay={48} />
      <div style={{ height: 8 }} />
      <KineticTitle text="Protocol." size={132} italic color="#FFB300" delay={84} />
      <div style={{ marginTop: 40 }}>
        <GoldDivider delay={150} width={520} />
      </div>
      <div style={{
        marginTop: 36, fontFamily: inter, fontWeight: 300, fontSize: 32, color: "rgba(255,255,255,0.85)",
        letterSpacing: 3, textAlign: "center", maxWidth: 1200,
        opacity: interpolate(frame, [170, 200], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        High-end AI · Cross-market rewards · Capital that <span style={{ color: "#FFB300", fontWeight: 500 }}>stays home.</span>
      </div>
    </AbsoluteFill>
  );
};

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return <span style={{ opacity: op }}>{children}</span>;
};
