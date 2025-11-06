import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useSavingsCircles = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch available circles
  const { data: circles, isLoading } = useQuery({
    queryKey: ['savings-circles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_circles')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's circles
  const { data: myCircles } = useQuery({
    queryKey: ['my-savings-circles', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('savings_circle_members')
        .select(`
          *,
          savings_circles (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Create circle
  const createCircleMutation = useMutation({
    mutationFn: async (circleData: any) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('savings_circles')
        .insert({
          ...circleData,
          creator_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join creator as first member
      await supabase
        .from('savings_circle_members')
        .insert({
          circle_id: data.id,
          user_id: user.id,
          payout_position: 1
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-circles'] });
      toast.success('Savings circle created successfully!');
    },
    onError: (error) => {
      console.error('Error creating circle:', error);
      toast.error('Failed to create savings circle');
    },
  });

  // Join circle
  const joinCircleMutation = useMutation({
    mutationFn: async (circleId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('savings_circle_members')
        .insert({
          circle_id: circleId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-circles'] });
      queryClient.invalidateQueries({ queryKey: ['my-savings-circles'] });
      toast.success('Successfully joined savings circle!');
    },
    onError: (error) => {
      console.error('Error joining circle:', error);
      toast.error('Failed to join savings circle');
    },
  });

  return {
    circles,
    myCircles,
    isLoading,
    createCircle: createCircleMutation.mutate,
    joinCircle: joinCircleMutation.mutate,
  };
};

export const useCommunityInvestments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch available investments
  const { data: investments, isLoading } = useQuery({
    queryKey: ['community-investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_investments')
        .select(`
          *,
          businesses (
            business_name,
            logo_url,
            category
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's investments
  const { data: myInvestments } = useQuery({
    queryKey: ['my-investments', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_investments')
        .select(`
          *,
          community_investments (
            *,
            businesses (
              business_name,
              logo_url
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Make investment
  const investMutation = useMutation({
    mutationFn: async ({ investmentId, amount }: { investmentId: string; amount: number }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_investments')
        .insert({
          investment_id: investmentId,
          user_id: user.id,
          amount
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-investments'] });
      queryClient.invalidateQueries({ queryKey: ['my-investments'] });
      toast.success('Investment successful! 🎉');
    },
    onError: (error) => {
      console.error('Error making investment:', error);
      toast.error('Failed to complete investment');
    },
  });

  return {
    investments,
    myInvestments,
    isLoading,
    invest: investMutation.mutate,
  };
};
