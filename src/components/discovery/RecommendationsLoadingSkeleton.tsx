
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const RecommendationsLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-mansablue">Recommended For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsLoadingSkeleton;
