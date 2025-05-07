
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  generateBusinessQRCode, 
  processQRScan,
  getQRCodeById,
  updateQRCode,
  QRCode
} from '@/lib/api/qr-code-api';
import { toast } from 'sonner';

interface UseQRCodeOptions {
  qrCodeId?: string;
  businessId?: string;
  autoLoad?: boolean;
}

export const useQRCode = (options: UseQRCodeOptions = {}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const { user } = useAuth();

  // Load QR code if ID is provided
  useEffect(() => {
    const loadQRCode = async () => {
      if (!options.qrCodeId || !options.autoLoad) return;
      
      setLoading(true);
      try {
        const loadedQrCode = await getQRCodeById(options.qrCodeId);
        setQrCode(loadedQrCode);
      } catch (error) {
        console.error('Error loading QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQRCode();
  }, [options.qrCodeId, options.autoLoad]);

  // Generate QR code
  const generateQRCode = async (
    businessId: string,
    type: 'discount' | 'loyalty' | 'info',
    opts: {
      discountPercentage?: number;
      pointsValue?: number;
    } = {}
  ) => {
    if (!user) {
      toast.error('You must be logged in to generate a QR code');
      return null;
    }

    setGenerating(true);
    try {
      const result = await generateBusinessQRCode(businessId, type, opts);
      if (result.success && result.qrCode) {
        setQrCode(result.qrCode);
        return result.qrCode;
      }
      return null;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
      return null;
    } finally {
      setGenerating(false);
    }
  };

  // Scan QR code
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

    setScanning(true);
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
      setScanning(false);
    }
  };

  // Update QR code
  const updateQrCode = async (updates: Partial<QRCode>) => {
    if (!qrCode?.id) {
      toast.error('No QR code to update');
      return false;
    }

    setLoading(true);
    try {
      const result = await updateQRCode(qrCode.id, updates);
      if (result.success && result.qrCode) {
        setQrCode(result.qrCode);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast.error('Failed to update QR code');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    qrCode,
    loading,
    generating,
    scanning,
    generateQRCode,
    scanQRCode,
    updateQrCode,
  };
};
