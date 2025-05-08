
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import QRCodePreview from './QRCodeGenerator/QRCodePreview';
import QRCodeForm from './QRCodeGenerator/QRCodeForm';
import { useQRCode } from '@/hooks/qr-code';
import { QRCode as QRCodeType } from '@/lib/api/qr-code-api';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import BatchQRCodeGenerator from './QRCodeGenerator/BatchQRCodeGenerator';

interface QRCodeGeneratorProps {
  businessId?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ businessId }) => {
  const [qrCode, setQrCode] = useState<QRCodeType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateQRCode } = useQRCode();
  const [currentTab, setCurrentTab] = useState<'single' | 'batch'>('single');

  const handleGenerateQRCode = async (values: any) => {
    setIsGenerating(true);
    try {
      const { codeType, pointsValue, discountPercentage, scanLimit, expirationDate, isActive } = values;
      
      const options: any = {
        scanLimit,
        isActive
      };
      
      if (expirationDate) {
        options.expirationDate = expirationDate;
      }
      
      if (codeType === 'loyalty') {
        options.pointsValue = pointsValue;
      } else if (codeType === 'discount') {
        options.discountPercentage = discountPercentage;
      }
      
      const newQrCode = await generateQRCode(businessId, codeType, options);
      
      if (newQrCode) {
        setQrCode(newQrCode);
        toast.success('QR code generated successfully!');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Tabs value={currentTab} onValueChange={(value: any) => setCurrentTab(value)}>
      <TabsList className="mb-6">
        <TabsTrigger value="single">Single QR Code</TabsTrigger>
        <TabsTrigger value="batch">Batch Generation</TabsTrigger>
      </TabsList>
      
      <TabsContent value="single" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <QRCodeForm
              onSubmit={handleGenerateQRCode}
              isLoading={isGenerating}
            />
          </Card>
          
          <QRCodePreview qrCode={qrCode} isGenerating={isGenerating} />
        </div>
      </TabsContent>
      
      <TabsContent value="batch">
        <BatchQRCodeGenerator />
      </TabsContent>
    </Tabs>
  );
};

export default QRCodeGenerator;
