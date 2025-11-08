import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Eye, CheckCircle, TrendingUp, Users, Download } from 'lucide-react';
import { getQRCodeAnalytics, QRCodeAnalytics as QRAnalytics } from '@/lib/api/qr-analytics-api';
import { exportAnalyticsToCSV } from '@/lib/api/qr-export';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface QRCodeAnalyticsProps {
  referralCode: string;
}

const QRCodeAnalytics: React.FC<QRCodeAnalyticsProps> = ({ referralCode }) => {
  const [analytics, setAnalytics] = useState<QRAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const data = await getQRCodeAnalytics(referralCode);
      setAnalytics(data);
      setLoading(false);
    };

    if (referralCode) {
      fetchAnalytics();
    }
  }, [referralCode]);

  const handleExport = () => {
    if (analytics) {
      exportAnalyticsToCSV(analytics, referralCode);
      toast.success('Analytics exported to CSV');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            QR Code Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return null;
  }

  const stats = [
    {
      label: 'Total Scans',
      value: analytics.total_scans,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Unique Scans',
      value: analytics.unique_scans,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Conversions',
      value: analytics.total_conversions,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Conversion Rate',
      value: `${analytics.conversion_rate}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            QR Code Analytics
          </CardTitle>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            disabled={!analytics || analytics.total_scans === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`${stat.bgColor} rounded-lg p-4 border border-border`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* Time-based Stats */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3">Recent Activity</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm text-muted-foreground">Last 7 Days</span>
                <span className="text-sm font-semibold">{analytics.scans_last_7_days} scans</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm text-muted-foreground">Conversions</span>
                <span className="text-sm font-semibold text-green-600">
                  {analytics.conversions_last_7_days}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm text-muted-foreground">Last 30 Days</span>
                <span className="text-sm font-semibold">{analytics.scans_last_30_days} scans</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm text-muted-foreground">Conversions</span>
                <span className="text-sm font-semibold text-green-600">
                  {analytics.conversions_last_30_days}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        {analytics.total_scans > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>💡 Insight:</strong>{' '}
              {analytics.conversion_rate > 10
                ? 'Great job! Your QR code is converting well. Keep sharing it!'
                : analytics.total_scans > 10
                ? 'You have good scan numbers. Consider optimizing your landing page to improve conversion rate.'
                : 'Share your QR code more to gather meaningful analytics and insights.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeAnalytics;
