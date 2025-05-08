
import React, { useEffect, useState } from 'react';
import { QRCodeAnalyticsContent } from './QRCodeAnalytics';
import { useQRCodeAnalytics } from '@/hooks/qr-code/use-qr-code-analytics';
import { Loader2 } from 'lucide-react';

interface QRCodeAnalyticsTabProps {
  businessId?: string;
}

export const QRCodeAnalyticsTab: React.FC<QRCodeAnalyticsTabProps> = ({ businessId }) => {
  const { loading, metrics, fetchQRCodeMetrics, fetchDailyScanCounts } = useQRCodeAnalytics();
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      await fetchQRCodeMetrics(businessId);
      const dailyData = await fetchDailyScanCounts(businessId, 7);
      setChartData(dailyData);
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-mansablue" />
      </div>
    );
  }
  
  return (
    <QRCodeAnalyticsContent 
      metrics={metrics} 
      scanData={chartData} 
    />
  );
};
