
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQRCode } from '@/hooks/qr-code';
import { QRCodeForm } from './QRCodeGenerator/QRCodeForm';
import { QRCodePreview } from './QRCodeGenerator/QRCodePreview';
import { toast } from 'sonner';
import { FormValues } from './QRCodeGenerator/form/types';
import { useBusinessProfile } from '@/hooks/use-business-profile';

const QRCodeGenerator: React.FC = () => {
  const { generateQRCode, loading, qrCode } = useQRCode();
  const { profile } = useBusinessProfile();
  const [activeTab, setActiveTab] = useState<string>("create");

  const handleSubmit = async (values: FormValues) => {
    try {
      if (!profile?.id) {
        toast.error("You need a business profile to generate QR codes");
        return;
      }

      // Process date value
      const expirationDate = values.expirationDate 
        ? new Date(values.expirationDate).toISOString()
        : undefined;

      // Generate QR code using the current business profile
      await generateQRCode(
        profile.id, 
        values.codeType as 'loyalty' | 'discount' | 'info',
        {
          discountPercentage: values.discountPercentage,
          pointsValue: values.pointsValue,
          scanLimit: values.scanLimit,
          expirationDate: expirationDate,
          isActive: values.isActive,
        }
      );
      
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
    if (!qrCode?.qr_image_url) return;
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `QR Code for ${profile?.business_name || 'Business'}`,
        text: `Scan this QR code for ${qrCode.code_type === 'loyalty' ? 'loyalty points' : 
               qrCode.code_type === 'discount' ? 'a discount' : 'information'}`,
        url: qrCode.qr_image_url
      })
      .then(() => toast.success("QR code shared successfully"))
      .catch((error) => {
        console.error("Error sharing QR code:", error);
        toast.error("Failed to share QR code");
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      toast.info("Share functionality not supported by your browser. You can download the QR code instead.");
    }
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
