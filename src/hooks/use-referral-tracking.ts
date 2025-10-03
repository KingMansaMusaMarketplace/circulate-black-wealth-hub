import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AgentTier {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  commission_rate: number;
  lifetime_referrals: number;
  monthly_referrals: number;
}

export interface ReferralClick {
  id: string;
  clicked_at: string;
  converted: boolean;
  converted_user_id: string | null;
  ip_address: string | null;
}

export function useReferralTracking(salesAgentId?: string) {
  const [agentTier, setAgentTier] = useState<AgentTier | null>(null);
  const [referralClicks, setReferralClicks] = useState<ReferralClick[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!salesAgentId) return;
    
    fetchAgentTier();
    fetchReferralClicks();
  }, [salesAgentId]);

  const fetchAgentTier = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_agents')
        .select('tier, commission_rate, lifetime_referrals, monthly_referrals')
        .eq('id', salesAgentId)
        .single();

      if (error) throw error;
      setAgentTier(data);
    } catch (error) {
      console.error('Error fetching agent tier:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralClicks = async () => {
    try {
      const { data, error } = await supabase
        .from('referral_clicks')
        .select('*')
        .eq('sales_agent_id', salesAgentId)
        .order('clicked_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setReferralClicks(data || []);
    } catch (error) {
      console.error('Error fetching referral clicks:', error);
    }
  };

  const trackReferralClick = async (referralCode: string, ipAddress?: string, userAgent?: string) => {
    try {
      const { data: agent } = await supabase
        .from('sales_agents')
        .select('id')
        .eq('referral_code', referralCode)
        .single();

      if (!agent) return;

      const { error } = await supabase
        .from('referral_clicks')
        .insert({
          sales_agent_id: agent.id,
          referral_code: referralCode,
          ip_address: ipAddress,
          user_agent: userAgent,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking referral click:', error);
    }
  };

  const convertReferral = async (clickId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('referral_clicks')
        .update({
          converted: true,
          converted_user_id: userId,
        })
        .eq('id', clickId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Referral converted successfully',
      });

      await fetchReferralClicks();
    } catch (error: any) {
      console.error('Error converting referral:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to convert referral',
        variant: 'destructive',
      });
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-600';
      case 'gold': return 'bg-yellow-500';
      case 'silver': return 'bg-gray-400';
      default: return 'bg-orange-600';
    }
  };

  const getTierRequirements = (tier: string) => {
    switch (tier) {
      case 'platinum': return { min: 100, rate: 15.0 };
      case 'gold': return { min: 50, rate: 12.5 };
      case 'silver': return { min: 20, rate: 11.0 };
      default: return { min: 0, rate: 10.0 };
    }
  };

  return {
    agentTier,
    referralClicks,
    loading,
    trackReferralClick,
    convertReferral,
    getTierBadgeColor,
    getTierRequirements,
    refetch: () => {
      fetchAgentTier();
      fetchReferralClicks();
    },
  };
}
