
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useLoyalty } from '@/hooks/use-loyalty';
import { Link } from 'react-router-dom';

interface MiniLoyaltyWidgetProps {
  showLink?: boolean;
  className?: string;
}

export const MiniLoyaltyWidget: React.FC<MiniLoyaltyWidgetProps> = ({ 
  showLink = true,
  className = ''
}) => {
  const { loyaltyPoints, isLoading, nextRewardThreshold, currentTier } = useLoyalty();
  
  // Calculate progress percentage toward next tier/reward
  const progress = nextRewardThreshold > 0 
    ? Math.min(Math.floor((loyaltyPoints / nextRewardThreshold) * 100), 100) 
    : 0;
  
  return (
    <Card className={`border-mansagold/20 overflow-hidden ${className}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-mansagold" />
            <span className="font-semibold text-sm">Loyalty Points</span>
          </div>
          {showLink && (
            <Link 
              to="/loyalty" 
              className="text-xs text-mansablue hover:text-mansablue-dark flex items-center"
            >
              Details
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          )}
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-mansablue">
            {isLoading ? '---' : loyaltyPoints?.toLocaleString() || 0}
          </span>
          <span className="text-gray-500 text-sm">points</span>
        </div>
        
        {currentTier && (
          <div className="text-xs text-gray-600">
            Current tier: <span className="font-semibold">{currentTier}</span>
          </div>
        )}
        
        {nextRewardThreshold > 0 && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{progress}% to next reward</span>
              <span>{nextRewardThreshold - loyaltyPoints} points needed</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
