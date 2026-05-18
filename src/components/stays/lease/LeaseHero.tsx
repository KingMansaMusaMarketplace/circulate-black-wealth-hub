import React, { useEffect, useState } from "react";
import chicagoHero from "@/assets/lease-hero-chicago.jpg";
import atlantaHero from "@/assets/lease-hero-atlanta.jpg";

const SLIDES = [
  { src: chicagoHero, city: "Chicago" },
  { src: atlantaHero, city: "Atlanta" },
];

interface Props {
  children: React.ReactNode;
}

/** Full-bleed hero with a slow cross-fade rotation between city skylines. */
const LeaseHero: React.FC<Props> = ({ children }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden border-b border-white/10">
      {/* Image layers */}
      {SLIDES.map((s, i) => (
        <img
          key={s.city}
          src={s.src}
          alt={`${s.city} skyline at dusk`}
          width={1920}
          height={800}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Dark gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>

      {/* City pill indicator */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.city}
            onClick={() => setIdx(i)}
            aria-label={`Show ${s.city} skyline`}
            className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
              i === idx
                ? "bg-mansagold text-black border-mansagold font-semibold"
                : "bg-black/40 text-white/70 border-white/20 hover:bg-black/60"
            }`}
          >
            {s.city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeaseHero;
