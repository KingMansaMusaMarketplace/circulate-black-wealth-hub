
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

export interface LoyaltyPoints {
  id: string;
  customer_id: string;
  business_id: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltySummary {
  totalPoints: number;
  totalBusinesses: number;
  recentTransactions: any[];
}

export const useLoyalty = () => {
  const [summary, setSummary] = useState<LoyaltySummary>({
    totalPoints: 0,
    totalBusinesses: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get loyalty points
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('customer_id', user.id);

      if (loyaltyError) {
        console.error('Error fetching loyalty data:', loyaltyError);
        return;
      }

      const totalPoints = loyaltyData?.reduce((sum, record) => sum + (record.points || 0), 0) || 0;
      const totalBusinesses = loyaltyData?.length || 0;

      setSummary({
        totalPoints,
        totalBusinesses,
        recentTransactions: []
      });
    } catch (error) {
      console.error('Error refreshing loyalty data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    summary,
    loading,
    refreshData
  };
};
