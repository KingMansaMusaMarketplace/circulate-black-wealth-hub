import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CommissionReportRequest {
  businessId?: string;
  month?: string; // Format: YYYY-MM
}

export const useCommissionNotifications = () => {
  const [sending, setSending] = useState(false);

  const sendCommissionReport = async (data: CommissionReportRequest = {}) => {
    setSending(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('send-commission-report', {
        body: data
      });

      if (error) throw error;

      console.log('Commission report sent successfully:', result);
      toast.success('Commission report sent successfully');
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error sending commission report:', error);
      toast.error('Failed to send commission report: ' + error.message);
      return { success: false, error };
    } finally {
      setSending(false);
    }
  };

  const sendMonthlyReports = async (month?: string) => {
    return sendCommissionReport({ month });
  };

  const sendBusinessReport = async (businessId: string, month?: string) => {
    return sendCommissionReport({ businessId, month });
  };

  return {
    sending,
    sendCommissionReport,
    sendMonthlyReports,
    sendBusinessReport
  };
};
