import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Headphones, MapPin, Palette } from 'lucide-react';

const ENTERPRISE_TIERS = new Set(['kayla_enterprise', 'enterprise']);

/**
 * Renders Enterprise-only quick links (seats, concierge, locations, white-label).
 * Returns null for non-Enterprise users.
 */
export const EnterpriseQuickAccessCard: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptionInfo, isLoading } = useSubscription();

  if (isLoading) return null;
  const tier = subscriptionInfo?.subscription_tier ?? '';
  if (!ENTERPRISE_TIERS.has(tier)) return null;

  return (
    <Card className="border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mansagold/20 to-transparent rounded-full blur-2xl" />
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 bg-gradient-to-br from-[#003366] to-[#FFB300] rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-400 via-mansagold to-amber-400 bg-clip-text text-transparent">
            Enterprise Tools
          </span>
        </CardTitle>
        <CardDescription className="text-slate-400">
          Manage seats, concierge, locations & white-label
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 relative z-10">
        <Button
          onClick={() => navigate('/business/enterprise/seats')}
          className="w-full justify-start gap-2 text-white border-white/20 hover:bg-mansablue/10 hover:border-mansablue/30 transition-all"
          variant="outline"
        >
          <Users className="w-4 h-4" />
          Manage Seats
        </Button>
        <Button
          onClick={() => navigate('/business/enterprise/concierge')}
          className="w-full justify-start gap-2 text-white border-white/20 hover:bg-mansagold/10 hover:border-mansagold/30 transition-all"
          variant="outline"
        >
          <Headphones className="w-4 h-4" />
          Enterprise Concierge & SLA
        </Button>
        <Button
          onClick={() => navigate('/business/locations')}
          className="w-full justify-start gap-2 text-white border-white/20 hover:bg-mansablue/10 hover:border-mansablue/30 transition-all"
          variant="outline"
        >
          <MapPin className="w-4 h-4" />
          Multi-Location
        </Button>
        <Button
          onClick={() => navigate('/business/white-label')}
          className="w-full justify-start gap-2 bg-gradient-to-r from-[#003366] to-[#FFB300] hover:opacity-90 text-white shadow-lg transition-all"
        >
          <Palette className="w-4 h-4" />
          White-Label Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnterpriseQuickAccessCard;
