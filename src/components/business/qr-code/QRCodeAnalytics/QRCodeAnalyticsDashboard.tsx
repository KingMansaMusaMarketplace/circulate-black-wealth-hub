
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QRCodeScansChart from './QRCodeScansChart';
import QRCodeMetricCard from './QRCodeMetricsCard';
import { TimePeriod } from '@/hooks/qr-code/use-qr-code-analytics';
import { Line, Pie } from 'recharts';
import { Users, QrCode, Repeat, TrendingUp, Award } from 'lucide-react';

interface QRCodeAnalyticsDashboardProps {
  metrics: {
    totalScans: number;
    uniqueCustomers: number;
    totalPointsAwarded: number;
    averagePointsPerScan: number;
  };
  scanData: Array<{name: string; scans: number}>;
  timePeriod: TimePeriod;
}

const QRCodeAnalyticsDashboard: React.FC<QRCodeAnalyticsDashboardProps> = ({
  metrics,
  scanData,
  timePeriod
}) => {
  // Calculate repeat customer rate
  const repeatRate = metrics.uniqueCustomers > 0 
    ? Math.round((metrics.totalScans / metrics.uniqueCustomers) * 10) / 10
    : 0;
  
  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Unique Customers', value: metrics.uniqueCustomers, fill: '#8884d8' },
    { name: 'Repeat Scans', value: Math.max(0, metrics.totalScans - metrics.uniqueCustomers), fill: '#82ca9d' }
  ];
  
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="charts">Detailed Charts</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
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
            icon={<Award className="h-4 w-4" />}
          />
          <QRCodeMetricCard 
            title="Avg Points/Scan" 
            value={metrics.averagePointsPerScan.toFixed(1)} 
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>QR Code Scan Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <QRCodeScansChart data={scanData} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="charts" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <QRCodeScansChart 
                  data={scanData}
                  showArea={true}
                  customLabel="Customer Engagement Over Time"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="h-[250px] w-full">
                <QRCodeScansChart 
                  data={pieChartData}
                  chartType="pie"
                  dataKey="value"
                  nameKey="name"
                  customLabel="New vs Returning Customers"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Scan Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <Repeat className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">{repeatRate}</div>
                  <div className="text-sm text-gray-500">Scans per Customer</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <Award className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-2xl font-bold">{metrics.totalPointsAwarded}</div>
                  <div className="text-sm text-gray-500">Total Points Awarded</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                  <div className="text-2xl font-bold">{metrics.averagePointsPerScan.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Avg Points/Scan</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default QRCodeAnalyticsDashboard;
