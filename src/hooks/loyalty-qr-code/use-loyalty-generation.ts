
import { useQRCode } from '@/hooks/qr-code';

export const useLoyaltyGeneration = () => {
  const { generateQRCode } = useQRCode();

  const generateLoyaltyQRCode = async (businessId: string, pointsValue: number) => {
    return await generateQRCode(businessId, 'loyalty', { pointsValue });
  };

  const generateDiscountQRCode = async (businessId: string, discountPercentage: number) => {
    return await generateQRCode(businessId, 'discount', { discountPercentage });
  };

  return {
    generateLoyaltyQRCode,
    generateDiscountQRCode
  };
};
