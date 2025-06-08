
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, ExternalLink } from 'lucide-react';
import { Business } from '@/types/business';

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
  onSelect
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
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
        </div>
        
        {/* Content Section */}
        <CardContent className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
              {name}
            </h3>
            <p className="text-xs text-gray-600 mb-2">{category}</p>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-mansagold fill-current" />
                <span className="text-xs font-medium">{rating}</span>
                <span className="text-xs text-gray-500">({reviewCount})</span>
              </div>
              
              {distance && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{distance}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 truncate flex-1 mr-2">
              {address}
            </p>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default MobileBusinessCard;
