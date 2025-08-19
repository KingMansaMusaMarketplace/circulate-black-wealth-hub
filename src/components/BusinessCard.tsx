
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BusinessCardProps {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  discount: string;
  distance?: string;
  address?: string;
  imageUrl?: string;
  imageAlt?: string;
  isFeatured?: boolean;
}

const BusinessCard = ({ 
  id, 
  name, 
  category, 
  rating, 
  reviewCount, 
  discount, 
  distance, 
  address,
  imageUrl,
  imageAlt,
  isFeatured = false 
}: BusinessCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageError = () => {
    setImgError(true);
    setImgLoading(false);
  };

  const handleImageLoad = () => {
    setImgLoading(false);
  };

  // Create a fallback image using a placeholder service
  const getFallbackImageUrl = () => {
    return `https://placehold.co/400x250/f3f4f6/6b7280?text=${encodeURIComponent(name.slice(0, 20))}`;
  };

  const getImageUrl = () => {
    if (imgError || !imageUrl) {
      return getFallbackImageUrl();
    }
    return imageUrl;
  };

  return (
    <div className={`border rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg ${isFeatured ? 'border-mansagold shadow-md' : 'border-gray-200'}`}>
      {isFeatured && (
        <div className="bg-mansagold text-white text-xs font-medium px-3 py-1 text-center">
          Featured Business
        </div>
      )}
      <div ref={imgRef} className="aspect-video bg-gray-100 relative overflow-hidden">
        {!isInView ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-mansablue flex items-center justify-center mb-2">
                <span className="text-white text-2xl font-bold">{name.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">{category}</span>
            </div>
          </div>
        ) : (
          <>
            {imgLoading && (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse absolute inset-0 z-10">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-mansablue/20 flex items-center justify-center mb-2">
                    <span className="text-mansablue text-xl font-bold">{name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Loading image...</span>
                </div>
              </div>
            )}
            <img 
              src={getImageUrl()} 
              alt={imageAlt || `${name} business image`}
              className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              style={{ minHeight: '200px' }}
            />
          </>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-mansablue shadow-sm">
          {discount}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-1 text-gray-900">{name}</h3>
        <p className="text-gray-500 text-sm mb-2">{category}</p>
        
        {address && (
          <div className="flex items-center text-gray-500 text-xs mb-3">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>
        )}
        
        <div className="flex items-center mb-3">
          <div className="flex text-mansagold">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                size={14} 
                className={i < Math.floor(rating) ? 'fill-mansagold text-mansagold' : 'text-gray-300'} 
              />
            ))}
          </div>
          <p className="ml-1 text-xs text-gray-500">{rating} ({reviewCount} reviews)</p>
          
          {distance && (
            <div className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              {distance}
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <Link to={`/business/${id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full border-mansablue text-mansablue hover:bg-mansablue hover:text-white transition-colors">
              View Business
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
