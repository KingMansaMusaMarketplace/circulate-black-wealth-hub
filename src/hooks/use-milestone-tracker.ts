import { useEffect } from 'react';
import { trackAndNotifyMilestones } from '@/lib/api/milestone-tracker';

/**
 * Hook to track agent milestones after certain actions
 */
export const useMilestoneTracker = (
  agentId: string | null | undefined,
  dependencies: any[] = []
) => {
  useEffect(() => {
    if (!agentId) return;

    // Track milestones when dependencies change
    const checkMilestones = async () => {
      try {
        await trackAndNotifyMilestones(agentId);
      } catch (error) {
        console.error('Error tracking milestones:', error);
      }
    };

    checkMilestones();
  }, [agentId, ...dependencies]);
};

/**
 * Manually trigger milestone check
 */
export const triggerMilestoneCheck = async (
  agentId: string,
  previousStats?: {
    totalReferrals?: number;
    totalEarned?: number;
    conversionRate?: number;
  }
): Promise<void> => {
  await trackAndNotifyMilestones(agentId, previousStats);
};
