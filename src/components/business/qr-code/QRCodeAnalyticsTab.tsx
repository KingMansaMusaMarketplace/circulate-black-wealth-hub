
import React, { useEffect, useState } from 'react';
import { QRCodeAnalyticsContent } from './QRCodeAnalytics';
import { useQRCodeAnalytics, TimePeriod } from '@/hooks/qr-code/use-qr-code-analytics';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusinessProfile } from '@/hooks/use-business-profile';

interface QRCodeAnalyticsTabProps {
  businessId?: string;
}

export const QRCodeAnalyticsTab: React.FC<QRCodeAnalyticsTabProps> = ({ businessId }) => {
  const { loading, metrics, fetchQRCodeMetrics, fetchScansByTimePeriod } = useQRCodeAnalytics();
  const [chartData, setChartData] = useState<any[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7days');
  const { profile } = useBusinessProfile();
  
  useEffect(() => {
    const loadData = async () => {
      await fetchQRCodeMetrics(businessId);
      const scanData = await fetchScansByTimePeriod(businessId, timePeriod);
      setChartData(scanData);
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, timePeriod]);
  
  const handlePeriodChange = (value: string) => {
    setTimePeriod(value as TimePeriod);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-mansablue" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={timePeriod}
          onValueChange={handlePeriodChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <QRCodeAnalyticsContent 
        metrics={metrics} 
        scanData={chartData} 
        timePeriod={timePeriod}
        businessName={profile?.business_name}
      />
    </div>
  );
};

export default QRCodeAnalyticsTab;
