import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/ui/optimized-image';
import { generatePlaceholder } from '@/utils/imageOptimizer';
import VerifiedBlackOwnedBadge from '@/components/ui/VerifiedBlackOwnedBadge';
import HBCUBadge, { isHBCUCategory } from '@/components/ui/HBCUBadge';

interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  discount: string;
  distance?: string;
  address?: string;
  phone?: string;
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
  phone,
  imageUrl,
  imageAlt,
  isFeatured = false,
  isSample = false,
  isVerified = false
}: BusinessCardProps) => {
  const description = `Discover amazing ${category.toLowerCase()} services and earn loyalty points`;

  return (
    <Card className={`
      group h-full flex flex-col overflow-hidden
      bg-slate-900/80 backdrop-blur-xl border-white/10
      hover:border-mansagold/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]
      transition-all duration-300 hover:-translate-y-1
      ${isFeatured ? 'ring-2 ring-mansagold shadow-[0_0_40px_rgba(251,191,36,0.2)]' : ''}
    `}>
      {isFeatured && (
        <div className="bg-gradient-to-r from-mansagold via-amber-400 to-mansagold text-slate-900 text-xs font-bold px-3 py-2 text-center">
          ✨ Featured Business ✨
        </div>
      )}
      {isSample && (
        <div className="bg-gradient-to-r from-mansablue to-blue-600 text-white text-xs font-semibold px-3 py-1.5 text-center">
          📋 Sample Business - For demonstration purposes
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="aspect-video bg-slate-800 rounded-lg mb-4 overflow-hidden ring-1 ring-white/10 relative">
          <OptimizedImage 
            src={imageUrl || generatePlaceholder(400, 250, name)} 
            alt={imageAlt || name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            fallbackSrc={generatePlaceholder(400, 250, name)}
            quality="medium"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl leading-tight truncate text-mansagold group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-all">
              {name}
            </CardTitle>
            <Badge variant="secondary" className="mt-1 bg-white/10 text-gray-300 border-white/20">
              {category}
            </Badge>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            {discount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="mb-3 line-clamp-2 text-base text-gray-200">
          {description}
        </CardDescription>
        
        {address && (
          <div className="flex items-center text-base text-gray-200 mb-2">
            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-mansagold/70" />
            <span className="truncate">{address}</span>
          </div>
        )}
        
        {phone && (
          <div className="flex items-center text-base text-gray-200 mb-3">
            <Phone className="h-4 w-4 mr-1.5 flex-shrink-0 text-mansagold/70" />
            <a href={`tel:${phone}`} className="hover:text-mansagold transition-colors">{phone}</a>
          </div>
        )}
        
        <div className="flex items-center justify-between text-base text-gray-200 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-mansagold mr-1 fill-mansagold" />
              <span className="text-white font-medium">{rating}</span>
              <span className="ml-1 text-gray-300">({reviewCount} reviews)</span>
            </div>
            {isHBCUCategory(category) && <HBCUBadge variant="compact" />}
          </div>
          {distance && (
            <div className="flex items-center text-gray-500">
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
            <Button className="w-full bg-gradient-to-r from-mansablue to-blue-600 hover:from-mansagold hover:to-amber-500 hover:text-slate-900 transition-all duration-300 font-semibold">
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
