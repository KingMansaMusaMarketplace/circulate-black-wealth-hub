
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Star } from 'lucide-react';
import { getTierDisplayName, type SubscriptionTier } from '@/lib/services/subscription-tiers';

interface SubscriptionBadgeProps {
  tier: SubscriptionTier;
  className?: string;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ tier, className }) => {
  if (tier === 'free') {
    return (
      <Badge variant="secondary" className={`flex items-center gap-1 ${className}`}>
        <Star className="h-3 w-3" />
        {getTierDisplayName(tier)}
      </Badge>
    );
  }

  return (
    <Badge 
      className={`flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white ${className}`}
    >
      <Crown className="h-3 w-3" />
      {getTierDisplayName(tier)}
    </Badge>
  );
};

export default SubscriptionBadge;
