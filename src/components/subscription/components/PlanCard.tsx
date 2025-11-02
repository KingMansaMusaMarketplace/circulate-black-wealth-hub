
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type SubscriptionTier, type TierInfo } from '@/lib/services/subscription-tiers';
import { tierIcons, tierColors } from '../constants/tierConstants';
import { TierFeatures } from './TierFeatures';
import { useScreenshotMode } from '@/hooks/use-screenshot-mode';

interface PlanCardProps {
  tierKey: SubscriptionTier;
  tier: TierInfo;
  currentTier: SubscriptionTier;
  loading: SubscriptionTier | null;
  onSubscribe: (tier: SubscriptionTier) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  tierKey,
  tier,
  currentTier,
  loading,
  onSubscribe
}) => {
  const Icon = tierIcons[tierKey];
  const isCurrentTier = currentTier === tierKey;
  const isLoading = loading === tierKey;
  const isScreenshotMode = useScreenshotMode();

  const handleButtonClick = () => {
    console.log('Plan card button clicked for tier:', tierKey);
    onSubscribe(tierKey);
  };

  return (
    <Card 
      className={`relative transition-all duration-300 hover:shadow-lg ${
        tier.popular ? 'ring-2 ring-mansablue scale-105' : ''
      } ${isCurrentTier ? 'ring-2 ring-mansagold' : ''}`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-mansablue text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      {isCurrentTier && (
        <div className="absolute -top-4 right-4">
          <Badge className="bg-mansagold text-white px-3 py-1">
            Current Plan
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${tierColors[tierKey]}`}>
          <Icon className="h-8 w-8" />
        </div>
        
        <CardTitle className="text-xl font-bold">
          {tier.displayName}
        </CardTitle>
        
        <CardDescription className="text-sm">
          {tier.description}
        </CardDescription>
        
        {!isScreenshotMode && (
          <div className="mt-4">
            <span className="text-3xl font-bold">
              ${tier.price}
            </span>
            {tier.price > 0 && (
              <span className="text-gray-500">/{tier.interval}</span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <TierFeatures tier={tier} />

        <Button 
          className={`w-full mt-6 ${
            isCurrentTier 
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
              : tier.popular 
                ? 'bg-mansablue hover:bg-mansablue-dark' 
                : ''
          }`}
          onClick={handleButtonClick}
          disabled={isCurrentTier || isLoading}
        >
          {isScreenshotMode ? (
            'Get Started'
          ) : isLoading ? (
            'Processing...'
          ) : isCurrentTier ? (
            'Current Plan'
          ) : tier.price === 0 ? (
            'Current Plan'
          ) : (
            `Subscribe for $${tier.price}/${tier.interval}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
