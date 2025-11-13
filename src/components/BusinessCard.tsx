
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BusinessCardProps {
  id: string;
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
    <div className={`glass-card border rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${isFeatured ? 'border-mansagold/50 shadow-lg' : 'border-border/30'}`}>
      {isFeatured && (
        <div className="bg-gradient-gold text-mansablue-dark text-xs font-bold px-3 py-1.5 text-center">
          Featured Business
        </div>
      )}
      <div ref={imgRef} className="aspect-video bg-gradient-subtle relative overflow-hidden">
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
              className={`w-full h-full object-cover transition-all duration-700 hover:scale-110 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              style={{ minHeight: '200px' }}
            />
          </>
        )}
        <div className="absolute top-2 right-2 glass-card backdrop-blur-xl rounded-full px-3 py-1.5 text-xs font-bold bg-gradient-gold text-mansablue-dark shadow-lg border border-mansagold/30">
          {discount}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-xl mb-1 text-foreground">{name}</h3>
        <p className="font-body text-muted-foreground text-sm mb-3">{category}</p>
        
        {address && (
          <div className="flex items-center text-muted-foreground text-xs mb-4">
            <MapPin size={14} className="mr-1.5 flex-shrink-0" />
            <span className="truncate font-body">{address}</span>
          </div>
        )}
        
        <div className="flex items-center mb-4">
          <div className="flex text-mansagold">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                size={16} 
                className={i < Math.floor(rating) ? 'fill-mansagold text-mansagold' : 'text-gray-300'} 
              />
            ))}
          </div>
          <p className="ml-2 text-xs text-muted-foreground font-body">{rating} ({reviewCount})</p>
          
          {distance && (
            <div className="ml-auto text-xs glass-card px-2.5 py-1 rounded-full font-semibold">
              {distance}
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <Link to={`/business/${id}`} className="w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-2 hover:bg-mansablue hover:text-white hover:border-mansablue transition-all shadow-sm font-semibold"
            >
              View Business
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
