
import { useState } from 'react';
import { toast } from 'sonner';
import { QRCode } from '@/lib/api/qr-code-api';
import { useAuth } from '@/contexts/AuthContext';
import { useQRCodeGeneration } from './use-qr-code-generation';
import { useQRCodeManagement } from './use-qr-code-management';
import { useQRCodeScanning } from './use-qr-code-scanning';

// Main hook for managing QR code operations
export const useQRCode = () => {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const { user } = useAuth();
  
  // Use specialized hooks for different QR code operations
  const { generateQRCode } = useQRCodeGeneration({ setLoading, setQrCode });
  const { 
    fetchBusinessQRCodes, 
    updateQRCode, 
    deleteQRCode 
  } = useQRCodeManagement({ setLoading });
  const { scanQRCode } = useQRCodeScanning({ setLoading });
  
  return {
    loading,
    qrCode,
    generateQRCode,
    fetchBusinessQRCodes,
    updateQRCode,
    deleteQRCode,
    scanQRCode
  };
};
