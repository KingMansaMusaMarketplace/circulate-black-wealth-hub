import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRO_TIERS = new Set([
  'kayla_pro',
  'kayla_pro_annual',
  'kayla_pro_founders',
  'kayla_enterprise',
  // Legacy grandfathered tiers that paid for the full Kayla suite
  'business_pro_kayla',
  'business_pro_kayla_annual',
]);

interface B2BProGateProps {
  children: React.ReactNode;
}

/**
 * Gates B2B matchmaking behind Kayla AI Pro ($299/mo) or higher.
 * The B2B Dashboard is a headline Pro deliverable.
 */
export const B2BProGate: React.FC<B2BProGateProps> = ({ children }) => {
  const { subscriptionInfo, loading } = useSubscription();

  if (loading) return null;

  const tier = subscriptionInfo?.subscription_tier ?? '';
  if (PRO_TIERS.has(tier)) {
    return <>{children}</>;
  }

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-white">Kayla AI Pro Required</CardTitle>
          <CardDescription className="text-slate-400">
            B2B matchmaking & connections are part of the Kayla AI Pro suite ($299/mo).
            Start your 14-day free trial to unlock the full 28-service suite.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-amber-300">
            <Lock className="h-4 w-4" />
            <span>Upgrade to access this feature</span>
          </div>
          <div className="flex gap-2">
            <Link to="/pricing" className="flex-1">
              <Button variant="outline" className="w-full border-white/20 text-slate-200 hover:bg-white/10">
                View Plans
              </Button>
            </Link>
            <Link to="/pricing#kayla-pro" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                Start Pro Trial
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BProGate;
