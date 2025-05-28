
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

  console.log(`BusinessCard ${name} - Props received:`, {
    id,
    name,
    imageUrl,
    imageAlt,
    hasImageUrl: !!imageUrl
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`Image ERROR for ${name}:`, {
      imageUrl,
      error: e,
      naturalWidth: (e.target as HTMLImageElement).naturalWidth,
      naturalHeight: (e.target as HTMLImageElement).naturalHeight
    });
    setImgError(true);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`Image LOADED successfully for ${name}:`, {
      imageUrl,
      naturalWidth: (e.target as HTMLImageElement).naturalWidth,
      naturalHeight: (e.target as HTMLImageElement).naturalHeight
    });
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
        {imageUrl ? (
          <>
            {!imgLoaded && !imgError && (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
                <div className="flex flex-col items-center">
                  <span className="text-gray-400 text-3xl font-bold mb-2">{name.charAt(0).toUpperCase()}</span>
                  <span className="text-xs text-gray-500">Loading image...</span>
                </div>
              </div>
            )}
            <img 
              src={imageUrl} 
              alt={imageAlt || `${name} business image`}
              className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 ${!imgLoaded ? 'opacity-0 absolute' : 'opacity-100'}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              style={{ display: imgError ? 'none' : 'block' }}
            />
            {imgError && (
              <div className="w-full h-full flex items-center justify-center bg-red-50">
                <div className="flex flex-col items-center">
                  <span className="text-red-400 text-3xl font-bold mb-2">{name.charAt(0).toUpperCase()}</span>
                  <span className="text-xs text-red-500">Image failed to load</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-3xl font-bold mb-2">{name.charAt(0).toUpperCase()}</span>
              <span className="text-xs text-gray-500">No image available</span>
            </div>
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
