import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ReferralCampaign {
  id: string;
  name: string;
  description: string | null;
  campaign_type: string;
  bonus_multiplier: number;
  bonus_type: string;
  bonus_points: number;
  bonus_cash: number;
  start_date: string;
  end_date: string;
  max_participants: number | null;
  target_referrals: number | null;
  banner_image_url: string | null;
  banner_color: string;
  is_active: boolean;
  is_featured: boolean;
  is_joined?: boolean;
  participant_count?: number;
  my_rank?: number;
  my_referrals?: number;
}

export interface CampaignLeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  referrals: number;
  points: number;
  is_current_user: boolean;
}

export interface Milestone {
  milestone_id: string;
  milestone_count: number;
  milestone_name: string;
  description: string | null;
  badge_name: string | null;
  badge_icon: string | null;
  badge_color: string | null;
  reward_points: number;
  reward_cash: number;
  is_unlocked: boolean;
  unlocked_at: string | null;
  reward_claimed: boolean;
  progress_percent: number;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_referral_date: string | null;
  streak_started_at: string | null;
  total_streak_days: number;
  streak_frozen_until: string | null;
  freeze_count: number;
}

export const useReferralCampaigns = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch active campaigns
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['referral-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_active_campaigns');
      if (error) throw error;
      return (data || []) as ReferralCampaign[];
    },
    enabled: !!user,
  });

  // Fetch user's milestone progress
  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ['referral-milestones', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_milestone_progress');
      if (error) throw error;
      return (data || []) as Milestone[];
    },
    enabled: !!user,
  });

  // Fetch user's streak
  const { data: streak, isLoading: streakLoading } = useQuery({
    queryKey: ['referral-streak', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('referral_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as UserStreak | null;
    },
    enabled: !!user,
  });

  // Join campaign mutation
  const joinCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('referral_campaign_participants')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-campaigns'] });
      toast.success('Successfully joined campaign! 🎉');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('You have already joined this campaign');
      } else {
        toast.error('Failed to join campaign');
      }
    },
  });

  // Claim milestone reward mutation
  const claimMilestoneRewardMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('user_milestone_progress')
        .update({
          reward_claimed: true,
          claimed_at: new Date().toISOString(),
        })
        .eq('milestone_id', milestoneId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referral-milestones'] });
      toast.success('Reward claimed! 🎁');
    },
    onError: () => {
      toast.error('Failed to claim reward');
    },
  });

  // Get campaign leaderboard
  const getCampaignLeaderboard = async (campaignId: string, limit: number = 10): Promise<CampaignLeaderboardEntry[]> => {
    const { data, error } = await supabase.rpc('get_campaign_leaderboard', {
      p_campaign_id: campaignId,
      p_limit: limit,
    });
    if (error) throw error;
    return (data || []) as CampaignLeaderboardEntry[];
  };

  // Get featured campaign
  const featuredCampaign = campaigns?.find(c => c.is_featured) || campaigns?.[0];

  // Get time remaining for a campaign
  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const diff = end - now;
    
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes, expired: false };
  };

  // Get next milestone to unlock
  const nextMilestone = milestones?.find(m => !m.is_unlocked);

  // Get unlocked milestones that haven't been claimed
  const unclaimedMilestones = milestones?.filter(m => m.is_unlocked && !m.reward_claimed) || [];

  return {
    campaigns: campaigns || [],
    featuredCampaign,
    milestones: milestones || [],
    nextMilestone,
    unclaimedMilestones,
    streak,
    isLoading: campaignsLoading || milestonesLoading || streakLoading,
    joinCampaign: joinCampaignMutation.mutate,
    joiningCampaign: joinCampaignMutation.isPending,
    claimMilestoneReward: claimMilestoneRewardMutation.mutate,
    claimingMilestone: claimMilestoneRewardMutation.isPending,
    getCampaignLeaderboard,
    getTimeRemaining,
  };
};
