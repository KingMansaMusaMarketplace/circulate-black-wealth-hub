
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QRCodeForm from './QRCodeGenerator/QRCodeForm';
import QRCodePreview from './QRCodeGenerator/QRCodePreview';
import { useQRCode } from '@/hooks/qr-code';
import { QRCode } from '@/lib/api/qr-code-api';
import { toast } from 'sonner';

interface QRCodeGeneratorProps {
  businessId?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ businessId }) => {
  const [currentQRCode, setCurrentQRCode] = useState<QRCode | null>(null);
  const { generateQRCode, loading } = useQRCode();

  const handleFormSubmit = async (values: any) => {
    if (!businessId) {
      toast.error('Business ID is required to generate QR code');
      return;
    }

    try {
      const newQRCode = await generateQRCode(businessId, values.codeType, {
        discountPercentage: values.discountPercentage,
        pointsValue: values.pointsValue,
        scanLimit: values.scanLimit,
        expirationDate: values.expirationDate,
        isActive: values.isActive
      });

      if (newQRCode) {
        setCurrentQRCode(newQRCode);
        toast.success('QR Code generated successfully!');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const handleDownload = () => {
    if (currentQRCode?.qr_image_url) {
      const link = document.createElement('a');
      link.href = currentQRCode.qr_image_url;
      link.download = `qr-code-${currentQRCode.code_type}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR Code downloaded successfully!');
    }
  };

  const handleCopy = () => {
    if (currentQRCode?.qr_image_url) {
      navigator.clipboard.writeText(currentQRCode.qr_image_url);
      toast.success('QR Code URL copied to clipboard!');
    }
  };

  const handleRegenerate = async () => {
    if (currentQRCode) {
      try {
        const newQRCode = await generateQRCode(businessId, currentQRCode.code_type, {
          discountPercentage: currentQRCode.discount_percentage,
          pointsValue: currentQRCode.points_value,
          scanLimit: currentQRCode.scan_limit,
          expirationDate: currentQRCode.expiration_date,
          isActive: currentQRCode.is_active
        });

        if (newQRCode) {
          setCurrentQRCode(newQRCode);
          toast.success('QR Code regenerated successfully!');
        }
      } catch (error) {
        console.error('Error regenerating QR code:', error);
        toast.error('Failed to regenerate QR code');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <QRCodeForm 
        onSubmit={handleFormSubmit}
        isLoading={loading}
      />
      
      <QRCodePreview 
        qrCode={currentQRCode}
        onDownload={handleDownload}
        onCopy={handleCopy}
        onRegenerate={handleRegenerate}
        isLoading={loading}
      />
    </div>
  );
};

export default QRCodeGenerator;
