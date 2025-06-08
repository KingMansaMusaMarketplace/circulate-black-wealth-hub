
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Heart, Clock } from 'lucide-react';
import { Business } from '@/types/business';

interface BusinessRecommendationCardProps {
  business: Business;
}

const BusinessRecommendationCard: React.FC<BusinessRecommendationCardProps> = ({ business }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img 
          src={business.imageUrl} 
          alt={business.name} 
          className="w-full h-full object-cover"
        />
        {business.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-mansagold text-black">
            Featured
          </Badge>
        )}
        {business.discountValue > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            {business.discount}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{business.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{business.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{business.category}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{business.distance}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Open Now</span>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1">
          <Badge variant="outline" className="bg-gray-100">
            {business.category}
          </Badge>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm">
            View
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessRecommendationCard;
