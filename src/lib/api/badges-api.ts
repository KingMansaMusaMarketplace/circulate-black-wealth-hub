import { supabase } from '@/integrations/supabase/client';
import { BadgeWithProgress } from '@/types/badges';

/**
 * Get all badges with progress for a sales agent
 */
export const getAgentBadgesWithProgress = async (
  agentId: string
): Promise<BadgeWithProgress[]> => {
  try {
    const { data, error } = await supabase.rpc('get_agent_badges_with_progress', {
      p_sales_agent_id: agentId
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching agent badges:', error);
    throw error;
  }
};

/**
 * Check and award badges for a sales agent based on their current stats
 */
export const checkAndAwardBadges = async (agentId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('check_and_award_badges', {
      p_sales_agent_id: agentId
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error checking and awarding badges:', error);
    throw error;
  }
};

/**
 * Get tier color for badge display
 */
export const getBadgeTierColor = (tier: string): string => {
  const tierColors: Record<string, string> = {
    bronze: 'text-amber-600 bg-amber-50 border-amber-200',
    silver: 'text-gray-600 bg-gray-50 border-gray-200',
    gold: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    platinum: 'text-purple-600 bg-purple-50 border-purple-200',
    diamond: 'text-blue-600 bg-blue-50 border-blue-200'
  };
  return tierColors[tier] || 'text-gray-600 bg-gray-50 border-gray-200';
};
