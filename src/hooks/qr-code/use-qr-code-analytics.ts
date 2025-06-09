
import { useState } from 'react';

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
}

export const useQRCodeAnalytics = (businessId?: string, timePeriod?: string) => {
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
        { date: '2024-01-01', scans: 15, points: 150 },
        { date: '2024-01-02', scans: 23, points: 230 },
        { date: '2024-01-03', scans: 18, points: 180 }
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
