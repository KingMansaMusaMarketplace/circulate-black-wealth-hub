
import { supabase } from '@/integrations/supabase/client';
import { generateCustomQrCode } from '@/lib/api/qr-generator';
import { QRCode, QRCodeGenerationParams } from '@/lib/api/qr-code-api';
import { toast } from 'sonner';

interface UseQRCodeGenerationOptions {
  setLoading: (loading: boolean) => void;
  setQrCode: (qrCode: QRCode | null) => void;
}

export const useQRCodeGeneration = ({ setLoading, setQrCode }: UseQRCodeGenerationOptions) => {
  const generateQRCode = async (businessId: string, codeType: string, options?: any): Promise<QRCode | null> => {
    setLoading(true);
    try {
      const qrCodeData = {
        business_id: businessId,
        code_type: codeType,
        points_value: options?.pointsValue,
        discount_percentage: options?.discountPercentage,
        scan_limit: options?.scanLimit,
        expiration_date: options?.expirationDate,
        is_active: options?.isActive ?? true
      };

      const { data, error } = await supabase
        .from('qr_codes')
        .insert(qrCodeData)
        .select()
        .single();

      if (error) {
        console.error('Error creating QR code:', error);
        toast.error('Failed to generate QR code');
        return null;
      }

      const qrImageUrl = await generateCustomQrCode(data.id, {
        size: 400,
        color: '#1B365D',
        backgroundColor: '#FFFFFF'
      });

      const { data: updatedData, error: updateError } = await supabase
        .from('qr_codes')
        .update({ qr_image_url: qrImageUrl })
        .eq('id', data.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating QR code with image:', updateError);
        return data as QRCode;
      }

      const finalQRCode = updatedData as QRCode;
      setQrCode(finalQRCode);
      toast.success('QR code generated successfully!');
      return finalQRCode;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateQRCode
  };
};
