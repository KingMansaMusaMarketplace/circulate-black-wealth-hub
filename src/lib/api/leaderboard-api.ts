import { supabase } from '@/integrations/supabase/client';

export type TimePeriod = 'all_time' | 'yearly' | 'quarterly' | 'monthly';

export interface LeaderboardEntry {
  agent_id: string;
  agent_name: string;
  referral_code: string;
  tier: string;
  total_referrals: number;
  active_referrals: number;
  rank: number;
}

/**
 * Get agent leaderboard data
 */
export const getLeaderboard = async (
  timePeriod: TimePeriod = 'all_time',
  limit: number = 50
): Promise<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase.rpc('get_agent_leaderboard', {
      p_time_period: timePeriod,
      p_limit: limit
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};
