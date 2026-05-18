import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface Props {
  photos: string[];
  alt: string;
  className?: string;
}

const PhotoCarousel: React.FC<Props> = ({ photos, alt, className = "" }) => {
  const [i, setI] = useState(0);
  const safe = photos?.filter(Boolean) ?? [];
  const count = safe.length;

  if (count === 0) {
    return (
      <div className={`relative bg-white/5 flex items-center justify-center text-white/30 ${className}`}>
        <ImageOff className="w-8 h-8" />
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setI((p) => (p - 1 + count) % count);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setI((p) => (p + 1) % count);
  };

  return (
    <div className={`relative group overflow-hidden bg-black ${className}`}>
      <img
        src={safe[i]}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {safe.map((_, idx) => (
              <span
                key={idx}
                className={`block w-1.5 h-1.5 rounded-full ${
                  idx === i ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
          <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
            {i + 1}/{count}
          </span>
        </>
      )}
    </div>
  );
};

export default PhotoCarousel;
