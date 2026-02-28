import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CreditBalance {
  credits_balance: number;
  total_earned: number;
  total_redeemed: number;
}

export interface CreditTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string | null;
  created_at: string;
  business?: { business_name: string } | null;
}

export function useNoireCommunityCredits() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<CreditBalance>({ credits_balance: 0, total_earned: 0, total_redeemed: 0 });
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const [balRes, txRes] = await Promise.all([
        supabase.from('noire_community_credits').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('noire_credit_transactions')
          .select('*, business:businesses(business_name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      if (balRes.data) setBalance(balRes.data as any);
      if (txRes.data) setTransactions(txRes.data as any[]);
    } catch (err) {
      console.error('Error fetching community credits:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { balance, transactions, loading, refetch: fetchData };
}
