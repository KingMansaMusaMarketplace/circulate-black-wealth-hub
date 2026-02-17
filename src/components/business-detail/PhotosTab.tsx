
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, ZoomIn, Grid3X3 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PLACEHOLDER_PHOTOS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80', alt: 'Business exterior' },
  { id: 2, src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', alt: 'Office space' },
  { id: 3, src: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80', alt: 'Interior design' },
  { id: 4, src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80', alt: 'Meeting room' },
  { id: 5, src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80', alt: 'Team workspace' },
  { id: 6, src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80', alt: 'Conference area' },
  { id: 7, src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80', alt: 'Lobby' },
  { id: 8, src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80', alt: 'Work environment' },
];

const PhotosTab: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % PLACEHOLDER_PHOTOS.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + PLACEHOLDER_PHOTOS.length) % PLACEHOLDER_PHOTOS.length);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Business Photos</h2>
        <span className="text-sm text-muted-foreground">{PLACEHOLDER_PHOTOS.length} photos</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {PLACEHOLDER_PHOTOS.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(i)}
            className="group relative aspect-square rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={() => toast.info('Photo upload coming soon!')}>
          Upload Photos
        </Button>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] w-auto p-0 border-none bg-black/95 overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <div className="relative flex items-center justify-center min-h-[60vh] md:min-h-[80vh]">
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
              {currentIndex + 1} / {PLACEHOLDER_PHOTOS.length}
            </div>

            {/* Navigation */}
            <button
              onClick={goPrev}
              className="absolute left-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
              src={PLACEHOLDER_PHOTOS[currentIndex].src}
              alt={PLACEHOLDER_PHOTOS[currentIndex].alt}
              className="max-w-full max-h-[85vh] object-contain select-none"
            />
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 p-3 overflow-x-auto justify-center bg-black/80">
            {PLACEHOLDER_PHOTOS.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'w-14 h-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all',
                  i === currentIndex ? 'border-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                )}
              >
                <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotosTab;
