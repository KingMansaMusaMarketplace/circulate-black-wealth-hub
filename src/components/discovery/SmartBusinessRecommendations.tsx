
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, TrendingUp, Clock, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Business } from '@/types/business';
import { useBusinessDirectory } from '@/hooks/use-business-directory';

interface SmartBusinessRecommendationsProps {
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
}

const SmartBusinessRecommendations: React.FC<SmartBusinessRecommendationsProps> = ({ 
  userLocation, 
  className = '' 
}) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Get businesses using the real Supabase data
  const { businesses, loading: businessesLoading } = useBusinessDirectory({
    initialFilters: {
      userLat: userLocation?.lat,
      userLng: userLocation?.lng
    },
    pageSize: 20,
    autoFetch: true
  });

  // AI-powered recommendation engine (simplified)
  const generateRecommendations = () => {
    if (businessesLoading || businesses.length === 0) {
      setLoading(true);
      return;
    }

    setLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      let scored = businesses.map(business => {
        let score = 0;
        
        // Base score from rating
        score += business.rating * 10;
        
        // Boost for high discounts
        score += business.discountValue * 2;
        
        // Boost for verified businesses
        if (business.isFeatured) score += 20;
        
        // Distance bonus if location available
        if (userLocation && business.distanceValue) {
          score += Math.max(0, 25 - business.distanceValue * 5);
        }
        
        // Category variety bonus
        const popularCategories = ['Food & Dining', 'Beauty & Wellness', 'Health & Fitness'];
        if (popularCategories.includes(business.category)) {
          score += 15;
        }
        
        // Recent activity bonus (simulated)
        if (Math.random() > 0.7) score += 10;
        
        return { ...business, aiScore: score };
      });
      
      // Sort by AI score and take top 6
      scored.sort((a, b) => b.aiScore - a.aiScore);
      setRecommendations(scored.slice(0, 6));
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    generateRecommendations();
  }, [businesses, businessesLoading, userLocation]);

  const getRecommendationReason = (business: Business & { aiScore: number }) => {
    const reasons = [];
    
    if (business.rating >= 4.7) reasons.push('Highly rated');
    if (business.discountValue >= 15) reasons.push('Great discount');
    if (business.isFeatured) reasons.push('Verified business');
    if (userLocation && business.distanceValue && business.distanceValue < 2) reasons.push('Nearby');
    if (business.reviewCount > 100) reasons.push('Popular choice');
    
    return reasons[0] || 'Recommended for you';
  };

  if (loading || businessesLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mansagold" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-mansagold" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No recommendations available at the moment.</p>
            <Button variant="outline" onClick={generateRecommendations} className="mt-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-mansagold" />
          AI-Powered Recommendations
          <Badge variant="secondary" className="ml-auto">
            Personalized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((business) => (
            <div key={business.id} className="group cursor-pointer">
              <Card className="h-full hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={business.imageUrl}
                    alt={business.imageAlt || business.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/300x128/e0e0e0/808080?text=${business.name.charAt(0)}`;
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 text-mansablue">
                      {business.discount}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="bg-white/90 text-xs">
                      {getRecommendationReason(business as Business & { aiScore: number })}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-mansablue transition-colors">
                    {business.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">{business.category}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-mansagold fill-current" />
                      <span>{business.rating}</span>
                      <span className="text-gray-500">({business.reviewCount})</span>
                    </div>
                    
                    {business.distance && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{business.distance}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={generateRecommendations}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartBusinessRecommendations;
