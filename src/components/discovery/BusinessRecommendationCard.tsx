
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
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in border border-white/10 bg-slate-800/60 backdrop-blur-xl">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={business.imageUrl} 
          alt={business.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
          <h3 className="font-display font-bold text-lg transition-colors text-white group-hover:text-mansagold">{business.name}</h3>
          <div className="flex items-center transition-transform group-hover:scale-110">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium text-white">{business.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-slate-300 mb-3">{business.category}</p>
        
        <div className="flex items-center text-sm text-slate-400 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{business.distance}</span>
        </div>
        
        <div className="flex items-center text-sm text-slate-400">
          <Clock className="h-4 w-4 mr-1" />
          <span>Open Now</span>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1">
          <Badge variant="outline" className="bg-slate-700/60 border-white/20 text-slate-300">
            {business.category}
          </Badge>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button variant="outline" size="sm" className="transition-all hover:scale-105 border-white/20 bg-gradient-to-r from-mansablue to-blue-600 hover:from-blue-700 hover:to-mansablue text-white">
            View
          </Button>
          <Button variant="ghost" size="icon" className="transition-all hover:scale-110 text-white hover:text-red-500">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessRecommendationCard;
