
import React from 'react';
import { subscriptionTiers, type SubscriptionTier } from '@/lib/services/subscription-tiers';
import { PlanCard } from './components/PlanCard';
import { useSubscriptionActions } from './hooks/useSubscriptionActions';

interface SubscriptionPlansProps {
  currentTier?: SubscriptionTier;
  onPlanSelect?: (tier: SubscriptionTier) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  currentTier = 'free', 
  onPlanSelect 
}) => {
  const { loading, handleSubscribe } = useSubscriptionActions({ onPlanSelect });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {Object.entries(subscriptionTiers).map(([key, tier]) => {
        const tierKey = key as SubscriptionTier;
        
        return (
          <PlanCard
            key={tierKey}
            tierKey={tierKey}
            tier={tier}
            currentTier={currentTier}
            loading={loading}
            onSubscribe={handleSubscribe}
          />
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;
