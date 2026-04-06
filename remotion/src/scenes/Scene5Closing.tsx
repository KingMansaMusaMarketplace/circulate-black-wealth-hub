import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Playfair";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: playfair } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: inter } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const GOLD = "#D4AF37";

export const Scene5Closing = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo/brand entrance
  const logoS = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const logoScale = interpolate(logoS, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(logoS, [0, 0.5, 1], [0, 0.8, 1]);

  // Tagline
  const tagS = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 100 } });
  const tagOpacity = interpolate(tagS, [0, 1], [0, 1]);
  const tagY = interpolate(tagS, [0, 1], [30, 0]);

  // CTA text
  const ctaOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [60, 80], [20, 0], { extrapolateRight: "clamp" });

  // Pulsing gold ring
  const ringScale = 1 + Math.sin(frame * 0.05) * 0.03;
  const ringOpacity = 0.15 + Math.sin(frame * 0.03) * 0.05;

  // Subtle float
  const floatY = Math.sin(frame * 0.025) * 4;

  // "FREE" badge
  const badgeS = spring({ frame: frame - 50, fps, config: { damping: 10, stiffness: 120 } });
  const badgeScale = interpolate(badgeS, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Radial gold glow */}
      <div style={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(212,175,55,${ringOpacity}) 0%, transparent 60%)`,
        transform: `scale(${ringScale})`,
      }} />

      <div style={{
        textAlign: "center",
        transform: `translateY(${floatY}px) scale(${logoScale})`,
        opacity: logoOpacity,
      }}>
        {/* Brand name */}
        <div style={{
          fontFamily: playfair,
          fontSize: 140,
          fontWeight: 900,
          background: `linear-gradient(135deg, ${GOLD}, #F5E6A3, ${GOLD})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          textShadow: "none",
          filter: `drop-shadow(0 0 30px rgba(212,175,55,0.3))`,
        }}>
          1325.AI
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: inter,
          fontSize: 30,
          fontWeight: 400,
          color: "rgba(255,255,255,0.7)",
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          marginTop: 20,
          letterSpacing: "6px",
          textTransform: "uppercase",
        }}>
          Mansa Musa Marketplace
        </div>

        {/* Gold divider */}
        <div style={{
          width: 120,
          height: 2,
          background: GOLD,
          margin: "30px auto",
          opacity: tagOpacity,
        }} />

        {/* CTA */}
        <div style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}>
          <div style={{
            fontFamily: inter,
            fontSize: 38,
            fontWeight: 700,
            color: "#FFFFFF",
          }}>
            Join FREE Today
          </div>
          <div style={{
            fontFamily: inter,
            fontSize: 22,
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            marginTop: 8,
          }}>
            No credit card required
          </div>
        </div>

        {/* FREE badge */}
        <div style={{
          display: "inline-block",
          marginTop: 40,
          padding: "14px 40px",
          borderRadius: 50,
          background: `linear-gradient(135deg, ${GOLD}, #C5981A)`,
          transform: `scale(${badgeScale})`,
          boxShadow: `0 0 40px rgba(212,175,55,0.3)`,
        }}>
          <span style={{
            fontFamily: inter,
            fontSize: 20,
            fontWeight: 700,
            color: "#000",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}>
            100% FREE Until January 2026
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
