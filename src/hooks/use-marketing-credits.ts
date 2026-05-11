import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MarketingCreditsState {
  businessId: string | null;
  planRemaining: number;
  topupRemaining: number;
  total: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const useMarketingCredits = (): MarketingCreditsState => {
  const { user } = useAuth();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [planRemaining, setPlanRemaining] = useState(0);
  const [topupRemaining, setTopupRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data: biz } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!biz) { setBusinessId(null); setPlanRemaining(0); setTopupRemaining(0); return; }
      setBusinessId(biz.id);

      const { data: credits } = await supabase
        .from('marketing_credits')
        .select('plan_credits_remaining, topup_credits_remaining')
        .eq('business_id', biz.id)
        .maybeSingle();

      setPlanRemaining(credits?.plan_credits_remaining ?? 0);
      setTopupRemaining(credits?.topup_credits_remaining ?? 0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    businessId,
    planRemaining,
    topupRemaining,
    total: planRemaining + topupRemaining,
    loading,
    refresh,
  };
};
