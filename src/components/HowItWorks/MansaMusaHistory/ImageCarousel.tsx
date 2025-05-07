
import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageItem {
  src: string;
  alt: string;
  caption: string;
}

interface ImageCarouselProps {
  images: ImageItem[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasImageLoadError, setHasImageLoadError] = useState(false);
  
  const changeImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      // Reset the error state when changing images
      setHasImageLoadError(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(changeImage, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentImage = images[currentImageIndex];

  const handleImageError = () => {
    setHasImageLoadError(true);
    // Try the next image after a short delay
    setTimeout(() => {
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    }, 500);
  };

  return (
    <div className="md:w-1/3 relative group">
      {hasImageLoadError ? (
        <div className="rounded-lg bg-gray-800 h-64 w-full flex items-center justify-center">
          <div className="text-center p-4">
            <ImageOff className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-400">Image temporarily unavailable</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg shadow-md relative">
          <img 
            src={currentImage.src}
            alt={currentImage.alt}
            className="rounded-lg w-full h-64 object-cover transform hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <p className="text-white p-3 text-sm">{currentImage.caption}</p>
          </div>
        </div>
      )}
      {!hasImageLoadError && (
        <p className="text-xs text-gray-400 mt-2 italic text-center">{currentImage.caption}</p>
      )}
    </div>
  );
};

export default ImageCarousel;
