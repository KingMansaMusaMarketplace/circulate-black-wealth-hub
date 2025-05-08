
import { useState } from 'react';
import { toast } from 'sonner';
import { QRCode } from '@/lib/api/qr-code-api';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { useQRCodeGeneration } from './use-qr-code-generation';
import { useQRCodeManagement } from './use-qr-code-management';
import { useQRCodeScanning } from './use-qr-code-scanning';

// Main hook for managing QR code operations
export const useQRCode = () => {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const { user } = useAuth();
  const { profile } = useBusinessProfile();
  
  // Use specialized hooks for different QR code operations
  const { generateQRCode } = useQRCodeGeneration({ setLoading, setQrCode });
  const { 
    fetchBusinessQRCodes, 
    updateQRCode, 
    deleteQRCode 
  } = useQRCodeManagement({ setLoading });
  const { scanQRCode } = useQRCodeScanning({ setLoading });
  
  // Wrapper for QR code operations that checks for user and business profile
  const checkBusinessAndUser = () => {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return false;
    }
    
    if (!profile?.id) {
      toast.error('You need a business profile to perform this action');
      return false;
    }
    
    return true;
  };
  
  return {
    loading,
    qrCode,
    businessProfile: profile,
    generateQRCode: async (businessId?: string, codeType?: any, options?: any) => {
      // If businessId not provided, use the current business profile
      const actualBusinessId = businessId || profile?.id;
      if (!actualBusinessId && !checkBusinessAndUser()) {
        return null;
      }
      return generateQRCode(actualBusinessId, codeType, options);
    },
    fetchBusinessQRCodes: async () => {
      if (!checkBusinessAndUser() || !profile?.id) {
        return [];
      }
      return fetchBusinessQRCodes(profile.id);
    },
    updateQRCode,
    deleteQRCode,
    scanQRCode
  };
};
