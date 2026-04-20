import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";

interface Props {
  src: string;
  durationInFrames: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  vignette?: boolean;
  tint?: string; // overlay color (rgba)
}

// Cinematic Ken-Burns image with slow push/pan + vignette + optional tint
export const CinematicImage = ({
  src,
  durationInFrames,
  zoomFrom = 1.05,
  zoomTo = 1.18,
  panX = 0,
  panY = 0,
  vignette = true,
  tint,
}: Props) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(t, [0, 1], [zoomFrom, zoomTo]);
  const tx = interpolate(t, [0, 1], [0, panX]);
  const ty = interpolate(t, [0, 1], [0, panY]);

  // Fade in/out
  const opacity = interpolate(
    frame,
    [0, 12, durationInFrames - 18, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          transformOrigin: "center center",
        }}
      />
      {tint && (
        <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply" }} />
      )}
      {vignette && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
