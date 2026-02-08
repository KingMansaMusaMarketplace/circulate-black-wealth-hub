
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface PropertyGalleryProps {
  photos: string[];
  title: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ photos, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayPhotos = photos.length > 0 ? photos : ['/placeholder.svg'];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayPhotos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayPhotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="relative rounded-xl overflow-hidden">
        {displayPhotos.length === 1 ? (
          // Single photo
          <div
            className="aspect-[16/9] cursor-pointer"
            onClick={() => {
              setCurrentIndex(0);
              setLightboxOpen(true);
            }}
          >
            <img
              src={displayPhotos[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : displayPhotos.length === 2 ? (
          // Two photos
          <div className="grid grid-cols-2 gap-2 aspect-[16/9]">
            {displayPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="cursor-pointer overflow-hidden"
                onClick={() => {
                  setCurrentIndex(idx);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={photo}
                  alt={`${title} - ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          // 3+ photos - Airbnb-style grid
          <div className="grid grid-cols-4 grid-rows-2 gap-2 aspect-[16/9]">
            {/* Main large image */}
            <div
              className="col-span-2 row-span-2 cursor-pointer overflow-hidden"
              onClick={() => {
                setCurrentIndex(0);
                setLightboxOpen(true);
              }}
            >
              <img
                src={displayPhotos[0]}
                alt={`${title} - Main`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Smaller images */}
            {displayPhotos.slice(1, 5).map((photo, idx) => (
              <div
                key={idx}
                className="cursor-pointer overflow-hidden relative"
                onClick={() => {
                  setCurrentIndex(idx + 1);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={photo}
                  alt={`${title} - ${idx + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Show more overlay on last visible image */}
                {idx === 3 && displayPhotos.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{displayPhotos.length - 5} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Show all photos button */}
        {displayPhotos.length > 1 && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 shadow-lg"
            onClick={() => setLightboxOpen(true)}
          >
            <Expand className="w-4 h-4 mr-2" />
            Show all photos
          </Button>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-full bg-black/95 border-none p-0">
          <DialogTitle className="sr-only">{title} - Photo Gallery</DialogTitle>
          <div className="relative">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-10 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {currentIndex + 1} / {displayPhotos.length}
            </div>

            {/* Main image */}
            <div className="flex items-center justify-center min-h-[60vh]">
              <img
                src={displayPhotos[currentIndex]}
                alt={`${title} - ${currentIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>

            {/* Navigation arrows */}
            {displayPhotos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Thumbnail strip */}
            {displayPhotos.length > 1 && (
              <div className="flex justify-center gap-2 p-4 overflow-x-auto">
                {displayPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      'flex-shrink-0 w-16 h-12 rounded overflow-hidden transition-all',
                      idx === currentIndex
                        ? 'ring-2 ring-white'
                        : 'opacity-50 hover:opacity-100'
                    )}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyGallery;
