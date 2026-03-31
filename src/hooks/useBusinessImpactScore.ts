import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ImpactScorecard {
  business_id: string;
  overall_score: number;
  tier: string;
  wealth_circulation_score: number;
  jobs_supported_score: number;
  community_engagement_score: number;
  b2b_connections_score: number;
  reviews_reputation_score: number;
  total_revenue_circulated: number;
  total_transactions: number;
  unique_customers: number;
  jobs_created_equivalent: number;
  b2b_connections_count: number;
  total_reviews: number;
  average_rating: number;
  qr_scans: number;
  last_calculated_at: string;
}

export interface LeaderboardEntry extends ImpactScorecard {
  business_name: string;
  logo_url: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  is_verified: boolean;
}

export const TIER_CONFIG: Record<string, { label: string; color: string; emoji: string; minScore: number }> = {
  diamond: { label: 'Diamond', color: 'from-cyan-400 to-blue-500', emoji: '💎', minScore: 800 },
  gold: { label: 'Gold', color: 'from-yellow-400 to-amber-500', emoji: '🥇', minScore: 600 },
  silver: { label: 'Silver', color: 'from-gray-300 to-gray-400', emoji: '🥈', minScore: 400 },
  bronze: { label: 'Bronze', color: 'from-amber-600 to-orange-700', emoji: '🥉', minScore: 200 },
  rising: { label: 'Rising', color: 'from-green-400 to-emerald-500', emoji: '🌱', minScore: 50 },
  seed: { label: 'Seed', color: 'from-slate-400 to-slate-500', emoji: '🌰', minScore: 0 },
};

export function useBusinessImpactScore(businessId?: string) {
  const [scorecard, setScorecard] = useState<ImpactScorecard | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScorecard = useCallback(async () => {
    if (!businessId) { setLoading(false); return; }
    try {
      // First try to get cached scorecard
      const { data, error } = await supabase
        .from('business_impact_scorecards')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();

      if (!error && data) {
        setScorecard(data as any);
      }
    } catch (err) {
      console.error('Error fetching impact scorecard:', err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const recalculate = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('calculate_business_impact_scorecard', { p_business_id: businessId });
      if (!error && data) {
        setScorecard(data as any);
      }
    } catch (err) {
      console.error('Error calculating impact scorecard:', err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => { fetchScorecard(); }, [fetchScorecard]);

  return { scorecard, loading, recalculate };
}

export function useImpactLeaderboard(limit = 10) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_impact_leaderboard', { p_limit: limit });
        if (!error && data) {
          setLeaderboard(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [limit]);

  return { leaderboard, loading };
}
