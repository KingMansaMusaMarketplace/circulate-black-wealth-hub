import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Crown,
  Shield,
  Camera,
  TrendingUp,
  Headphones,
  CheckCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';

type ServiceTier = 'basic' | 'premium';

interface TierInfo {
  name: string;
  fee: string;
  feePercent: number;
  description: string;
  features: { icon: React.ElementType; label: string; included: boolean }[];
  badge: string;
  color: string;
}

const TIERS: Record<ServiceTier, TierInfo> = {
  basic: {
    name: 'Basic',
    fee: '7.5%',
    feePercent: 7.5,
    description: 'Marketplace listing with community support',
    badge: 'Self-Managed',
    color: 'text-blue-400',
    features: [
      { icon: Shield, label: 'Marketplace listing', included: true },
      { icon: CheckCircle, label: 'Community support', included: true },
      { icon: TrendingUp, label: 'Basic analytics', included: true },
      { icon: Camera, label: 'Professional photography', included: false },
      { icon: TrendingUp, label: 'Dynamic pricing optimization', included: false },
      { icon: Headphones, label: '24/7 guest communication', included: false },
    ],
  },
  premium: {
    name: 'Managed by Mansa',
    fee: '12%',
    feePercent: 12,
    description: 'Full-service management with premium support',
    badge: 'Managed by Mansa',
    color: 'text-mansagold',
    features: [
      { icon: Shield, label: 'Priority marketplace listing', included: true },
      { icon: CheckCircle, label: 'Dedicated host success manager', included: true },
      { icon: TrendingUp, label: 'Advanced analytics dashboard', included: true },
      { icon: Camera, label: 'Professional photography', included: true },
      { icon: TrendingUp, label: 'Dynamic pricing optimization', included: true },
      { icon: Headphones, label: '24/7 guest communication', included: true },
    ],
  },
};

const ManagedByMansaTierCard: React.FC = () => {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<ServiceTier>('basic');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) fetchCurrentTier();
  }, [user]);

  const fetchCurrentTier = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('vacation_properties')
        .select('service_tier')
        .eq('host_id', user.id)
        .limit(1)
        .maybeSingle();
      if (data?.service_tier) setCurrentTier(data.service_tier as ServiceTier);
    } catch (err) {
      console.error('Error fetching tier:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTier = async (tier: ServiceTier) => {
    if (!user || tier === currentTier) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('vacation_properties')
        .update({ service_tier: tier })
        .eq('host_id', user.id);
      if (error) throw error;
      setCurrentTier(tier);
      toast.success(`Upgraded to ${TIERS[tier].name}!`);
    } catch (err: any) {
      toast.error('Failed to update service tier');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Crown className="w-6 h-6 text-mansagold" />
          Choose Your Service Tier
        </h2>
        <p className="text-white/60 mt-1">
          Select the level of management support for your properties
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {(Object.entries(TIERS) as [ServiceTier, TierInfo][]).map(([tier, info]) => {
          const isActive = currentTier === tier;
          const isPremium = tier === 'premium';
          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isPremium ? 0.1 : 0 }}
            >
              <Card
                className={`relative overflow-hidden transition-all ${
                  isActive
                    ? isPremium
                      ? 'border-mansagold/60 bg-mansagold/10 shadow-lg shadow-mansagold/20'
                      : 'border-blue-400/50 bg-blue-500/10'
                    : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                }`}
              >
                {isPremium && (
                  <div className="absolute top-0 right-0 bg-mansagold text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    RECOMMENDED
                  </div>
                )}
                {isActive && (
                  <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                    CURRENT PLAN
                  </div>
                )}
                <CardHeader className="pt-8">
                  <CardTitle className={`text-xl ${info.color}`}>
                    {info.name}
                  </CardTitle>
                  <p className="text-white/60 text-sm">{info.description}</p>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-white">{info.fee}</span>
                    <span className="text-white/50 text-sm ml-1">platform fee</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {info.features.map((feature, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 text-sm ${
                          feature.included ? 'text-white' : 'text-white/30'
                        }`}
                      >
                        {feature.included ? (
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" />
                        )}
                        <span>{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => updateTier(tier)}
                    disabled={isActive || updating}
                    className={`w-full mt-4 ${
                      isPremium
                        ? 'bg-mansagold hover:bg-mansagold/90 text-black'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {updating ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : isActive ? (
                      'Current Plan'
                    ) : isPremium ? (
                      'Upgrade to Premium'
                    ) : (
                      'Switch to Basic'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Value comparison */}
      <Card className="bg-slate-800/30 border-white/10">
        <CardContent className="p-6">
          <h3 className="text-white font-semibold mb-3">Why Managed by Mansa?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Camera className="w-5 h-5 text-mansagold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Professional Photography</p>
                <p className="text-white/50">Listings with pro photos get 40% more bookings</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-mansagold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Dynamic Pricing</p>
                <p className="text-white/50">AI-optimized rates increase revenue by 20%</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Headphones className="w-5 h-5 text-mansagold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">24/7 Guest Support</p>
                <p className="text-white/50">We handle all guest communication for you</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagedByMansaTierCard;
