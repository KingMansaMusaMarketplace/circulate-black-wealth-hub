
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type TimePeriod = '7days' | '30days' | '90days' | 'all';

interface QRCodeMetrics {
  totalScans: number;
  uniqueCustomers: number;
  totalPointsAwarded: number;
  averagePointsPerScan: number;
}

interface ScanDataPoint {
  name: string;
  scans: number;
}

export const useQRCodeAnalytics = (businessId?: string, timePeriod: TimePeriod = '7days') => {
  const [metrics, setMetrics] = useState<QRCodeMetrics>({
    totalScans: 0,
    uniqueCustomers: 0,
    totalPointsAwarded: 0,
    averagePointsPerScan: 0
  });
  const [scanData, setScanData] = useState<ScanDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  const getDateRange = useCallback(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timePeriod) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        startDate.setFullYear(2020); // Set to a far past date
        break;
    }
    
    return { startDate, endDate: now };
  }, [timePeriod]);

  const loadAnalytics = useCallback(async () => {
    if (!businessId) return;
    
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();
      
      // Fetch scan metrics
      const { data: scans, error: scansError } = await supabase
        .from('qr_scans')
        .select('*')
        .eq('business_id', businessId)
        .gte('scan_date', startDate.toISOString())
        .lte('scan_date', endDate.toISOString());

      if (scansError) {
        console.error('Error fetching scan data:', scansError);
        toast.error('Failed to load analytics data');
        return;
      }

      const totalScans = scans?.length || 0;
      const uniqueCustomers = new Set(scans?.map(scan => scan.customer_id)).size;
      const totalPointsAwarded = scans?.reduce((sum, scan) => sum + (scan.points_awarded || 0), 0) || 0;
      const averagePointsPerScan = totalScans > 0 ? Math.round(totalPointsAwarded / totalScans) : 0;

      setMetrics({
        totalScans,
        uniqueCustomers,
        totalPointsAwarded,
        averagePointsPerScan
      });

      // Generate chart data based on time period
      const chartData = generateChartData(scans || [], timePeriod);
      setScanData(chartData);

    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [businessId, getDateRange, timePeriod]);

  const generateChartData = (scans: any[], period: TimePeriod): ScanDataPoint[] => {
    const now = new Date();
    const data: ScanDataPoint[] = [];

    if (period === '7days') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en', { weekday: 'short' });
        const dayScans = scans.filter(scan => {
          const scanDate = new Date(scan.scan_date);
          return scanDate.toDateString() === date.toDateString();
        }).length;
        
        data.push({ name: dayName, scans: dayScans });
      }
    } else if (period === '30days') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayScans = scans.filter(scan => {
          const scanDate = new Date(scan.scan_date);
          return scanDate.toDateString() === date.toDateString();
        }).length;
        
        data.push({ name: date.getDate().toString(), scans: dayScans });
      }
    } else {
      // For longer periods, group by week or month
      const weeklyData: { [key: string]: number } = {};
      scans.forEach(scan => {
        const scanDate = new Date(scan.scan_date);
        const weekKey = `Week ${Math.ceil(scanDate.getDate() / 7)}`;
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
      });
      
      Object.entries(weeklyData).forEach(([week, count]) => {
        data.push({ name: week, scans: count });
      });
    }

    return data;
  };

  return {
    metrics,
    scanData,
    loading,
    loadAnalytics
  };
};
