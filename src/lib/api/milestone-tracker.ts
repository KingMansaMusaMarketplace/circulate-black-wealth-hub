import { supabase } from '@/integrations/supabase/client';

export interface MilestoneConfig {
  type: string;
  threshold: number;
  description: string;
}

// Define agent milestones
export const AGENT_MILESTONES: MilestoneConfig[] = [
  { type: 'first_referral', threshold: 1, description: 'First Referral' },
  { type: 'referrals_10', threshold: 10, description: '10 Referrals' },
  { type: 'referrals_25', threshold: 25, description: '25 Referrals' },
  { type: 'referrals_50', threshold: 50, description: '50 Referrals' },
  { type: 'referrals_100', threshold: 100, description: '100 Referrals' },
  { type: 'earnings_100', threshold: 100, description: '$100 Earned' },
  { type: 'earnings_500', threshold: 500, description: '$500 Earned' },
  { type: 'earnings_1000', threshold: 1000, description: '$1,000 Earned' },
  { type: 'earnings_5000', threshold: 5000, description: '$5,000 Earned' },
  { type: 'conversion_50', threshold: 50, description: '50% Conversion Rate' },
  { type: 'conversion_75', threshold: 75, description: '75% Conversion Rate' },
];

/**
 * Check if an agent has reached any new milestones
 */
export const checkAgentMilestones = async (
  agentId: string,
  previousStats?: {
    totalReferrals?: number;
    totalEarned?: number;
    conversionRate?: number;
  }
): Promise<MilestoneConfig[]> => {
  try {
    // Fetch current agent stats
    const { data: agent, error: agentError } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      console.error('Error fetching agent:', agentError);
      return [];
    }

    // Get referral count
    const { count: referralCount } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('sales_agent_id', agentId);

    const { count: activeReferrals } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('sales_agent_id', agentId)
      .eq('subscription_status', 'active');

    const currentStats = {
      totalReferrals: referralCount || 0,
      totalEarned: agent.total_earned || 0,
      conversionRate: referralCount && activeReferrals 
        ? (activeReferrals / referralCount) * 100 
        : 0
    };

    const newMilestones: MilestoneConfig[] = [];

    // Check referral milestones
    const referralMilestones = AGENT_MILESTONES.filter(m => m.type.startsWith('referrals_'));
    for (const milestone of referralMilestones) {
      const previousValue = previousStats?.totalReferrals || 0;
      if (currentStats.totalReferrals >= milestone.threshold && previousValue < milestone.threshold) {
        newMilestones.push(milestone);
      }
    }

    // Check earnings milestones
    const earningsMilestones = AGENT_MILESTONES.filter(m => m.type.startsWith('earnings_'));
    for (const milestone of earningsMilestones) {
      const previousValue = previousStats?.totalEarned || 0;
      if (currentStats.totalEarned >= milestone.threshold && previousValue < milestone.threshold) {
        newMilestones.push(milestone);
      }
    }

    // Check conversion rate milestones
    const conversionMilestones = AGENT_MILESTONES.filter(m => m.type.startsWith('conversion_'));
    for (const milestone of conversionMilestones) {
      const previousValue = previousStats?.conversionRate || 0;
      if (currentStats.conversionRate >= milestone.threshold && previousValue < milestone.threshold) {
        newMilestones.push(milestone);
      }
    }

    return newMilestones;
  } catch (error) {
    console.error('Error checking agent milestones:', error);
    return [];
  }
};

/**
 * Notify admin about agent milestones
 */
export const notifyAgentMilestones = async (
  agentId: string,
  milestones: MilestoneConfig[]
): Promise<void> => {
  if (milestones.length === 0) return;

  try {
    // Get agent details
    const { data: agent, error: agentError } = await supabase
      .from('sales_agents')
      .select('full_name, email, total_earned')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      console.error('Error fetching agent for notification:', agentError);
      return;
    }

    // Get referral count
    const { count: referralCount } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('sales_agent_id', agentId);

    // Send notification for each milestone
    for (const milestone of milestones) {
      let milestoneValue = 0;
      
      if (milestone.type.startsWith('referrals_')) {
        milestoneValue = referralCount || 0;
      } else if (milestone.type.startsWith('earnings_')) {
        milestoneValue = agent.total_earned || 0;
      } else if (milestone.type.startsWith('conversion_')) {
        const { count: activeReferrals } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('sales_agent_id', agentId)
          .eq('subscription_status', 'active');
        milestoneValue = referralCount ? ((activeReferrals || 0) / referralCount) * 100 : 0;
      }

      await supabase.functions.invoke('send-admin-notification', {
        body: {
          type: 'agent_milestone_reached',
          data: {
            agentId: agentId,
            agentName: agent.full_name,
            agentEmail: agent.email,
            milestoneType: milestone.type,
            milestoneValue: milestoneValue,
            previousValue: milestone.threshold - 1
          }
        }
      });
    }

    console.log(`Sent ${milestones.length} milestone notification(s) for agent ${agent.full_name}`);
  } catch (error) {
    console.error('Error sending milestone notifications:', error);
  }
};

/**
 * Track and notify milestone achievement
 */
export const trackAndNotifyMilestones = async (
  agentId: string,
  previousStats?: {
    totalReferrals?: number;
    totalEarned?: number;
    conversionRate?: number;
  }
): Promise<void> => {
  const newMilestones = await checkAgentMilestones(agentId, previousStats);
  
  if (newMilestones.length > 0) {
    await notifyAgentMilestones(agentId, newMilestones);
  }
};
