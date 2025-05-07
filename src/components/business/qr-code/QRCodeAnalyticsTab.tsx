
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeAnalyticsTabProps {
  metrics: {
    totalScans: number;
    uniqueCustomers: number;
    totalPointsAwarded: number;
    averagePointsPerScan: number;
  };
}

export const QRCodeAnalyticsTab: React.FC<QRCodeAnalyticsTabProps> = ({ metrics }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Scans" value={metrics.totalScans} />
        <MetricCard title="Unique Customers" value={metrics.uniqueCustomers} />
        <MetricCard title="Points Awarded" value={metrics.totalPointsAwarded} />
        <MetricCard title="Avg. Points/Scan" value={metrics.averagePointsPerScan} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Scan Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
            <div className="text-center">
              <BarChart3 className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-gray-500">QR Scan Analytics</p>
              <p className="text-sm text-gray-400">
                Visualizations of your scan data would appear here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

interface MetricCardProps {
  title: string;
  value: number | string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm text-gray-500">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);
