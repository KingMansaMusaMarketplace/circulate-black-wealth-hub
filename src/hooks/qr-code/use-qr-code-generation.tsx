
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QRCode, QRCodeGenerationParams } from '@/lib/api/qr-code-api';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { generateCustomQrCode } from '@/lib/api/qr-generator';
import { useAuth } from '@/contexts/AuthContext';

interface UseQRCodeGenerationOptions {
  setLoading: (loading: boolean) => void;
  setQrCode: (qrCode: QRCode | null) => void;
}

export const useQRCodeGeneration = ({ setLoading, setQrCode }: UseQRCodeGenerationOptions) => {
  const { user } = useAuth();
  const { profile } = useBusinessProfile();

  // Generate a new QR code for the business
  const generateQRCode = async (
    businessId?: string, 
    codeType?: 'loyalty' | 'discount' | 'info',
    options?: {
      discountPercentage?: number;
      pointsValue?: number;
      scanLimit?: number;
      expirationDate?: string;
      isActive?: boolean;
    }
  ): Promise<QRCode | null> => {
    setLoading(true);
    
    try {
      // Use profile.id if businessId is not provided
      const actualBusinessId = businessId || profile?.id;
      
      if (!actualBusinessId) {
        throw new Error('Business ID is required to generate QR code');
      }

      if (!codeType) {
        codeType = 'loyalty'; // Default to loyalty if not specified
      }

      // Insert into the qr_codes table FIRST to get the ID
      const { data: qrCodeData, error: insertError } = await supabase
        .from('qr_codes')
        .insert({
          business_id: actualBusinessId,
          code_type: codeType,
          discount_percentage: options?.discountPercentage || null,
          points_value: options?.pointsValue || null,
          scan_limit: options?.scanLimit || null,
          expiration_date: options?.expirationDate || null,
          is_active: options?.isActive !== undefined ? options.isActive : true,
          qr_image_url: '' // Will update after generating QR with the ID
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error generating QR code:', insertError);
        toast.error('Failed to generate QR code');
        return null;
      }

      if (!qrCodeData) {
        toast.error('Failed to create QR code record');
        return null;
      }

      // Now generate the QR code image with the database ID
      let qrImageUrl = '';
      try {
        // The QR code should contain just the database ID for easy lookup
        qrImageUrl = await generateCustomQrCode(qrCodeData.id, {
          color: '#1a1a1a',
          backgroundColor: '#FFFFFF',
          size: 512,
          useBranding: true
        });
      } catch (error) {
        console.error('Error generating QR code image:', error);
        // Fallback to a simple QR code generator API
        qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          qrCodeData.id
        )}&size=400x400&color=0F2876&bgcolor=FFFFFF`;
      }

      // Update the QR code record with the generated image
      const { error: updateError } = await supabase
        .from('qr_codes')
        .update({ qr_image_url: qrImageUrl })
        .eq('id', qrCodeData.id);

      if (updateError) {
        console.error('Error updating QR code image:', updateError);
        // Non-critical error, we can still return the QR code
      }

      setQrCode(qrCodeData as QRCode);
      toast.success('QR code generated successfully');
      return qrCodeData as QRCode;
    } catch (error: any) {
      console.error('Error in QR code generation:', error);
      toast.error(error.message || 'Failed to generate QR code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Regenerate QR code image
  const regenerateQRCodeImage = async (qrCodeId: string): Promise<QRCode | null> => {
    setLoading(true);
    try {
      // Get the QR code data
      const { data: qrCode, error: fetchError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrCodeId)
        .single();

      if (fetchError || !qrCode) {
        toast.error('Failed to find QR code');
        return null;
      }

      // Generate new QR code image with just the ID
      let qrImageUrl = '';
      try {
        qrImageUrl = await generateCustomQrCode(qrCode.id, {
          color: '#1a1a1a',
          backgroundColor: '#FFFFFF',
          size: 512,
          useBranding: true
        });
      } catch (error) {
        // Fallback to a simple QR code generator API
        qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          qrCode.id
        )}&size=400x400&color=0F2876&bgcolor=FFFFFF`;
      }

      // Update the QR code with the new image URL
      const { data: updatedQrCode, error: updateError } = await supabase
        .from('qr_codes')
        .update({ qr_image_url: qrImageUrl })
        .eq('id', qrCodeId)
        .select()
        .single();

      if (updateError) {
        toast.error('Failed to update QR code image');
        return null;
      }

      toast.success('QR code image regenerated successfully');
      return updatedQrCode as QRCode;
    } catch (error) {
      console.error('Error regenerating QR code image:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateQRCode,
    regenerateQRCodeImage
  };
};
