
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TimePeriod } from '@/hooks/qr-code/use-qr-code-analytics';

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
  const getChartTitle = () => {
    switch (timePeriod) {
      case '7days': return 'Daily Scans (Last 7 Days)';
      case '30days': return 'Daily Scans (Last 30 Days)';
      case '90days': return 'Weekly Scans (Last 90 Days)';
      case 'all': return 'Scan Trends (All Time)';
      default: return 'Scan Activity';
    }
  };

  const getInsights = () => {
    const totalScans = scanData.reduce((sum, day) => sum + day.scans, 0);
    const avgScansPerPeriod = totalScans / scanData.length;
    const maxScans = Math.max(...scanData.map(day => day.scans));
    const bestDay = scanData.find(day => day.scans === maxScans)?.name;

    return {
      avgScansPerPeriod: Math.round(avgScansPerPeriod * 10) / 10,
      bestDay,
      maxScans,
      totalScans
    };
  };

  const insights = getInsights();

  return (
    <div className="space-y-6">
      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {getChartTitle()}
            <span className="text-sm font-normal text-muted-foreground">
              {insights.totalScans} total scans
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {timePeriod === '7days' || timePeriod === '30days' ? (
                <BarChart data={scanData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Scans']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="scans" fill="#0F2876" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={scanData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Scans']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="scans" 
                    stroke="#0F2876" 
                    strokeWidth={3}
                    dot={{ fill: '#0F2876', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-mansablue">{insights.avgScansPerPeriod}</p>
              <p className="text-sm text-muted-foreground">
                Average scans per {timePeriod === '7days' ? 'day' : timePeriod === '30days' ? 'day' : 'period'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{insights.maxScans}</p>
              <p className="text-sm text-muted-foreground">
                Peak scans {insights.bestDay && `(${insights.bestDay})`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {metrics.averagePointsPerScan}
              </p>
              <p className="text-sm text-muted-foreground">Points per scan</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold">{metrics.totalScans}</p>
              <p className="text-sm text-muted-foreground">Total Scans</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{metrics.uniqueCustomers}</p>
              <p className="text-sm text-muted-foreground">Unique Customers</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{metrics.totalPointsAwarded}</p>
              <p className="text-sm text-muted-foreground">Points Awarded</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {metrics.uniqueCustomers > 0 ? Math.round((metrics.totalScans / metrics.uniqueCustomers) * 10) / 10 : 0}
              </p>
              <p className="text-sm text-muted-foreground">Scans per Customer</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeAnalyticsDashboard;
