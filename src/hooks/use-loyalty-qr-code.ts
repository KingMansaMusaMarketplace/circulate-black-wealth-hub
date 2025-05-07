
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQRCode } from './use-qr-code';
import { useLoyalty } from './use-loyalty';
import { toast } from 'sonner';

interface UseLoyaltyQRCodeOptions {
  businessId?: string;
  autoRefresh?: boolean;
}

export const useLoyaltyQRCode = (options: UseLoyaltyQRCodeOptions = {}) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    businessName?: string;
    pointsEarned?: number;
    discountApplied?: number;
  } | null>(null);
  
  const { user } = useAuth();
  const { qrCode, generateQRCode, scanQRCode } = useQRCode();
  const { 
    totalPoints, 
    loyaltyPoints, 
    redeemReward, 
    refreshLoyaltyData 
  } = useLoyalty();
  
  // Scan QR code and process loyalty points in one operation
  const scanQRAndProcessPoints = async (
    qrCodeId: string,
    location?: { lat: number; lng: number }
  ) => {
    if (!user) {
      toast.error('You must be logged in to scan a QR code');
      return null;
    }
    
    setScanning(true);
    setScanResult(null);
    
    try {
      const result = await scanQRCode(qrCodeId, location);
      
      if (result && result.success) {
        // Get business name
        const businessPoints = loyaltyPoints.find(
          (p) => p.business_id === result.business_id
        );
        
        // Just use business_id as the name when actual name isn't available
        const businessName = businessPoints?.business_id || 'Business';
        
        const scanResultData = {
          businessName: businessName,
          pointsEarned: result.points_awarded || 0,
          discountApplied: result.discount_applied || 0
        };
        
        setScanResult(scanResultData);
        
        // Refresh loyalty data to show updated points
        if (options.autoRefresh) {
          await refreshLoyaltyData();
        }
        
        return scanResultData;
      }
      
      return null;
    } catch (error) {
      console.error('Error scanning QR code and processing points:', error);
      toast.error('Failed to process QR code scan');
      return null;
    } finally {
      setScanning(false);
    }
  };
  
  // Generate loyalty QR code for a business
  const generateLoyaltyQRCode = async (
    businessId: string, 
    pointsValue: number = 10
  ) => {
    if (!user) {
      toast.error('You must be logged in to generate a QR code');
      return null;
    }
    
    try {
      const newQrCode = await generateQRCode(
        businessId,
        'loyalty',
        { pointsValue }
      );
      
      return newQrCode;
    } catch (error) {
      console.error('Error generating loyalty QR code:', error);
      toast.error('Failed to generate loyalty QR code');
      return null;
    }
  };
  
  // Generate discount QR code for a business
  const generateDiscountQRCode = async (
    businessId: string,
    discountPercentage: number = 10
  ) => {
    if (!user) {
      toast.error('You must be logged in to generate a QR code');
      return null;
    }
    
    try {
      const newQrCode = await generateQRCode(
        businessId,
        'discount',
        { discountPercentage }
      );
      
      return newQrCode;
    } catch (error) {
      console.error('Error generating discount QR code:', error);
      toast.error('Failed to generate discount QR code');
      return null;
    }
  };
  
  return {
    qrCode,
    totalPoints,
    loyaltyPoints,
    scanning,
    scanResult,
    scanQRAndProcessPoints,
    generateLoyaltyQRCode,
    generateDiscountQRCode,
    redeemReward,
    refreshLoyaltyData
  };
};
