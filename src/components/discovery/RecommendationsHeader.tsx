
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

const RecommendationsHeader: React.FC = () => {
  return (
    <>
      <div className="flex justify-between items-center animate-slide-in-right">
        <h2 className="text-2xl font-display font-bold text-mansablue">Recommended For You</h2>
        <Button variant="link" className="text-mansablue hover:scale-105 transition-transform">
          View All
        </Button>
      </div>
    </>
  );
};

export const RecommendationsFooter: React.FC = () => {
  return (
    <div className="flex justify-center mt-6 animate-fade-in">
      <Button variant="outline" className="flex items-center gap-2 hover:scale-105 transition-all">
        <TrendingUp className="h-4 w-4" />
        More Recommendations
      </Button>
    </div>
  );
};

export default RecommendationsHeader;
