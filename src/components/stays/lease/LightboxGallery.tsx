import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ImageOff, Expand } from "lucide-react";

interface Props {
  photos: string[];
  alt: string;
}

const LightboxGallery: React.FC<Props> = ({ photos, alt }) => {
  const safe = (photos || []).filter(Boolean);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setOpenIdx((p) => (p === null ? p : (p - 1 + safe.length) % safe.length));
      if (e.key === "ArrowRight") setOpenIdx((p) => (p === null ? p : (p + 1) % safe.length));
      if (e.key === "Escape") setOpenIdx(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, safe.length]);

  if (safe.length === 0) {
    return (
      <div className="aspect-video bg-white/5 rounded-2xl flex items-center justify-center text-white/30">
        <div className="text-center">
          <ImageOff className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">No photos yet</p>
        </div>
      </div>
    );
  }

  const cover = safe[0];
  const rest = safe.slice(1, 5);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
        <button
          onClick={() => setOpenIdx(0)}
          className="md:col-span-2 md:row-span-2 relative group aspect-video md:aspect-auto md:h-full bg-black"
        >
          <img src={cover} alt={alt} className="w-full h-full object-cover" />
          <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
            <Expand className="w-3 h-3" /> View all {safe.length} photos
          </span>
        </button>
        {rest.map((url, idx) => (
          <button
            key={url}
            onClick={() => setOpenIdx(idx + 1)}
            className="relative aspect-square hidden md:block bg-black"
          >
            <img src={url} alt={`${alt} ${idx + 2}`} className="w-full h-full object-cover" />
            {idx === 3 && safe.length > 5 && (
              <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                +{safe.length - 5} more
              </span>
            )}
          </button>
        ))}
      </div>

      <Dialog open={openIdx !== null} onOpenChange={(o) => !o && setOpenIdx(null)}>
        <DialogContent className="max-w-5xl bg-black border-white/20 p-0 overflow-hidden">
          {openIdx !== null && (
            <div className="relative">
              <img
                src={safe[openIdx]}
                alt={`${alt} ${openIdx + 1}`}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
              <button
                onClick={() => setOpenIdx(null)}
                className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white rounded-full p-2"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              {safe.length > 1 && (
                <>
                  <button
                    onClick={() => setOpenIdx((p) => (p === null ? p : (p - 1 + safe.length) % safe.length))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white rounded-full p-2"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setOpenIdx((p) => (p === null ? p : (p + 1) % safe.length))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white rounded-full p-2"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                    {openIdx + 1} / {safe.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LightboxGallery;
