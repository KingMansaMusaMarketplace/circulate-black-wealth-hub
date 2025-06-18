
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserImpactMetrics {
  total_spending: number;
  businesses_supported: number;
  transactions_count: number;
  estimated_jobs_created: number;
  wealth_circulated: number;
  circulation_multiplier: number;
}

interface CommunityMetrics {
  total_users: number;
  total_businesses: number;
  total_circulation: number;
  total_transactions: number;
  active_this_month: number;
  estimated_jobs_created: number;
}

export const useCommunityImpact = (userId?: string) => {
  const [userMetrics, setUserMetrics] = useState<UserImpactMetrics | null>(null);
  const [communityMetrics, setCommunityMetrics] = useState<CommunityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchImpactMetrics = async () => {
    try {
      setLoading(true);

      // Always fetch community metrics, regardless of user authentication
      const { data: communityData, error: communityError } = await supabase
        .rpc('get_community_impact_summary');

      if (communityError) {
        console.error('Error fetching community metrics:', communityError);
      } else {
        setCommunityMetrics(communityData);
      }

      // Only fetch user metrics if user is authenticated
      if (userId) {
        const { data: userImpactData, error: userError } = await supabase
          .rpc('calculate_user_impact_metrics', { p_user_id: userId });

        if (userError) {
          console.error('Error fetching user metrics:', userError);
        } else {
          setUserMetrics(userImpactData);
        }
      }

    } catch (error) {
      console.error('Error fetching impact metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always fetch data, even without a user
    fetchImpactMetrics();
  }, [userId]);

  return {
    userMetrics,
    communityMetrics,
    loading,
    refetch: fetchImpactMetrics
  };
};
