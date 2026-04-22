import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

type Props = {
  size?: number;
  vertical?: boolean;
};

// Quick brand bumper — logo punches in, holds, then fades out.
// Designed to live in a Sequence of ~36 frames (1.2s @ 30fps).
export const LogoBumper = ({ size = 760, vertical = false }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Punch in
  const sp = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });
  const scale = interpolate(sp, [0, 1], [0.78, 1]);

  // Visible immediately at frame 0; hold; fade out at the end
  const opacity = interpolate(frame, [28, 36], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glow pulse
  const glow = interpolate(frame, [0, 18, 36], [0.3, 0.6, 0.3]);

  const dim = vertical ? Math.max(size, 920) : size;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#000814" }}>
      <div
        style={{
          width: dim,
          height: dim,
          opacity,
          transform: `scale(${scale})`,
          WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 92%)",
          maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 92%)",
          filter: `drop-shadow(0 0 120px rgba(255,179,0,${glow}))`,
        }}
      >
        <Img src={staticFile("images/logo-1325ai.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
    </AbsoluteFill>
  );
};
