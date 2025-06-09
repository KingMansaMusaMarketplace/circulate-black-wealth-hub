
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ActivityFeedLoadingStateProps {
  showHeader?: boolean;
  className?: string;
}

const ActivityFeedLoadingState: React.FC<ActivityFeedLoadingStateProps> = ({ 
  showHeader = true, 
  className = "" 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && <h3 className="text-lg font-semibold text-mansablue">Community Activity</h3>}
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActivityFeedLoadingState;
