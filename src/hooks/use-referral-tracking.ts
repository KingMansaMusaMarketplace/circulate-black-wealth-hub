import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { EnhancedSalesAgent, ReferralClick } from '@/types/multi-location';

export function useReferralTracking(userId: string | null) {
  const [agent, setAgent] = useState<EnhancedSalesAgent | null>(null);
  const [clicks, setClicks] = useState<ReferralClick[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAgentData = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales_agents')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setAgent(data);
    } catch (error: any) {
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralClicks = async () => {
    if (!agent?.id) return;

    try {
      const { data, error } = await supabase
        .from('referral_clicks')
        .select('*')
        .eq('sales_agent_id', agent.id)
        .order('clicked_at', { ascending: false });

      if (error) throw error;
      setClicks(data || []);
    } catch (error: any) {
      console.error('Error fetching referral clicks:', error);
    }
  };

  const trackReferralClick = async (referralCode: string) => {
    try {
      // Get agent by referral code
      const { data: agentData, error: agentError } = await supabase
        .from('sales_agents')
        .select('id')
        .eq('referral_code', referralCode)
        .eq('is_active', true)
        .single();

      if (agentError || !agentData) {
        console.error('Invalid referral code');
        return;
      }

      // Track the click
      const { error } = await supabase
        .from('referral_clicks')
        .insert({
          sales_agent_id: agentData.id,
          referral_code: referralCode,
          user_agent: navigator.userAgent,
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error tracking referral click:', error);
    }
  };

  const getConversionRate = () => {
    if (clicks.length === 0) return 0;
    const converted = clicks.filter(c => c.converted).length;
    return ((converted / clicks.length) * 100).toFixed(2);
  };

  const getTierProgress = () => {
    if (!agent) return { current: 0, next: 20, percentage: 0, nextTier: 'silver' };

    const thresholds = {
      bronze: { next: 20, nextTier: 'silver' },
      silver: { next: 50, nextTier: 'gold' },
      gold: { next: 100, nextTier: 'platinum' },
      platinum: { next: 100, nextTier: 'platinum' },
    };

    const tierInfo = thresholds[agent.tier];
    const percentage = (agent.lifetime_referrals / tierInfo.next) * 100;

    return {
      current: agent.lifetime_referrals,
      next: tierInfo.next,
      percentage: Math.min(percentage, 100),
      nextTier: tierInfo.nextTier,
    };
  };

  useEffect(() => {
    fetchAgentData();
  }, [userId]);

  useEffect(() => {
    if (agent) {
      fetchReferralClicks();
    }
  }, [agent]);

  return {
    agent,
    clicks,
    loading,
    trackReferralClick,
    getConversionRate,
    getTierProgress,
    refetch: fetchAgentData,
  };
}
