
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeGenerator } from '@/components/business/qr-code';
import { QRCodeManageTab } from './QRCodeManage/QRCodeManageTab';
import { QRCodeAnalyticsTab } from './QRCodeAnalyticsTab';
import { QRCode } from '@/lib/api/qr-code-api';

interface QRCodeTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  qrCodes: QRCode[];
  businessId?: string;
}

export const QRCodeTabs: React.FC<QRCodeTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  qrCodes,
  businessId
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
        <QRCodeAnalyticsTab businessId={businessId} />
      </TabsContent>
    </Tabs>
  );
};
