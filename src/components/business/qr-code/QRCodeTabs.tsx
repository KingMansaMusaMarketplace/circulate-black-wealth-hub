
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeGenerator } from '@/components/business/qr-code';
import { QRCodeManageTab } from './QRCodeManage/QRCodeManageTab';
import { QRCodeAnalyticsTab } from './QRCodeAnalyticsTab';
import { QRCode } from '@/lib/api/qr-code-api';
import { QRCodeNotifications } from './notifications/QRCodeNotifications';

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
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="generate">Generate QR Codes</TabsTrigger>
          <TabsTrigger value="manage">Manage QR Codes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <QRCodeNotifications />
      </div>
      
      <TabsContent value="generate" className="space-y-6">
        <QRCodeGenerator businessId={businessId} />
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

export default QRCodeTabs;
