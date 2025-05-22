
import React, { useState } from 'react';
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
  // Track image loading state
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Generate a placeholder image with the business initial
  const generatePlaceholderUrl = (businessName: string) => {
    const initial = businessName.charAt(0).toUpperCase();
    return `https://placehold.co/300x200/e0e0e0/808080?text=${initial}`;
  };

  // Add logging to debug image loading issues
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`Image failed to load: ${imageUrl}`);
    setImgError(true);
    e.currentTarget.src = generatePlaceholderUrl(name);
  };

  const handleImageLoad = () => {
    setImgLoaded(true);
  };

  return (
    <div className={`border rounded-xl overflow-hidden h-full flex flex-col ${isFeatured ? 'border-mansagold shadow-md' : 'border-gray-200'}`}>
      {isFeatured && (
        <div className="bg-mansagold text-white text-xs font-medium px-3 py-1 text-center">
          Featured Business
        </div>
      )}
      <div className="h-36 bg-gray-100 relative overflow-hidden">
        {!imgError && imageUrl ? (
          <>
            {!imgLoaded && (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
                <span className="text-gray-400 text-3xl font-bold">{name.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <img 
              src={imageUrl} 
              alt={imageAlt || `${name} image`}
              width="300"
              height="200"
              loading="lazy"
              className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${!imgLoaded ? 'opacity-0' : 'opacity-100'}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-3xl font-bold">{name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-mansablue">
          {discount}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        <p className="text-gray-500 text-sm mb-2">{category}</p>
        
        {address && (
          <div className="flex items-center text-gray-500 text-xs mb-3">
            <MapPin size={14} className="mr-1" />
            <span>{address}</span>
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
            <Button variant="outline" size="sm" className="w-full border-mansablue text-mansablue hover:bg-mansablue hover:text-white">
              View Business
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
