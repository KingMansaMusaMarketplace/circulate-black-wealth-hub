import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminBadgeCounts {
  submissions: number;
  verifications: number;
  fraudAlerts: number;
  supportTickets: number;
  moderation: number;
}

/**
 * Fetches live counts of pending items that need admin attention.
 * Used to show badges on admin sidebar/hub items.
 */
export function useAdminBadgeCounts() {
  return useQuery<AdminBadgeCounts>({
    queryKey: ['admin-badge-counts'],
    queryFn: async () => {
      const [subs, verif, fraud, tickets, mod] = await Promise.all([
        supabase
          .from('business_submissions')
          .select('id', { count: 'exact', head: true })
          .in('status', ['pending_verification', 'pending_review']),
        supabase
          .from('business_verifications')
          .select('id', { count: 'exact', head: true })
          .eq('verification_status', 'pending'),
        supabase
          .from('fraud_alerts')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'open'),
        supabase
          .from('support_tickets')
          .select('id', { count: 'exact', head: true })
          .in('status', ['open', 'in_progress']),
        supabase
          .from('content_moderation_queue')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
      ]);

      return {
        submissions: subs.count ?? 0,
        verifications: verif.count ?? 0,
        fraudAlerts: fraud.count ?? 0,
        supportTickets: tickets.count ?? 0,
        moderation: mod.count ?? 0,
      };
    },
    staleTime: 60 * 1000, // refresh every minute
    refetchInterval: 2 * 60 * 1000,
    retry: 1,
  });
}
