
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generateBusinessQRCode, processQRScan } from '@/lib/api/qr-code-api';
import { toast } from 'sonner';

export const useQRCode = () => {
  const [loading, setLoading] = useState(false);
  const [qrCodeId, setQrCodeId] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const { user } = useAuth();

  const generateQRCode = async (
    businessId: string,
    type: 'discount' | 'loyalty' | 'info',
    options?: {
      discountPercentage?: number;
      pointsValue?: number;
    }
  ) => {
    if (!user) {
      toast.error('You must be logged in to generate a QR code');
      return null;
    }

    setLoading(true);
    try {
      const result = await generateBusinessQRCode(businessId, type, options);
      if (result.success && result.qrCode) {
        setQrCodeId(result.qrCode.id);
        setQrImageUrl(result.qrCode.qr_image_url || null);
        return result.qrCode;
      }
      return null;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const scanQRCode = async (
    qrCodeId: string,
    location?: {
      lat: number;
      lng: number;
    }
  ) => {
    if (!user) {
      toast.error('You must be logged in to scan a QR code');
      return null;
    }

    setLoading(true);
    try {
      const result = await processQRScan(qrCodeId, user.id, location);
      if (result.success) {
        return result.result;
      }
      return null;
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast.error('Failed to process QR code scan');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    qrCodeId,
    qrImageUrl,
    generateQRCode,
    scanQRCode,
  };
};
