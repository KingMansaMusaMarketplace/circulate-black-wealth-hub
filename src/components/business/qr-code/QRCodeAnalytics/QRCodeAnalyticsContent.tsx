
import React from 'react';
import { TimePeriod } from '@/hooks/qr-code/use-qr-code-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCodeAnalyticsDashboard from './QRCodeAnalyticsDashboard';
import ExportButton from './ExportButton';

interface QRCodeAnalyticsContentProps {
  metrics: {
    totalScans: number;
    uniqueCustomers: number;
    totalPointsAwarded: number;
    averagePointsPerScan: number;
  };
  scanData?: Array<{name: string; scans: number}>;
  timePeriod?: TimePeriod;
  businessName?: string;
}

export const QRCodeAnalyticsContent: React.FC<QRCodeAnalyticsContentProps> = ({
  metrics,
  scanData = [],
  timePeriod = '7days',
  businessName
}) => {
  // Use the provided scan data or fallback to demo data if empty
  const chartData = scanData.length > 0 ? scanData : [
    { name: 'Mon', scans: 12 },
    { name: 'Tue', scans: 19 },
    { name: 'Wed', scans: 15 },
    { name: 'Thu', scans: 22 },
    { name: 'Fri', scans: 30 },
    { name: 'Sat', scans: 25 },
    { name: 'Sun', scans: 18 },
  ];

  // Get a user-friendly label for the time period
  const getTimePeriodLabel = () => {
    switch (timePeriod) {
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      case '90days': return 'Last 90 Days';
      case 'all': return 'All Time';
      default: return 'Last 7 Days';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">QR Code Analytics ({getTimePeriodLabel()})</h2>
        <ExportButton 
          data={chartData} 
          metrics={metrics} 
          timePeriod={timePeriod}
          businessName={businessName}
        />
      </div>
      
      <QRCodeAnalyticsDashboard 
        metrics={metrics}
        scanData={chartData}
        timePeriod={timePeriod}
      />
      
      <div className="text-sm text-muted-foreground">
        <p>Note: Analytics data is updated daily. Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default QRCodeAnalyticsContent;
