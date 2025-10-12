import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSponsorSubscription = () => {
  return useQuery({
    queryKey: ['sponsor-subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};

export const useSponsorImpactMetrics = (subscriptionId?: string) => {
  return useQuery({
    queryKey: ['sponsor-impact-metrics', subscriptionId],
    queryFn: async () => {
      if (!subscriptionId) throw new Error('No subscription ID');

      const { data, error } = await supabase
        .from('sponsor_impact_metrics')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('metric_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data || [];
    },
    enabled: !!subscriptionId,
  });
};
