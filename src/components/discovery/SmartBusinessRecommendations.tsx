
import React from 'react';
import { LocationData } from '@/hooks/location/types';
import { useSmartRecommendations } from '@/hooks/use-smart-recommendations';
import RecommendationsLoadingSkeleton from './RecommendationsLoadingSkeleton';
import RecommendationsHeader, { RecommendationsFooter } from './RecommendationsHeader';
import BusinessRecommendationCard from './BusinessRecommendationCard';

interface SmartBusinessRecommendationsProps {
  userLocation?: LocationData | null;
}

const SmartBusinessRecommendations: React.FC<SmartBusinessRecommendationsProps> = ({ userLocation }) => {
  const { recommendations, loading } = useSmartRecommendations(userLocation);

  if (loading) {
    return <RecommendationsLoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      <RecommendationsHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((business) => (
          <BusinessRecommendationCard key={business.id} business={business} />
        ))}
      </div>
      
      <RecommendationsFooter />
    </div>
  );
};

export default SmartBusinessRecommendations;
