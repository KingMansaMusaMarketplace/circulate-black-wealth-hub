
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, BarChart3, Settings } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import { QRCodeAnalyticsTab } from './QRCodeAnalyticsTab';
import { QRCodeManageTab } from './QRCodeManage/QRCodeManageTab';
import { QRCode } from '@/lib/api/qr-code-api';

interface QRCodeTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  qrCodes: QRCode[];
  businessId?: string;
}

const QRCodeTabs: React.FC<QRCodeTabsProps> = ({
  activeTab,
  setActiveTab,
  qrCodes,
  businessId
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="generate" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Generate
        </TabsTrigger>
        <TabsTrigger value="manage" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Manage
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="generate" className="mt-6">
        <QRCodeGenerator businessId={businessId} />
      </TabsContent>

      <TabsContent value="manage" className="mt-6">
        <QRCodeManageTab qrCodes={qrCodes} />
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <QRCodeAnalyticsTab businessId={businessId} />
      </TabsContent>
    </Tabs>
  );
};

export default QRCodeTabs;
