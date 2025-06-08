
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQRCode } from '@/hooks/qr-code';
import { toast } from 'sonner';

export const useLoyaltyGeneration = () => {
  const { user } = useAuth();
  const { generateQRCode } = useQRCode();
  
  // Generate loyalty QR code for a business
  const generateLoyaltyQRCode = async (
    businessId: string, 
    pointsValue: number = 10,
    options?: {
      scanLimit?: number;
      expirationDate?: string;
      isActive?: boolean;
    }
  ) => {
    if (!user) {
      toast.error('You must be logged in to generate a QR code');
      return null;
    }
    
    try {
      const newQrCode = await generateQRCode(
        businessId,
        'loyalty',
        { 
          pointsValue,
          scanLimit: options?.scanLimit,
          expirationDate: options?.expirationDate,
          isActive: options?.isActive
        }
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
    discountPercentage: number = 10,
    options?: {
      scanLimit?: number;
      expirationDate?: string;
      isActive?: boolean;
    }
  ) => {
    if (!user) {
      toast.error('You must be logged in to generate a QR code');
      return null;
    }
    
    try {
      const newQrCode = await generateQRCode(
        businessId,
        'discount',
        { 
          discountPercentage,
          scanLimit: options?.scanLimit,
          expirationDate: options?.expirationDate,
          isActive: options?.isActive
        }
      );
      
      return newQrCode;
    } catch (error) {
      console.error('Error generating discount QR code:', error);
      toast.error('Failed to generate discount QR code');
      return null;
    }
  };
  
  return {
    generateLoyaltyQRCode,
    generateDiscountQRCode
  };
};
