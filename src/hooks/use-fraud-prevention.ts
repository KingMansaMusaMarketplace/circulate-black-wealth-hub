import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FraudPreventionAction {
  id: string;
  alert_id: string;
  action_type: 'qr_code_disabled' | 'account_restricted' | 'review_flagged' | 'verification_required' | 'transaction_blocked';
  entity_id?: string;
  entity_type?: string;
  action_details: any;
  auto_triggered: boolean;
  triggered_by?: string;
  created_at: string;
  reversed_at?: string;
  reversed_by?: string;
  reversal_reason?: string;
}

export const useFraudPrevention = (alertId?: string) => {
  const queryClient = useQueryClient();

  // Fetch prevention actions
  const { data: actions, isLoading } = useQuery({
    queryKey: ['fraud-prevention-actions', alertId],
    queryFn: async () => {
      let query = supabase
        .from('fraud_prevention_actions')
        .select('*')
        .order('created_at', { ascending: false });

      if (alertId) {
        query = query.eq('alert_id', alertId);
      }

      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data as FraudPreventionAction[];
    },
  });

  // Reverse a prevention action
  const reverseAction = useMutation({
    mutationFn: async ({
      actionId,
      reason
    }: {
      actionId: string;
      reason: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('fraud_prevention_actions')
        .update({
          reversed_at: new Date().toISOString(),
          reversed_by: user?.id,
          reversal_reason: reason
        })
        .eq('id', actionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fraud-prevention-actions'] });
      toast.success('Prevention action reversed successfully');
    },
    onError: (error) => {
      console.error('Error reversing action:', error);
      toast.error('Failed to reverse prevention action');
    },
  });

  // Get action statistics
  const actionStats = {
    total: actions?.length || 0,
    qr_disabled: actions?.filter(a => a.action_type === 'qr_code_disabled' && !a.reversed_at).length || 0,
    accounts_restricted: actions?.filter(a => a.action_type === 'account_restricted' && !a.reversed_at).length || 0,
    reviews_flagged: actions?.filter(a => a.action_type === 'review_flagged' && !a.reversed_at).length || 0,
    auto_triggered: actions?.filter(a => a.auto_triggered).length || 0,
    reversed: actions?.filter(a => a.reversed_at).length || 0,
  };

  return {
    actions: actions || [],
    actionStats,
    isLoading,
    reverseAction: reverseAction.mutate,
    isReversing: reverseAction.isPending,
  };
};
