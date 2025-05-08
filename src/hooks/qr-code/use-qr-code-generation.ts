
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QRCode } from '@/lib/api/qr-code-api';

interface UseQRCodeGenerationOptions {
  setLoading: (loading: boolean) => void;
  setQrCode: (qrCode: QRCode | null) => void;
}

export const useQRCodeGeneration = ({ setLoading, setQrCode }: UseQRCodeGenerationOptions) => {
  // Generate a new QR code for the business
  const generateQRCode = async (
    businessId: string, 
    codeType: 'loyalty' | 'discount' | 'info',
    options?: {
      discountPercentage?: number;
      pointsValue?: number;
    }
  ): Promise<QRCode | null> => {
    setLoading(true);
    
    try {
      if (!businessId) {
        throw new Error('Business ID is required to generate QR code');
      }

      // Instead of using RPC, we'll directly insert into the qr_codes table
      const { data: qrCodeData, error: insertError } = await supabase
        .from('qr_codes')
        .insert({
          business_id: businessId,
          code_type: codeType,
          discount_percentage: options?.discountPercentage || null,
          points_value: options?.pointsValue || null
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error generating QR code:', insertError);
        toast.error('Failed to generate QR code');
        return null;
      }

      // Generate QR image URL if not already set
      if (qrCodeData && !qrCodeData.qr_image_url) {
        // In a real app, you would generate the QR code image here
        // For demo purposes, we'll use a placeholder
        const updatedQRCode = await updateQRCodeImage(qrCodeData.id, businessId);
        setQrCode(updatedQRCode);
        return updatedQRCode;
      }

      if (qrCodeData) {
        setQrCode(qrCodeData as QRCode);
        return qrCodeData as QRCode;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error in QR code generation:', error);
      toast.error(error.message || 'Failed to generate QR code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update the QR code image URL
  const updateQRCodeImage = async (qrCodeId: string, businessId: string): Promise<QRCode | null> => {
    try {
      // In a real app, you would generate a QR code image and upload it to storage
      // For demo purposes, we'll use a placeholder URL
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        `https://mansa-musa.vercel.app/scan?qr=${qrCodeId}&business=${businessId}`
      )}`;

      const { data, error } = await supabase
        .from('qr_codes')
        .update({ qr_image_url: qrImageUrl })
        .eq('id', qrCodeId)
        .select()
        .single();

      if (error) {
        console.error('Error updating QR code image:', error);
        return null;
      }

      return data as QRCode;
    } catch (error) {
      console.error('Error updating QR code image:', error);
      return null;
    }
  };

  return {
    generateQRCode
  };
};
