import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface FraudAlert {
  id: string;
  alert_type: 'qr_scan_abuse' | 'transaction_anomaly' | 'review_manipulation' | 'account_suspicious' | 'location_mismatch' | 'velocity_abuse';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  business_id?: string;
  related_entity_id?: string;
  related_entity_type?: string;
  description: string;
  evidence: any;
  ai_confidence_score: number;
  status: 'pending' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
  investigated_by?: string;
  investigated_at?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export const useFraudDetection = (businessId?: string) => {
  const queryClient = useQueryClient();
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

  // Fetch fraud alerts
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['fraud-alerts', businessId],
    queryFn: async () => {
      let query = supabase
        .from('fraud_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (businessId) {
        query = query.eq('business_id', businessId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as FraudAlert[];
    },
  });

  // Run fraud detection analysis
  const runAnalysis = async (userId?: string, analysisBusinessId?: string) => {
    setIsRunningAnalysis(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('detect-fraud', {
        body: {
          userId,
          businessId: analysisBusinessId || businessId,
          analysisType: 'full'
        }
      });

      if (error) {
        console.error('Fraud detection error:', error);
        toast.error('Failed to run fraud analysis');
        throw error;
      }

      if (!data.success) {
        toast.error(data.error || 'Fraud analysis failed');
        return;
      }

      toast.success(`Analysis complete: ${data.alertsGenerated} alerts generated`);
      
      // Refresh alerts
      queryClient.invalidateQueries({ queryKey: ['fraud-alerts'] });
      
      return data;
    } catch (error) {
      console.error('Error running fraud analysis:', error);
      toast.error('Failed to run fraud analysis');
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  // Update alert status
  const updateAlertStatus = useMutation({
    mutationFn: async ({
      alertId,
      status,
      resolutionNotes
    }: {
      alertId: string;
      status: FraudAlert['status'];
      resolutionNotes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('fraud_alerts')
        .update({
          status,
          resolution_notes: resolutionNotes,
          investigated_by: user?.id,
          investigated_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fraud-alerts'] });
      toast.success('Alert status updated');
    },
    onError: (error) => {
      console.error('Error updating alert:', error);
      toast.error('Failed to update alert');
    },
  });

  // Get alert statistics
  const alertStats = {
    total: alerts?.length || 0,
    pending: alerts?.filter(a => a.status === 'pending').length || 0,
    critical: alerts?.filter(a => a.severity === 'critical').length || 0,
    high: alerts?.filter(a => a.severity === 'high').length || 0,
    medium: alerts?.filter(a => a.severity === 'medium').length || 0,
    low: alerts?.filter(a => a.severity === 'low').length || 0,
  };

  return {
    alerts: alerts || [],
    alertStats,
    isLoading: alertsLoading,
    isRunningAnalysis,
    runAnalysis,
    updateAlertStatus: updateAlertStatus.mutate,
    isUpdating: updateAlertStatus.isPending,
  };
};
