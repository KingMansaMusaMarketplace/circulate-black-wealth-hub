import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useGamification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch user streaks
  const { data: streaks, isLoading: streaksLoading } = useQuery({
    queryKey: ['streaks', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch leaderboard with retry and stale time
  const { data: leaderboard, isLoading: leaderboardLoading, refetch: refetchLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'weekly'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          profiles!leaderboard_user_id_fkey (
            full_name
          )
        `)
        .eq('period', 'weekly')
        .order('rank', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  // Update streak
  const updateStreakMutation = useMutation({
    mutationFn: async (streakType: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('update_user_streak', {
        p_user_id: user.id,
        p_streak_type: streakType
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
    },
  });

  // Unlock achievement
  const unlockAchievementMutation = useMutation({
    mutationFn: async ({
      type,
      name,
      description,
      icon,
      points
    }: {
      type: string;
      name: string;
      description: string;
      icon: string;
      points: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: type,
          achievement_name: name,
          description,
          icon,
          points_awarded: points
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      toast.success(`Achievement Unlocked: ${data.achievement_name}! 🎉`, {
        description: `+${data.points_awarded} points`
      });
    },
  });

  return {
    achievements,
    streaks,
    leaderboard,
    isLoading: achievementsLoading || streaksLoading || leaderboardLoading,
    updateStreak: updateStreakMutation.mutate,
    unlockAchievement: unlockAchievementMutation.mutate,
    refetchLeaderboard,
  };
};
