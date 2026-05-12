import { AbsoluteFill, Audio, Sequence, Series, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Img } from "remotion";
import { CinematicBg } from "./components/CinematicBg";
import { KineticTitle } from "./components/KineticTitle";
import { LogoBumper } from "./components/LogoBumper";
import { GoldDivider } from "./components/GoldDivider";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadPlayfair("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

const GOLD = "#FFB300";
const NAVY = "#003366";

// 30fps. Logo bumper 60f + content 2880f = 2940f total = 98s.
const INTRO = 60;
const SCENES = [
  { id: "hook",      dur: 330, vo: "dc/s1-hook.mp3"      },
  { id: "problem",   dur: 330, vo: null                  },
  { id: "thesis",    dur: 300, vo: "dc/s3-thesis.mp3"    },
  { id: "agents",    dur: 330, vo: "dc/s4-agents.mp3"    },
  { id: "flywheel",  dur: 330, vo: null                  },
  { id: "math",      dur: 360, vo: "dc/s6-math.mp3"      },
  { id: "impact",    dur: 330, vo: null                  },
  { id: "manifesto", dur: 330, vo: "dc/s8-manifesto.mp3" },
  { id: "closing",   dur: 240, vo: "dc/s9-closing.mp3"   },
];
export const DC_TOTAL = INTRO + SCENES.reduce((a, s) => a + s.dur, 0);

const sceneByName: Record<string, React.FC> = {
  hook: SceneHook,
  problem: SceneProblem,
  thesis: SceneThesis,
  agents: SceneAgents,
  flywheel: SceneFlywheel,
  math: SceneMath,
  impact: SceneImpact,
  manifesto: SceneManifesto,
  closing: SceneClosing,
};

export const DirectorsCutVideo: React.FC = () => {
  // Compute VO offsets relative to scene start (each scene's VO starts ~30f in)
  let cursor = INTRO;
  const voTracks: { offset: number; src: string }[] = [];
  for (const s of SCENES) {
    if (s.vo) voTracks.push({ offset: cursor + 20, src: s.vo });
    cursor += s.dur;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Logo bumper */}
      <Sequence from={0} durationInFrames={INTRO}>
        <LogoBumper size={760} />
      </Sequence>

      {/* Continuous background after intro */}
      <Sequence from={INTRO}>
        <AbsoluteFill style={{ backgroundColor: "#000000" }}>
          <CinematicBg totalFrames={DC_TOTAL - INTRO} />
        </AbsoluteFill>
      </Sequence>

      {/* Scenes */}
      <Sequence from={INTRO}>
        <Series>
          {SCENES.map((s) => {
            const Comp = sceneByName[s.id];
            return (
              <Series.Sequence key={s.id} durationInFrames={s.dur}>
                <Comp />
              </Series.Sequence>
            );
          })}
        </Series>
      </Sequence>

      {/* Music bed (ducked under VO via volume curve approximation: constant low) */}
      <Audio src={staticFile("audio/dc/bed.mp3")} volume={0.28} />

      {/* VO tracks */}
      {voTracks.map((t, i) => (
        <Sequence key={i} from={t.offset}>
          <Audio src={staticFile(`audio/${t.src}`)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// =================================================================
// SCENES
// =================================================================

function Eyebrow({ label, delay = 4 }: { label: string; delay?: number }) {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <div style={{
      fontFamily: inter, fontWeight: 500, fontSize: 22, color: GOLD,
      letterSpacing: 10, textTransform: "uppercase", opacity: op,
    }}>
      {label}
    </div>
  );
}

function FadeIn({ children, delay = 0, duration = 18, style }: { children: React.ReactNode; delay?: number; duration?: number; style?: React.CSSProperties }) {
  const frame = useCurrentFrame();
  const op = interpolate(frame - delay, [0, duration], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return <div style={{ opacity: op, ...style }}>{children}</div>;
}

function SceneHook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Phase 1 (0-150): big number reveal. Phase 2 (150-330): "less than 2%"
  const phase = frame < 165 ? 0 : 1;

  const sp = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 80 } });
  const scale = interpolate(sp, [0, 1], [0.7, 1]);
  const opNum = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const opNumOut = interpolate(frame, [140, 165], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 80 }}>
      {phase === 0 && (
        <>
          <div style={{ marginBottom: 30, opacity: opNumOut }}>
            <Eyebrow label="The Black Economy" />
          </div>
          <div style={{
            fontFamily: playfair, fontWeight: 900, fontSize: 280, color: GOLD,
            lineHeight: 1, letterSpacing: -8, opacity: opNum * opNumOut, transform: `scale(${scale})`,
            textShadow: "0 0 120px rgba(255,179,0,0.5)",
          }}>
            $1.6T
          </div>
          <div style={{ marginTop: 24, opacity: opNumOut }}>
            <FadeIn delay={70}>
              <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 36, color: "#FFFFFF", letterSpacing: 4, textAlign: "center" }}>
                spent every year by the Black community
              </div>
            </FadeIn>
          </div>
        </>
      )}
      {phase === 1 && (
        <SceneHookPhase2 startFrame={165} />
      )}
    </AbsoluteFill>
  );
}

function SceneHookPhase2({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame() - startFrame;
  const op = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [140, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sp = spring({ frame: frame - 20, fps: 30, config: { damping: 14, stiffness: 80 } });
  const scale = interpolate(sp, [0, 1], [0.7, 1]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: opOut }}>
      <div style={{ opacity: op, marginBottom: 30 }}>
        <Eyebrow label="What Stays Home" />
      </div>
      <div style={{
        fontFamily: playfair, fontWeight: 900, fontSize: 320, color: "#FFFFFF",
        lineHeight: 1, letterSpacing: -8, opacity: op, transform: `scale(${scale})`,
        textShadow: "0 0 80px rgba(255,255,255,0.2)",
      }}>
        &lt;2%
      </div>
      <div style={{ marginTop: 24 }}>
        <FadeIn delay={50}>
          <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 36, color: GOLD, letterSpacing: 4, textAlign: "center" }}>
            stays in our community
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

function SceneProblem() {
  const frame = useCurrentFrame();
  // Bar drains from full to ~2% over 0->210
  const fill = interpolate(frame, [40, 220], [1, 0.02], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const op = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const labelOp = interpolate(frame, [220, 250], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const opOut = interpolate(frame, [300, 325], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 80, opacity: opOut }}>
      <div style={{ opacity: op, marginBottom: 50 }}>
        <Eyebrow label="The Leak" />
      </div>
      <div style={{ opacity: op, marginBottom: 40 }}>
        <KineticTitle text="Every dollar leaves" size={72} delay={6} />
      </div>
      <div style={{ width: 1100, height: 70, background: "rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,179,0,0.25)", opacity: op }}>
        <div style={{
          width: `${fill * 100}%`, height: "100%",
          background: `linear-gradient(90deg, ${NAVY}, ${GOLD})`,
          boxShadow: "0 0 40px rgba(255,179,0,0.55)",
          transition: "none",
        }} />
      </div>
      <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", width: 1100, fontFamily: inter, fontWeight: 500, fontSize: 24, color: "rgba(255,255,255,0.7)", letterSpacing: 4, opacity: op }}>
        <span>$1.6T enters</span>
        <span style={{ color: GOLD }}>{`<2% remains`}</span>
      </div>
      <div style={{ marginTop: 60, opacity: labelOp, fontFamily: playfair, fontStyle: "italic", fontWeight: 700, fontSize: 56, color: GOLD, textAlign: "center" }}>
        Wealth doesn't circulate. It evaporates.
      </div>
    </AbsoluteFill>
  );
}

function SceneThesis() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const logoScale = interpolate(sp, [0, 1], [0.6, 1]);
  const logoOp = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [270, 295], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 80, opacity: opOut }}>
      <Img src={staticFile("images/logo-1325ai.png")} style={{
        width: 220, height: 220, objectFit: "contain", opacity: logoOp,
        transform: `scale(${logoScale})`, filter: "drop-shadow(0 0 50px rgba(255,179,0,0.55))",
        marginBottom: 30,
      }} />
      <div style={{ marginBottom: 24 }}><Eyebrow label="1325 · A I" delay={20} /></div>
      <KineticTitle text="The operating system" size={92} delay={48} />
      <div style={{ height: 8 }} />
      <KineticTitle text="for community wealth." size={108} italic color={GOLD} delay={80} />
      <div style={{ marginTop: 40 }}><GoldDivider delay={140} width={520} /></div>
      <FadeIn delay={170}>
        <div style={{ marginTop: 26, fontFamily: inter, fontWeight: 300, fontSize: 30, color: "rgba(255,255,255,0.85)", letterSpacing: 3, textAlign: "center" }}>
          Built to bring economic power <span style={{ color: GOLD, fontWeight: 600 }}>back home.</span>
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
}

function SceneAgents() {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [300, 325], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 33 tiles in 11x3 grid
  const cols = 11, rows = 3;
  const tiles: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const d = 60 + i * 4;
      const t = interpolate(frame - d, [0, 18], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
      const isKayla = i === 16; // center-ish
      tiles.push(
        <div key={i} style={{
          width: 78, height: 78, borderRadius: 12,
          background: isKayla
            ? `radial-gradient(circle, ${GOLD} 0%, rgba(255,179,0,0.4) 100%)`
            : `linear-gradient(135deg, rgba(0,51,102,${0.3 + t * 0.4}), rgba(255,179,0,${t * 0.3}))`,
          border: `1px solid rgba(255,179,0,${0.2 + t * 0.5})`,
          opacity: t,
          transform: `scale(${0.7 + t * 0.3})`,
          boxShadow: isKayla ? "0 0 40px rgba(255,179,0,0.8)" : `0 0 ${t * 12}px rgba(255,179,0,0.3)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: inter, fontWeight: 700, fontSize: 14, color: isKayla ? "#000" : "rgba(255,255,255,0.7)",
        }}>
          {isKayla ? "K" : `#${(i + 1).toString().padStart(2, "0")}`}
        </div>
      );
    }
  }

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 80, opacity: opOut }}>
      <div style={{ opacity: op, marginBottom: 30 }}><Eyebrow label="Your AI C-Suite" /></div>
      <KineticTitle text="33 agents." size={96} delay={20} />
      <div style={{ height: 8 }} />
      <KineticTitle text="One Kayla." size={112} italic color={GOLD} delay={50} />
      <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: `repeat(${cols}, 78px)`, gap: 14, opacity: op }}>
        {tiles}
      </div>
      <FadeIn delay={240}>
        <div style={{ marginTop: 40, fontFamily: inter, fontWeight: 500, fontSize: 22, color: "rgba(255,255,255,0.7)", letterSpacing: 6, textTransform: "uppercase", textAlign: "center" }}>
          A full executive team — for every Black-owned business
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
}

function SceneFlywheel() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rot = interpolate(frame, [0, 330], [0, 180]);
  const op = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [300, 325], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(spring({ frame, fps, config: { damping: 14, stiffness: 70 } }), [0, 1], [0.7, 1]);
  const labels = ["CONNECT", "MONETIZE", "AMPLIFY", "LOOP"];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: opOut }}>
      <div style={{ opacity: op, marginBottom: 110 }}><Eyebrow label="The CMAL Flywheel" /></div>
      <div style={{ position: "relative", width: 540, height: 540, opacity: op, transform: `scale(${scale})` }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: `2px solid rgba(255,179,0,0.45)`,
          transform: `rotate(${rot}deg)`,
          boxShadow: "0 0 60px rgba(255,179,0,0.25), inset 0 0 60px rgba(255,179,0,0.1)",
        }} />
        <div style={{
          position: "absolute", inset: 90, borderRadius: "50%",
          border: "1px solid rgba(255,179,0,0.25)",
          transform: `rotate(${-rot * 1.4}deg)`,
        }} />
        {labels.map((label, i) => {
          const angle = (i * 90 - 90) * (Math.PI / 180);
          const r = 230;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          const lop = interpolate(frame, [40 + i * 14, 60 + i * 14], [0, 1], { extrapolateRight: "clamp" });
          return (
            <div key={label} style={{
              position: "absolute", left: "50%", top: "50%",
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              fontFamily: playfair, fontWeight: 700, fontSize: 38, color: "#FFFFFF",
              letterSpacing: 3, opacity: lop, whiteSpace: "nowrap",
              textShadow: "0 0 30px rgba(0,0,0,0.8)",
            }}>{label}</div>
          );
        })}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("images/logo-1325ai.png")} style={{
            width: 180, height: 180, objectFit: "contain",
            opacity: interpolate(frame, [50, 80], [0, 1], { extrapolateRight: "clamp" }),
            filter: "drop-shadow(0 0 40px rgba(255,179,0,0.55))",
          }} />
        </div>
      </div>
      <FadeIn delay={150} style={{ marginTop: 40 }}>
        <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 26, color: "rgba(255,255,255,0.8)", letterSpacing: 4, textAlign: "center" }}>
          A self-reinforcing engine for circulation.
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
}

function SceneMath() {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [330, 358], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const stats = [
    { d: 40,  big: "$2M+", label: "C-Suite cost", sub: "what hiring this team would cost", color: "#FFFFFF" },
    { d: 130, big: "$299", label: "per month",    sub: "your 1325.AI subscription",       color: GOLD },
    { d: 220, big: "$12,100+", label: "saved monthly", sub: "~4 roles covered",            color: GOLD },
  ];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 80, opacity: opOut }}>
      <div style={{ opacity: op, marginBottom: 50 }}><Eyebrow label="The Math" /></div>
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        {stats.map((s, i) => {
          const t = interpolate(frame - s.d, [0, 24], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const sp = spring({ frame: frame - s.d, fps: 30, config: { damping: 16, stiffness: 95 } });
          const sc = interpolate(sp, [0, 1], [0.7, 1]);
          return (
            <div key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              opacity: t, transform: `scale(${sc})`,
              padding: 30, minWidth: 320,
              borderRight: i < 2 ? "1px solid rgba(255,179,0,0.3)" : "none",
            }}>
              <div style={{
                fontFamily: playfair, fontWeight: 900, fontSize: 110,
                color: s.color, lineHeight: 1, letterSpacing: -3,
                textShadow: s.color === GOLD ? "0 0 60px rgba(255,179,0,0.4)" : "none",
              }}>{s.big}</div>
              <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 22, color: "#FFFFFF", letterSpacing: 4, textTransform: "uppercase" }}>{s.label}</div>
              <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 18, color: "rgba(255,255,255,0.6)", letterSpacing: 1, textAlign: "center" }}>{s.sub}</div>
            </div>
          );
        })}
      </div>
      <FadeIn delay={290} style={{ marginTop: 50 }}>
        <div style={{ fontFamily: playfair, fontStyle: "italic", fontWeight: 700, fontSize: 44, color: GOLD, textAlign: "center" }}>
          ROI on day one.
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
}

function SceneImpact() {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [300, 325], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 3 nodes in a triangle: Customers -> Businesses -> HBCUs -> back
  const nodes = [
    { x: 0, y: -180, label: "Customers" },
    { x: 200, y: 130, label: "Businesses" },
    { x: -200, y: 130, label: "HBCUs" },
  ];

  // Pulsing dollars travel along each edge
  const phase = (frame % 90) / 90; // 0->1 loop
  const tokens = [0, 1, 2].map((i) => {
    const a = nodes[i];
    const b = nodes[(i + 1) % 3];
    const t = (phase + i * 0.33) % 1;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: opOut }}>
      <div style={{ opacity: op, marginBottom: 40 }}><Eyebrow label="Wealth That Circulates" /></div>
      <div style={{ position: "relative", width: 700, height: 500, opacity: op }}>
        {/* Edges */}
        <svg width="700" height="500" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform="translate(350,250)">
            {[0, 1, 2].map((i) => {
              const a = nodes[i], b = nodes[(i + 1) % 3];
              return (
                <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={GOLD} strokeWidth={1.5} strokeDasharray="4 8" opacity={0.5} />
              );
            })}
          </g>
        </svg>
        {/* Nodes */}
        {nodes.map((n, i) => {
          const d = 30 + i * 20;
          const t = interpolate(frame - d, [0, 24], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <div key={i} style={{
              position: "absolute", left: "50%", top: "50%",
              transform: `translate(${n.x}px, ${n.y}px) translate(-50%, -50%) scale(${0.7 + t * 0.3})`,
              opacity: t,
              width: 150, height: 150, borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,179,0,0.3), rgba(0,51,102,0.6))`,
              border: `2px solid ${GOLD}`,
              boxShadow: "0 0 40px rgba(255,179,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: inter, fontWeight: 700, fontSize: 22, color: "#FFFFFF", letterSpacing: 1.5,
              textAlign: "center",
            }}>{n.label}</div>
          );
        })}
        {/* Dollar tokens */}
        {tokens.map((tok, i) => (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "50%",
            transform: `translate(${tok.x}px, ${tok.y}px) translate(-50%, -50%)`,
            width: 36, height: 36, borderRadius: "50%",
            background: GOLD,
            boxShadow: "0 0 24px rgba(255,179,0,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: inter, fontWeight: 900, fontSize: 18, color: "#000",
            opacity: op,
          }}>$</div>
        ))}
      </div>
      <FadeIn delay={170} style={{ marginTop: 20 }}>
        <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 28, color: GOLD, letterSpacing: 4, textAlign: "center" }}>
          Every dollar loops. Every loop compounds.
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
}

function SceneManifesto() {
  const frame = useCurrentFrame();
  const opOut = interpolate(frame, [300, 325], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 80, opacity: opOut }}>
      <div style={{ marginBottom: 28 }}>
        <FadeIn delay={4}>
          <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, color: "rgba(255,255,255,0.6)", letterSpacing: 10, textTransform: "uppercase", textAlign: "center" }}>
            This isn't a directory.
          </div>
        </FadeIn>
      </div>
      <KineticTitle text="It's an" size={86} delay={24} />
      <div style={{ height: 8 }} />
      <KineticTitle text="Agentic Commerce" size={130} italic color={GOLD} delay={52} />
      <div style={{ height: 8 }} />
      <KineticTitle text="Protocol." size={130} italic color={GOLD} delay={92} />
      <div style={{ marginTop: 40 }}><GoldDivider delay={170} width={560} /></div>
      <FadeIn delay={200}>
        <div style={{ marginTop: 28, fontFamily: inter, fontWeight: 300, fontSize: 30, color: "rgba(255,255,255,0.88)", letterSpacing: 3, textAlign: "center", maxWidth: 1200 }}>
          Capital that <span style={{ color: GOLD, fontWeight: 600 }}>stays home.</span>{"  ·  "}
          Wealth that <span style={{ color: GOLD, fontWeight: 600 }}>compounds.</span>{"  ·  "}
          Power that <span style={{ color: GOLD, fontWeight: 600 }}>circulates.</span>
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
}

function SceneClosing() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 16, stiffness: 80 } });
  const sc = interpolate(sp, [0, 1], [0.7, 1]);
  const op = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const opOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: opOut }}>
      <Img src={staticFile("images/logo-1325ai.png")} style={{
        width: 260, height: 260, objectFit: "contain", opacity: op, transform: `scale(${sc})`,
        filter: "drop-shadow(0 0 60px rgba(255,179,0,0.6))", marginBottom: 40,
      }} />
      <div style={{
        fontFamily: playfair, fontWeight: 900, fontSize: 160, color: "#FFFFFF",
        letterSpacing: -4, opacity: op, lineHeight: 1,
      }}>
        1325<span style={{ color: GOLD }}>.AI</span>
      </div>
      <div style={{ marginTop: 30 }}><GoldDivider delay={50} width={520} /></div>
      <FadeIn delay={80} style={{ marginTop: 28 }}>
        <div style={{ fontFamily: inter, fontWeight: 300, fontSize: 32, color: "rgba(255,255,255,0.9)", letterSpacing: 6, textAlign: "center", textTransform: "uppercase" }}>
          The future is already here.
        </div>
      </FadeIn>
      <FadeIn delay={130} style={{ marginTop: 18 }}>
        <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 28, color: GOLD, letterSpacing: 4, textAlign: "center" }}>
          Visit 1325.ai
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
}
