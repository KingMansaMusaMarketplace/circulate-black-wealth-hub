
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeGenerator } from '@/components/business/qr-code';
import { QRCodeManageTab } from './QRCodeManage/QRCodeManageTab';
import { QRCodeAnalyticsTab } from './QRCodeAnalyticsTab';

interface QRCodeTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  qrCodes: any[];
  scanMetrics: {
    totalScans: number;
    uniqueCustomers: number;
    totalPointsAwarded: number;
    averagePointsPerScan: number;
  };
}

export const QRCodeTabs: React.FC<QRCodeTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  qrCodes,
  scanMetrics
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="generate">Generate QR Codes</TabsTrigger>
        <TabsTrigger value="manage">Manage QR Codes</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="generate" className="space-y-6">
        <QRCodeGenerator />
      </TabsContent>
      
      <TabsContent value="manage">
        <QRCodeManageTab qrCodes={qrCodes} />
      </TabsContent>
      
      <TabsContent value="analytics">
        <QRCodeAnalyticsTab metrics={scanMetrics} />
      </TabsContent>
    </Tabs>
  );
};
