import { useCurrentFrame, interpolate } from "remotion";

interface Props {
  delay?: number;
  width?: number;
}

export const GoldDivider = ({ delay = 0, width = 400 }: Props) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - delay, [0, 25], [0, width], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  return (
    <div
      style={{
        height: 2,
        width: w,
        background: "linear-gradient(90deg, transparent, #FFB300, transparent)",
        boxShadow: "0 0 20px rgba(255,179,0,0.5)",
      }}
    />
  );
};
