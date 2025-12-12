
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, ExternalLink } from 'lucide-react';
import { Business } from '@/types/business';
import FavoriteButton from './FavoriteButton';
import VerifiedBlackOwnedBadge from '@/components/ui/VerifiedBlackOwnedBadge';

interface MobileBusinessCardProps extends Business {
  onSelect?: () => void;
}

const MobileBusinessCard: React.FC<MobileBusinessCardProps> = ({
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
  isFeatured,
  isVerified,
  onSelect
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-white/10 bg-slate-800/60 backdrop-blur-xl" onClick={onSelect}>
      <div className="flex h-32">
        {/* Image Section */}
        <div className="w-32 flex-shrink-0 relative">
          <img
            src={imageUrl}
            alt={imageAlt || name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/128x128/e0e0e0/808080?text=${name.charAt(0)}`;
            }}
          />
          {isFeatured && (
            <Badge className="absolute top-2 left-2 bg-mansagold text-white text-xs">
              Featured
            </Badge>
          )}
          {discount && (
            <Badge className="absolute bottom-2 left-2 bg-green-600 text-white text-xs">
              {discount}
            </Badge>
          )}
          <div className="absolute top-2 right-2">
            <FavoriteButton businessId={id} size="sm" variant="ghost" />
          </div>
        </div>
        
        {/* Content Section */}
        <CardContent className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1 mb-1">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-white">
                {name}
              </h3>
              {isVerified && (
                <VerifiedBlackOwnedBadge tier="certified" variant="compact" showTooltip={false} className="flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-300 mb-2">{category}</p>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-mansagold fill-current" />
                <span className="text-xs font-medium text-white">{rating}</span>
                <span className="text-xs text-slate-400">({reviewCount})</span>
              </div>
              
              {distance && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-300">{distance}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 truncate flex-1 mr-2">
              {address}
            </p>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:text-mansagold">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default MobileBusinessCard;
