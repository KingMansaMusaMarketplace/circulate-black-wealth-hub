
import React from 'react';
import QRCodeMetricCard from './QRCodeMetricsCard';
import QRCodeScansChart from './QRCodeScansChart';
import { Users, QrCode, CreditCard, TrendingUp } from 'lucide-react';

interface QRCodeAnalyticsContentProps {
  metrics: {
    totalScans: number;
    uniqueCustomers: number;
    totalPointsAwarded: number;
    averagePointsPerScan: number;
  };
}

export const QRCodeAnalyticsContent: React.FC<QRCodeAnalyticsContentProps> = ({
  metrics
}) => {
  // Sample data for the chart
  const scanData = [
    { name: 'Mon', scans: 12 },
    { name: 'Tue', scans: 19 },
    { name: 'Wed', scans: 15 },
    { name: 'Thu', scans: 22 },
    { name: 'Fri', scans: 30 },
    { name: 'Sat', scans: 25 },
    { name: 'Sun', scans: 18 },
  ];

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
          value={metrics.averagePointsPerScan} 
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>
      
      <QRCodeScansChart data={scanData} />
      
      <div className="text-sm text-muted-foreground">
        <p>Note: Analytics data is updated daily. Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default QRCodeAnalyticsContent;
