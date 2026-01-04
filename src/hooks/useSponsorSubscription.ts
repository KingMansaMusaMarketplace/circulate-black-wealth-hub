import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SponsorSubscription {
  id: string;
  user_id: string;
  tier: string;
  status: string;
  approval_status: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
}

export const useSponsorSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['sponsor-subscription', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as SponsorSubscription | null;
    },
    enabled: !!user,
  });

  const updateCompanyInfo = useMutation({
    mutationFn: async (updates: {
      company_name?: string;
      logo_url?: string;
      website_url?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-subscription', user?.id] });
      toast.success('Company information updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update company information');
    },
  });

  return {
    subscription,
    isLoading,
    error,
    updateCompanyInfo,
  };
};
