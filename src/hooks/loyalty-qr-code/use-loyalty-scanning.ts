
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQRCode } from '@/hooks/qr-code';
import { useLoyalty } from '@/hooks/use-loyalty';
import { toast } from 'sonner';

interface UseLoyaltyScanningOptions {
  businessId?: string;
  autoRefresh?: boolean;
}

export const useLoyaltyScanning = (options: UseLoyaltyScanningOptions = {}) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    businessName?: string;
    pointsEarned?: number;
    discountApplied?: number;
  } | null>(null);
  
  const { user } = useAuth();
  const { scanQRCode } = useQRCode();
  const { refreshData } = useLoyalty();
  
  // Scan QR code and process loyalty points in one operation
  const scanQRAndProcessPoints = async (
    qrCodeId: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to scan a QR code');
      return null;
    }
    
    setScanning(true);
    setScanResult(null);
    
    try {
      const result = await scanQRCode(qrCodeId);
      
      if (result && result.success) {
        // Get business name from the result
        const businessName = result.business_name || 'Business';
        
        const scanResultData = {
          success: true,
          businessName: businessName,
          pointsEarned: result.points_awarded || 0,
          discountApplied: result.discount_applied || 0
        };
        
        setScanResult(scanResultData);
        
        // Refresh loyalty data to show updated points
        if (options.autoRefresh) {
          await refreshData();
        }
        
        return scanResultData;
      } else {
        setScanResult({ success: false });
      }
      
      return null;
    } catch (error) {
      console.error('Error scanning QR code and processing points:', error);
      toast.error('Failed to process QR code scan');
      setScanResult({ success: false });
      return null;
    } finally {
      setScanning(false);
    }
  };
  
  return {
    scanning,
    scanResult,
    scanQRAndProcessPoints
  };
};
