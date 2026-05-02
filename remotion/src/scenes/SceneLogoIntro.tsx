import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Logo intro overlay — plays over the first ~75 frames of the Hook.
// Matches the homepage 1325.AI logo with the pulsing MansaGold glow.
export const SceneLogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring-in scale for the logo
  const scaleIn = spring({ frame, fps, config: { damping: 18, stiffness: 110, mass: 1 } });
  const scale = interpolate(scaleIn, [0, 1], [0.7, 1]);

  // Hold then fade out
  const fadeOut = interpolate(frame, [60, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(scaleIn, fadeOut);

  // Backdrop fade (dark veil over hook background while logo shows)
  const veil = interpolate(frame, [0, 10, 60, 75], [0, 0.85, 0.85, 0], { extrapolateRight: "clamp" });

  // Pulsing glow — sinusoidal
  const pulse = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 1.5);
  const glowOpacity = interpolate(pulse, [0, 1], [0.55, 0.95]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Dark veil */}
      <AbsoluteFill style={{ backgroundColor: "#000000", opacity: veil }} />

      {/* Logo + glow */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", transform: `scale(${scale})` }}>
          {/* Outer huge soft glow */}
          <div
            style={{
              position: "absolute",
              inset: -200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,179,0,0.55) 0%, rgba(255,179,0,0.25) 35%, rgba(255,179,0,0) 70%)",
              filter: "blur(60px)",
              opacity: glowOpacity,
            }}
          />
          {/* Inner tighter glow */}
          <div
            style={{
              position: "absolute",
              inset: -80,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,179,0,0.85) 0%, rgba(255,179,0,0.4) 45%, rgba(255,179,0,0) 75%)",
              filter: "blur(30px)",
              opacity: glowOpacity,
            }}
          />
          <Img
            src={staticFile("images/1325-ai-logo.webp")}
            style={{
              position: "relative",
              height: 560,
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 0 40px rgba(255,179,0,0.6)) drop-shadow(0 0 80px rgba(255,179,0,0.4))",
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
