import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const PersistentBackground = () => {
  const frame = useCurrentFrame();

  // Slowly shifting gradient
  const hueShift = interpolate(frame, [0, 900], [0, 30]);
  const pulse = Math.sin(frame * 0.02) * 0.03 + 0.97;

  return (
    <AbsoluteFill>
      {/* Deep black base */}
      <div style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, #000000 0%, #030712 40%, #0a0a1a 100%)`,
      }} />

      {/* Subtle gold ambient glow */}
      <div style={{
        position: "absolute",
        top: "20%",
        right: "-10%",
        width: 800,
        height: 800,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(212,175,55,${0.06 * pulse}) 0%, transparent 70%)`,
        filter: "blur(80px)",
        transform: `translate(${Math.sin(frame * 0.01) * 30}px, ${Math.cos(frame * 0.008) * 20}px)`,
      }} />

      {/* Blue ambient glow */}
      <div style={{
        position: "absolute",
        bottom: "10%",
        left: "-5%",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(30,58,138,0.08) 0%, transparent 70%)`,
        filter: "blur(60px)",
        transform: `translate(${Math.cos(frame * 0.012) * 25}px, ${Math.sin(frame * 0.009) * 15}px)`,
      }} />
    </AbsoluteFill>
  );
};
