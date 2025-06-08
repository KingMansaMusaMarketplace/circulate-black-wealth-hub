
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Download, TrendingUp, Users, Zap, QrCode } from 'lucide-react';
import { QRCodeAnalyticsContent } from './QRCodeAnalytics/QRCodeAnalyticsContent';
import { useQRCodeAnalytics } from '@/hooks/qr-code/use-qr-code-analytics';
import { useBusinessProfile } from '@/hooks/use-business-profile';

interface QRCodeAnalyticsTabProps {
  businessId?: string;
}

export const QRCodeAnalyticsTab: React.FC<QRCodeAnalyticsTabProps> = ({ businessId }) => {
  const [timePeriod, setTimePeriod] = useState<'7days' | '30days' | '90days' | 'all'>('7days');
  const { profile } = useBusinessProfile();
  const actualBusinessId = businessId || profile?.id;
  
  const {
    metrics,
    scanData,
    loading,
    loadAnalytics
  } = useQRCodeAnalytics(actualBusinessId, timePeriod);

  useEffect(() => {
    if (actualBusinessId) {
      loadAnalytics();
    }
  }, [actualBusinessId, timePeriod, loadAnalytics]);

  const timePeriodOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  if (!actualBusinessId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Business Profile Required</h3>
            <p className="text-gray-500">Please complete your business profile to view QR code analytics.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <div className="flex flex-wrap gap-2">
        {timePeriodOptions.map((option) => (
          <Button
            key={option.value}
            variant={timePeriod === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimePeriod(option.value as any)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {option.label}
          </Button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <QrCode className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalScans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Unique Customers</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.uniqueCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-yellow-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Points Awarded</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalPointsAwarded}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Avg Points/Scan</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.averagePointsPerScan}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <QRCodeAnalyticsContent
        metrics={metrics}
        scanData={scanData}
        timePeriod={timePeriod}
        businessName={profile?.business_name}
      />
    </div>
  );
};
