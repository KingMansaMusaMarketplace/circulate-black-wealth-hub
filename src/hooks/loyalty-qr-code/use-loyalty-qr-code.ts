
import { useState } from 'react';
import { useLoyaltyScanning } from './use-loyalty-scanning';
import { useLoyaltyGeneration } from './use-loyalty-generation';
import { useLoyaltyRewards } from './use-loyalty-rewards';
import { useLoyalty } from '@/hooks/use-loyalty';
import { useQRCode } from '@/hooks/qr-code';

interface UseLoyaltyQRCodeOptions {
  businessId?: string;
  autoRefresh?: boolean;
}

export const useLoyaltyQRCode = (options: UseLoyaltyQRCodeOptions = {}) => {
  const [qrCode, setQrCode] = useState(null);
  const { qrCode: qrCodeData } = useQRCode();
  const { summary } = useLoyalty();
  
  // Use the specialized hooks
  const { 
    scanning, 
    scanResult, 
    scanQRAndProcessPoints 
  } = useLoyaltyScanning(options);
  
  const {
    generateLoyaltyQRCode,
    generateDiscountQRCode
  } = useLoyaltyGeneration();
  
  const {
    totalPoints,
    redeemReward
  } = useLoyaltyRewards();
  
  return {
    qrCode: qrCode || qrCodeData,
    totalPoints,
    loyaltyPoints: totalPoints, // Use totalPoints as loyaltyPoints for backward compatibility
    scanning,
    scanResult,
    scanQRAndProcessPoints,
    generateLoyaltyQRCode,
    generateDiscountQRCode,
    redeemReward,
    refreshLoyaltyData: () => Promise.resolve() // Provide empty function for backward compatibility
  };
};
