
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { useLoyalty } from '@/hooks/use-loyalty';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const LoyaltyPointsIndicator: React.FC = () => {
  const { loyaltyPoints, isLoading } = useLoyalty();
  
  if (isLoading) {
    return <Skeleton className="h-6 w-16 bg-mansablue/20" />;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-mansagold/20 to-mansagold/30 hover:from-mansagold/30 hover:to-mansagold/40 transition-colors">
            <Sparkles className="h-4 w-4 text-mansagold" />
            <Badge variant="outline" className="bg-white/90 text-mansablue font-semibold">
              {loyaltyPoints?.toLocaleString() || 0} pts
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Your current loyalty points</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
