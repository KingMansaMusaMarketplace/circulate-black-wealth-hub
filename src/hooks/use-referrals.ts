import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useReferrals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's referral code from profile or create one
  const { data: referralData, isLoading: referralLoading } = useQuery({
    queryKey: ['referral-code', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // First check profile for existing code
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (profile?.referral_code) {
        return { referral_code: profile.referral_code };
      }

      // Create new referral code via RPC
      const { data: newCode, error } = await supabase.rpc('create_user_referral', {
        p_user_id: user.id
      });

      if (error) throw error;

      return { referral_code: newCode };
    },
    enabled: !!user,
  });

  // Fetch referral stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['referral-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('referral_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data || {
        total_referrals: 0,
        successful_referrals: 0,
        pending_referrals: 0,
        total_points_earned: 0,
        total_cash_earned: 0,
        current_tier: 'Bronze',
        rank: null
      };
    },
    enabled: !!user,
  });

  // Fetch user's referrals
  const { data: myReferrals } = useQuery({
    queryKey: ['my-referrals', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_referrals')
        .select(`
          *,
          profiles:referred_id (
            full_name,
            email
          )
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch referral rewards
  const { data: rewards } = useQuery({
    queryKey: ['referral-rewards', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch referral tiers
  const { data: tiers } = useQuery({
    queryKey: ['referral-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_tiers')
        .select('*')
        .order('min_referrals', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch referral leaderboard
  const { data: leaderboard } = useQuery({
    queryKey: ['referral-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_stats')
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .order('successful_referrals', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  // Claim reward mutation
  const claimRewardMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('referral_rewards')
        .update({
          status: 'claimed',
          claimed_at: new Date().toISOString()
        })
        .eq('id', rewardId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['referral-rewards'] });
      toast.success(`${data.reward_description} claimed!`, {
        description: `You earned ${data.reward_type === 'points' ? data.reward_value + ' points' : '$' + data.reward_value}`
      });
    },
    onError: (error) => {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward');
    },
  });

  // Generate shareable link
  const getReferralLink = () => {
    if (!referralData?.referral_code) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?ref=${referralData.referral_code}`;
  };

  // Copy referral link to clipboard
  const copyReferralLink = () => {
    const link = getReferralLink();
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!', {
      description: 'Share it with your friends to earn rewards'
    });
  };

  // Get current tier info
  const getCurrentTier = () => {
    if (!tiers || !stats) return null;
    
    const successfulReferrals = stats.successful_referrals || 0;
    return tiers.find(
      tier => successfulReferrals >= tier.min_referrals && 
              (!tier.max_referrals || successfulReferrals <= tier.max_referrals)
    );
  };

  // Get next tier info
  const getNextTier = () => {
    const currentTier = getCurrentTier();
    if (!currentTier || !tiers) return null;
    
    const currentIndex = tiers.findIndex(t => t.tier_name === currentTier.tier_name);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  return {
    referralCode: referralData?.referral_code,
    stats,
    myReferrals: myReferrals || [],
    rewards: rewards || [],
    tiers: tiers || [],
    leaderboard: leaderboard || [],
    currentTier: getCurrentTier(),
    nextTier: getNextTier(),
    isLoading: referralLoading || statsLoading,
    getReferralLink,
    copyReferralLink,
    claimReward: claimRewardMutation.mutate,
    claiming: claimRewardMutation.isPending,
  };
};
