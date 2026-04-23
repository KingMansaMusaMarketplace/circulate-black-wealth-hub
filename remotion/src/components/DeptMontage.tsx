import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["300", "500", "700"], subsets: ["latin"] });

interface Props {
  image: string;
  department: string;
  members: string[]; // list of "## · Title" strings
  accent?: string;
}

export const DeptMontage = ({ image, department, members, accent = "#FFB300" }: Props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.1]);
  const bgOp = interpolate(frame, [0, 20], [0, 0.55], { extrapolateRight: "clamp" });

  const titleSpring = spring({ frame, fps, config: { damping: 16, stiffness: 80 } });
  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  const lineW = interpolate(frame, [25, 55], [0, 600], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000814" }}>
      {/* Bg image */}
      <div style={{ position: "absolute", inset: 0, opacity: bgOp, transform: `scale(${bgScale})` }}>
        <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,8,20,0.4), rgba(0,8,20,0.85))" }} />

      {/* Content */}
      <AbsoluteFill style={{ padding: "100px 120px", flexDirection: "column", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 26,
            color: accent,
            letterSpacing: 12,
            textTransform: "uppercase",
            opacity: titleOp,
            transform: `translateY(${titleY * 0.5}px)`,
            marginBottom: 18,
          }}
        >
          Department
        </div>
        <div
          style={{
            fontFamily: playfair,
            fontWeight: 900,
            fontSize: 132,
            color: "#FFFFFF",
            lineHeight: 0.95,
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
            marginBottom: 24,
          }}
        >
          {department}
        </div>
        <div style={{ height: 3, width: lineW, background: `linear-gradient(90deg, ${accent}, transparent)`, marginBottom: 60 }} />

        {/* Members grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "28px 80px", maxWidth: 1500 }}>
          {members.map((m, i) => {
            const memberFrame = frame - 50 - i * 8;
            const op = interpolate(memberFrame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const tx = interpolate(memberFrame, [0, 18], [-40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const [num, ...rest] = m.split(" · ");
            return (
              <div key={i} style={{ opacity: op, transform: `translateX(${tx}px)`, display: "flex", alignItems: "baseline", gap: 22 }}>
                <span style={{ fontFamily: playfair, fontWeight: 900, fontSize: 56, color: accent, minWidth: 90 }}>{num}</span>
                <span style={{ fontFamily: inter, fontWeight: 500, fontSize: 32, color: "#FFFFFF", letterSpacing: 1 }}>{rest.join(" · ")}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
