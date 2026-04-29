import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ENTERPRISE_TIERS = new Set([
  'kayla_enterprise',
  'enterprise', // legacy grandfathered
]);

interface EnterpriseGateProps {
  children: React.ReactNode;
  featureName?: string;
}

/**
 * Gates Enterprise-only features ($899/mo + $50/user/mo):
 * - Multi-location management
 * - White-label solutions
 * - Custom API integrations
 */
export const EnterpriseGate: React.FC<EnterpriseGateProps> = ({ children, featureName = 'This feature' }) => {
  const { subscriptionInfo, isLoading } = useSubscription();

  if (isLoading) return null;

  const tier = subscriptionInfo?.subscription_tier ?? '';
  if (ENTERPRISE_TIERS.has(tier)) {
    return <>{children}</>;
  }

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-gradient-to-r from-[#003366] to-[#FFB300] flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-white">Kayla AI Enterprise Required</CardTitle>
          <CardDescription className="text-slate-400">
            {featureName} is part of the Kayla AI Enterprise plan (from $899/mo + $50/user/mo).
            Includes multi-location management, white-label solutions, dedicated account manager,
            custom API integrations, and an Enterprise SLA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-amber-300">
            <Lock className="h-4 w-4" />
            <span>Contact Sales to unlock Enterprise features</span>
          </div>
          <div className="flex gap-2">
            <Link to="/pricing" className="flex-1">
              <Button variant="outline" className="w-full border-white/20 text-slate-200 hover:bg-white/10">
                View Plans
              </Button>
            </Link>
            <Link to="/contact" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-[#003366] to-[#FFB300] text-white hover:opacity-90">
                Contact Sales
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterpriseGate;
