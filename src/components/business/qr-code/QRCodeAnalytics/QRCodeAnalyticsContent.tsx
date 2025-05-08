
import React from 'react';
import QRCodeMetricCard from './QRCodeMetricsCard';
import QRCodeScansChart from './QRCodeScansChart';
import { Users, QrCode, CreditCard, TrendingUp } from 'lucide-react';
import { TimePeriod } from '@/hooks/qr-code/use-qr-code-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeAnalyticsContentProps {
  metrics: {
    totalScans: number;
    uniqueCustomers: number;
    totalPointsAwarded: number;
    averagePointsPerScan: number;
  };
  scanData?: Array<{name: string; scans: number}>;
  timePeriod?: TimePeriod;
}

export const QRCodeAnalyticsContent: React.FC<QRCodeAnalyticsContentProps> = ({
  metrics,
  scanData = [],
  timePeriod = '7days'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QRCodeMetricCard 
          title="Total Scans" 
          value={metrics.totalScans} 
          icon={<QrCode className="h-4 w-4" />}
        />
        <QRCodeMetricCard 
          title="Unique Customers" 
          value={metrics.uniqueCustomers} 
          icon={<Users className="h-4 w-4" />}
        />
        <QRCodeMetricCard 
          title="Points Awarded" 
          value={metrics.totalPointsAwarded} 
          icon={<CreditCard className="h-4 w-4" />}
        />
        <QRCodeMetricCard 
          title="Avg Points/Scan" 
          value={metrics.averagePointsPerScan.toFixed(1)} 
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>QR Code Scan Activity ({getTimePeriodLabel()})</CardTitle>
        </CardHeader>
        <CardContent>
          <QRCodeScansChart data={chartData} />
        </CardContent>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        <p>Note: Analytics data is updated daily. Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default QRCodeAnalyticsContent;
