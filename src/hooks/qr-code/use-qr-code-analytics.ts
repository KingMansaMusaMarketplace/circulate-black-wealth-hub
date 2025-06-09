
import { useState } from 'react';

export type TimePeriod = '7days' | '30days' | '90days' | 'all';

interface QRCodeMetrics {
  totalScans: number;
  uniqueCustomers: number;
  totalPointsAwarded: number;
  averagePointsPerScan: number;
}

interface ScanData {
  date: string;
  scans: number;
  points: number;
  name: string; // Added name property for chart compatibility
}

export const useQRCodeAnalytics = (businessId?: string, timePeriod?: TimePeriod) => {
  const [metrics, setMetrics] = useState<QRCodeMetrics>({
    totalScans: 0,
    uniqueCustomers: 0,
    totalPointsAwarded: 0,
    averagePointsPerScan: 0
  });
  
  const [scanData, setScanData] = useState<ScanData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    if (!businessId) return;
    
    setLoading(true);
    
    // Simulate loading analytics data
    setTimeout(() => {
      setMetrics({
        totalScans: 142,
        uniqueCustomers: 67,
        totalPointsAwarded: 1420,
        averagePointsPerScan: 10
      });

      setScanData([
        { date: '2024-01-01', scans: 15, points: 150, name: 'Jan 1' },
        { date: '2024-01-02', scans: 23, points: 230, name: 'Jan 2' },
        { date: '2024-01-03', scans: 18, points: 180, name: 'Jan 3' }
      ]);
      
      setLoading(false);
    }, 1000);
  };

  return {
    metrics,
    scanData,
    loading,
    loadAnalytics
  };
};
