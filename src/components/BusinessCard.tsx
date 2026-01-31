
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VerifiedBlackOwnedBadge from '@/components/ui/VerifiedBlackOwnedBadge';

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
  isSample?: boolean;
  isVerified?: boolean;
}

// Category color mapping for visual variety
const getCategoryStyle = (category: string): { bg: string; text: string; border: string } => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('restaurant') || categoryLower.includes('food')) {
    return { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' };
  }
  if (categoryLower.includes('beauty') || categoryLower.includes('salon') || categoryLower.includes('spa')) {
    return { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' };
  }
  if (categoryLower.includes('retail') || categoryLower.includes('shop') || categoryLower.includes('store')) {
    return { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' };
  }
  if (categoryLower.includes('service') || categoryLower.includes('professional')) {
    return { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' };
  }
  if (categoryLower.includes('health') || categoryLower.includes('wellness') || categoryLower.includes('fitness')) {
    return { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30' };
  }
  if (categoryLower.includes('tech') || categoryLower.includes('digital')) {
    return { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' };
  }
  return { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30' };
};

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
  isFeatured = false,
  isSample = false,
  isVerified = false
}: BusinessCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const categoryStyle = getCategoryStyle(category);

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
    return `https://placehold.co/400x250/1e293b/94a3b8?text=${encodeURIComponent(name.slice(0, 20))}`;
  };

  const getImageUrl = () => {
    if (imgError || !imageUrl) {
      return getFallbackImageUrl();
    }
    return imageUrl;
  };

  return (
    <div className="group relative h-full">
      <div className={`relative border rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-mansagold/10 ${isFeatured ? 'border-mansagold/50 shadow-lg shadow-mansagold/20 bg-gradient-to-br from-slate-800/90 via-blue-900/60 to-slate-800/90' : 'border-white/10 hover:border-mansagold/40 bg-slate-800/80'} backdrop-blur-xl`}>
        {isFeatured && (
          <div className="bg-gradient-to-r from-mansagold via-orange-400 to-pink-500 text-slate-900 text-xs font-bold px-3 py-2 text-center shadow-lg flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Featured Business
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        )}
        {isSample && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold px-3 py-1.5 text-center">
            📋 Sample Business
          </div>
        )}
        
        {/* Image container with overlay effects */}
        <div ref={imgRef} className="aspect-video relative overflow-hidden bg-slate-900">
          {!isInView ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mansablue to-blue-600 flex items-center justify-center mb-2 shadow-lg">
                  <span className="text-white text-2xl font-bold">{name.charAt(0).toUpperCase()}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} border`}>{category}</span>
              </div>
            </div>
          ) : (
            <>
              {imgLoading && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse absolute inset-0 z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-mansablue/30 flex items-center justify-center mb-2">
                      <span className="text-mansagold text-xl font-bold">{name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Loading...</span>
                  </div>
                </div>
              )}
              <img 
                src={getImageUrl()} 
                alt={imageAlt || `${name} business image`}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
                loading="lazy"
                style={{ minHeight: '200px' }}
              />
              {/* Subtle gradient at bottom for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
            </>
          )}
          
          {/* Discount badge */}
          <div className="absolute top-3 right-3 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg border border-white/20">
            {discount}
          </div>
          
          {/* Category badge on image */}
          <div className={`absolute bottom-3 left-3 backdrop-blur-md rounded-lg px-2.5 py-1 text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} border`}>
            {category}
          </div>
        </div>
        
        {/* Content section */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="font-display font-bold text-lg text-white leading-tight mb-2 group-hover:text-mansagold transition-colors duration-300">{name}</h3>
          
          {address && (
            <div className="flex items-center text-slate-400 text-xs mb-3">
              <MapPin size={13} className="mr-1.5 flex-shrink-0 text-mansagold/70" />
              <span className="truncate font-body">{address}</span>
            </div>
          )}
          
          {/* Rating and distance row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    size={14} 
                    className={i < Math.floor(rating) ? 'fill-mansagold text-mansagold' : 'text-slate-600'} 
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-medium">{rating} ({reviewCount})</span>
            </div>
            
            {distance && (
              <div className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-700/60 text-slate-300 border border-white/10">
                {distance}
              </div>
            )}
          </div>
          
          {isVerified && (
            <div className="mb-3">
              <VerifiedBlackOwnedBadge tier="certified" variant="compact" showTooltip={true} />
            </div>
          )}
          
          {/* CTA Button */}
          <div className="mt-auto pt-2">
            <Link to={`/business/${id}`} className="w-full block">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-mansagold/30 bg-gradient-to-r from-mansablue/80 to-blue-600/80 hover:from-mansagold hover:to-orange-500 text-white hover:text-slate-900 shadow-md hover:shadow-lg hover:shadow-mansagold/20 transition-all duration-300 font-semibold group-hover:border-mansagold/50"
              >
                View Business
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
