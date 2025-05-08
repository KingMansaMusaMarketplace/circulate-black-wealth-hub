
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBusinessProfile } from '@/hooks/use-business-profile';

interface QRCodeMetrics {
  totalScans: number;
  uniqueCustomers: number;
  totalPointsAwarded: number;
  averagePointsPerScan: number;
}

// Define the type for the response from the get_qr_scan_metrics function
interface QRCodeMetricsResponse {
  total_scans: number;
  unique_customers: number;
  total_points_awarded: number;
  average_points_per_scan: number;
}

export const useQRCodeAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<QRCodeMetrics>({
    totalScans: 0,
    uniqueCustomers: 0,
    totalPointsAwarded: 0,
    averagePointsPerScan: 0
  });
  const { profile } = useBusinessProfile();

  const fetchQRCodeMetrics = async (businessId?: string): Promise<QRCodeMetrics> => {
    const actualBusinessId = businessId || profile?.id;
    
    if (!actualBusinessId) {
      toast.error('Business profile not found');
      return metrics;
    }

    setLoading(true);
    
    try {
      // Call the database function we created to get metrics
      const { data, error } = await supabase.rpc(
        'get_qr_scan_metrics',
        { p_business_id: actualBusinessId }
      );

      if (error) {
        throw error;
      }

      if (data) {
        // First cast to unknown, then to our specific type to avoid TypeScript errors
        const metricsData = data as unknown as QRCodeMetricsResponse;
        
        const updatedMetrics = {
          totalScans: metricsData.total_scans || 0,
          uniqueCustomers: metricsData.unique_customers || 0,
          totalPointsAwarded: metricsData.total_points_awarded || 0,
          averagePointsPerScan: metricsData.average_points_per_scan || 0
        };
        
        setMetrics(updatedMetrics);
        return updatedMetrics;
      }
      
      return metrics;
    } catch (error) {
      console.error('Error fetching QR code metrics:', error);
      toast.error('Failed to load QR code analytics');
      return metrics;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch daily scan counts for chart visualization
  const fetchDailyScanCounts = async (businessId?: string, days: number = 7): Promise<any[]> => {
    const actualBusinessId = businessId || profile?.id;
    
    if (!actualBusinessId) {
      return [];
    }

    setLoading(true);
    
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Format dates for Postgres query
      const start = startDate.toISOString();
      const end = endDate.toISOString();
      
      // Query daily scan counts
      const { data, error } = await supabase
        .from('qr_scans')
        .select('scan_date')
        .eq('business_id', actualBusinessId)
        .gte('scan_date', start)
        .lte('scan_date', end);
      
      if (error) {
        throw error;
      }
      
      // Process data to count scans per day
      const dailyCounts: Record<string, number> = {};
      
      // Initialize all days in the range with 0 counts
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        dailyCounts[day] = 0;
      }
      
      // Count scans per day
      if (data) {
        data.forEach((scan) => {
          const scanDate = new Date(scan.scan_date);
          const day = scanDate.toLocaleDateString('en-US', { weekday: 'short' });
          dailyCounts[day] = (dailyCounts[day] || 0) + 1;
        });
      }
      
      // Convert to array format for chart
      return Object.entries(dailyCounts)
        .map(([name, scans]) => ({ name, scans }))
        .reverse();
      
    } catch (error) {
      console.error('Error fetching daily scan counts:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    metrics,
    fetchQRCodeMetrics,
    fetchDailyScanCounts
  };
};
