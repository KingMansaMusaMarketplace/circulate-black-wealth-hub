import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface Props {
  totalFrames: number;
}

export const CinematicBg = ({ totalFrames }: Props) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.015) * 0.04 + 0.96;
  const drift = interpolate(frame, [0, totalFrames], [0, 60]);

  return (
    <AbsoluteFill>
      {/* Deep navy base — Mansa Blue */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(140deg, #000814 0%, #001028 35%, #001D3D 70%, #000814 100%)",
        }}
      />

      {/* Mansa Gold ambient glow — top right */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "-15%",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,179,0,${0.10 * pulse}) 0%, transparent 65%)`,
          filter: "blur(100px)",
          transform: `translate(${Math.sin(frame * 0.008) * 40 - drift * 0.3}px, ${Math.cos(frame * 0.006) * 30}px)`,
        }}
      />

      {/* Cooler blue ambient — bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,116,217,0.12) 0%, transparent 70%)",
          filter: "blur(90px)",
          transform: `translate(${Math.cos(frame * 0.009) * 35 + drift * 0.2}px, ${Math.sin(frame * 0.007) * 20}px)`,
        }}
      />

      {/* Subtle film grain via noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' /></filter><rect width='100%25' height='100%25' filter='url(%23n)' /></svg>\")",
          mixBlendMode: "overlay",
        }}
      />

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
