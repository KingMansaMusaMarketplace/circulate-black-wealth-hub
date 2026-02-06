
import { useState, useEffect, useMemo } from 'react';
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

// Fallback values only used when database returns null/empty
const FALLBACK_COMMUNITY_METRICS: CommunityMetrics = {
  total_users: 0,
  total_businesses: 0,
  total_circulation: 0,
  total_transactions: 0,
  active_this_month: 0,
  estimated_jobs_created: 0,
};

export const useCommunityImpact = (userId?: string) => {
  const [userMetrics, setUserMetrics] = useState<UserImpactMetrics | null>(null);
  const [communityMetrics, setCommunityMetrics] = useState<CommunityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRealData, setHasRealData] = useState(false);

  const fetchImpactMetrics = async () => {
    try {
      setLoading(true);

      // Always fetch community metrics, regardless of user authentication
      const { data: communityData, error: communityError } = await supabase
        .rpc('get_community_impact_summary');

      if (communityError) {
        console.error('Error fetching community metrics:', communityError);
        setCommunityMetrics(FALLBACK_COMMUNITY_METRICS);
        setHasRealData(false);
      } else if (communityData) {
        // Check if we have meaningful data
        const hasData = communityData.total_users > 0 || 
                       communityData.total_businesses > 0 ||
                       communityData.total_transactions > 0;
        
        setCommunityMetrics(communityData);
        setHasRealData(hasData);
      } else {
        setCommunityMetrics(FALLBACK_COMMUNITY_METRICS);
        setHasRealData(false);
      }

      // Only fetch user metrics if user is authenticated
      if (userId) {
        const { data: userImpactData, error: userError } = await supabase
          .rpc('calculate_user_impact_metrics', { p_user_id: userId });

        if (userError) {
          console.error('Error fetching user metrics:', userError);
          setUserMetrics(null);
        } else {
          setUserMetrics(userImpactData);
        }
      }

    } catch (error) {
      console.error('Error fetching impact metrics:', error);
      setCommunityMetrics(FALLBACK_COMMUNITY_METRICS);
      setHasRealData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always fetch data, even without a user
    fetchImpactMetrics();
  }, [userId]);

  // Determine if user has made any impact
  const userHasImpact = useMemo(() => {
    if (!userMetrics) return false;
    return userMetrics.total_spending > 0 || userMetrics.businesses_supported > 0;
  }, [userMetrics]);

  return {
    userMetrics,
    communityMetrics,
    loading,
    hasRealData,
    userHasImpact,
    refetch: fetchImpactMetrics
  };
};

