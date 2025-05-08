
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQRCode } from '@/hooks/qr-code';
import { QRCodeForm } from './QRCodeGenerator/QRCodeForm';
import { QRCodePreview } from './QRCodeGenerator/QRCodePreview';
import { toast } from 'sonner';

interface FormValues {
  codeType: string;
  discountPercentage?: number;
  pointsValue?: number;
  scanLimit?: number;
  expirationDate?: string;
  isActive: boolean;
}

const QRCodeGenerator: React.FC = () => {
  const { generateQRCode, loading, qrCode } = useQRCode();
  const [activeTab, setActiveTab] = useState<string>("create");

  const handleSubmit = async (values: FormValues) => {
    try {
      // Process date value
      const expirationDate = values.expirationDate 
        ? new Date(values.expirationDate).toISOString()
        : undefined;

      // Generate QR code
      await generateQRCode({
        code_type: values.codeType,
        discount_percentage: values.discountPercentage,
        points_value: values.pointsValue,
        scan_limit: values.scanLimit,
        expiration_date: expirationDate,
        is_active: values.isActive,
      });
      
      setActiveTab("preview");
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  };

  const handleDownload = () => {
    if (!qrCode?.qr_image_url) return;
    
    // Create a temporary anchor element to download the image
    const link = document.createElement('a');
    link.href = qrCode.qr_image_url;
    link.download = `qrcode-${qrCode.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("QR code downloaded successfully");
  };

  const handleShare = () => {
    // Share functionality would be implemented here
    toast.info("Share functionality coming soon!");
  };

  return (
    <Card className="p-0">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="create">Create QR Code</TabsTrigger>
          <TabsTrigger value="preview" disabled={!qrCode}>Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="p-6">
          <QRCodeForm 
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="p-6">
          {qrCode && qrCode.qr_image_url && (
            <QRCodePreview
              imageUrl={qrCode.qr_image_url}
              codeType={qrCode.code_type}
              pointsValue={qrCode.points_value || undefined}
              discountPercentage={qrCode.discount_percentage || undefined}
              onDownload={handleDownload}
              onShare={handleShare}
            />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default QRCodeGenerator;
