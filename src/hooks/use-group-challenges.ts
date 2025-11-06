import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useGroupChallenges = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch active challenges
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['group-challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_challenges')
        .select('*')
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's challenges
  const { data: myChallenges } = useQuery({
    queryKey: ['my-challenges', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('challenge_participants')
        .select(`
          *,
          group_challenges (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Get challenge participants
  const getParticipants = async (challengeId: string) => {
    const { data, error } = await supabase
      .from('challenge_participants')
      .select(`
        *,
        profiles:user_id (full_name)
      `)
      .eq('challenge_id', challengeId)
      .order('contribution_value', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Join challenge
  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('join_challenge', {
        p_challenge_id: challengeId
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string; message?: string };
      if (!result.success) {
        throw new Error(result.error || 'Failed to join challenge');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['my-challenges'] });
      toast.success('Successfully joined challenge! 🎉');
    },
    onError: (error) => {
      console.error('Error joining challenge:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to join challenge');
    },
  });

  // Record activity
  const recordActivityMutation = useMutation({
    mutationFn: async ({
      challengeId,
      activityType,
      activityValue,
      metadata = {}
    }: {
      challengeId: string;
      activityType: string;
      activityValue: number;
      metadata?: any;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('record_challenge_activity', {
        p_challenge_id: challengeId,
        p_activity_type: activityType,
        p_activity_value: activityValue,
        p_metadata: metadata
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['my-challenges'] });
    },
  });

  return {
    challenges,
    myChallenges,
    isLoading,
    joinChallenge: joinChallengeMutation.mutate,
    recordActivity: recordActivityMutation.mutate,
    getParticipants,
  };
};
