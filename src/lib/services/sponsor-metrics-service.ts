import { supabase } from '@/integrations/supabase/client';

export const sponsorMetricsService = {
  /**
   * Trigger automatic calculation of impact metrics for all active sponsors
   * This should be called daily via a cron job or manually by admins
   */
  async calculateAllMetrics(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('calculate-sponsor-impact', {
        body: {},
      });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error calculating metrics:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Manually update metrics for a specific subscription
   * Useful for admins to adjust metrics or add custom tracking
   */
  async updateMetricsManually(
    subscriptionId: string,
    metrics: {
      businesses_supported?: number;
      total_transactions?: number;
      community_reach?: number;
      economic_impact?: number;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('update-sponsor-metrics-manual', {
        body: {
          subscription_id: subscriptionId,
          ...metrics,
        },
      });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error updating metrics:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get metrics history for a subscription
   */
  async getMetricsHistory(subscriptionId: string, limit: number = 30) {
    try {
      const { data, error } = await supabase
        .from('sponsor_impact_metrics')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('metric_date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching metrics history:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  /**
   * Get latest metrics for a subscription
   */
  async getLatestMetrics(subscriptionId: string) {
    try {
      const { data, error } = await supabase
        .from('sponsor_impact_metrics')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('metric_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching latest metrics:', error);
      return { success: false, error: error.message, data: null };
    }
  },
};
