
import React from 'react';
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
  return (
    <div className={`border rounded-xl overflow-hidden ${isFeatured ? 'border-mansagold shadow-md' : 'border-gray-200'}`}>
      {isFeatured && (
        <div className="bg-mansagold text-white text-xs font-medium px-3 py-1 text-center">
          Featured Business
        </div>
      )}
      <div className="h-36 bg-gray-100 relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={imageAlt || `${name} image`}
            width="300"
            height="200"
            loading="eager"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              console.error(`Failed to load image: ${imageUrl}`);
              e.currentTarget.src = `https://placehold.co/300x200/e0e0e0/808080?text=${name.charAt(0)}`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-3xl font-bold">{name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-mansablue">
          {discount}
        </div>
      </div>
      <div className="p-4">
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
              {distance} miles
            </div>
          )}
        </div>
        
        <Link to={`/business/${id}`}>
          <Button variant="outline" size="sm" className="w-full border-mansablue text-mansablue hover:bg-mansablue hover:text-white">
            View Business
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BusinessCard;
