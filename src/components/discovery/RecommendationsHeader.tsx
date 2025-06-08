
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

const RecommendationsHeader: React.FC = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-mansablue">Recommended For You</h2>
        <Button variant="link" className="text-mansablue">
          View All
        </Button>
      </div>
    </>
  );
};

export const RecommendationsFooter: React.FC = () => {
  return (
    <div className="flex justify-center mt-6">
      <Button variant="outline" className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        More Recommendations
      </Button>
    </div>
  );
};

export default RecommendationsHeader;
