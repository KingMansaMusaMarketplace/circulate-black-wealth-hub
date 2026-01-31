
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/ui/optimized-image';
import { generatePlaceholder } from '@/utils/imageOptimizer';
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
  const description = `Discover amazing ${category.toLowerCase()} services and earn loyalty points`;

  return (
    <Card className={`hover:shadow-lg transition-shadow h-full flex flex-col ${isFeatured ? 'ring-2 ring-mansagold shadow-lg' : ''}`}>
      {isFeatured && (
        <div className="bg-gradient-to-r from-mansagold via-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-2 text-center">
          ✨ Featured Business ✨
        </div>
      )}
      {isSample && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1.5 text-center">
          📋 Sample Business - For demonstration purposes
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
          <OptimizedImage 
            src={imageUrl || generatePlaceholder(400, 250, name)} 
            alt={imageAlt || name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            fallbackSrc={generatePlaceholder(400, 250, name)}
            quality="medium"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight truncate">{name}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {category}
            </Badge>
          </div>
          <Badge className="bg-green-100 text-green-800 shrink-0">
            {discount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="mb-3 line-clamp-2">
          {description}
        </CardDescription>
        
        {address && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
            <span>{rating} ({reviewCount} reviews)</span>
          </div>
          {distance && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{distance}</span>
            </div>
          )}
        </div>
        
        {isVerified && (
          <div className="mb-4">
            <VerifiedBlackOwnedBadge tier="certified" variant="compact" showTooltip={true} />
          </div>
        )}
        
        <div className="mt-auto">
          <Link to={`/business/${id}`}>
            <Button className="w-full">
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
