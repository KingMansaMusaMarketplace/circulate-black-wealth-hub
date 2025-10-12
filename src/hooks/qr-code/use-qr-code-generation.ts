
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
      // Check current QR code count and subscription tier
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('owner_id')
        .eq('id', businessId)
        .single();

      if (businessError) throw businessError;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', business.owner_id)
        .single();

      if (profileError) throw profileError;

      const tier = profile.subscription_tier;

      // Define QR code limits per tier
      const tierLimits: Record<string, number> = {
        business_starter: 5,
        business_starter_annual: 5,
        business: 25,
        business_annual: 25,
        business_multi_location: -1, // unlimited
        business_multi_location_annual: -1,
        enterprise: -1
      };

      const limit = tierLimits[tier] || 0;

      // Check current count if limit exists
      if (limit !== -1 && limit > 0) {
        const { count, error: countError } = await supabase
          .from('qr_codes')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', businessId);

        if (countError) throw countError;

        if (count && count >= limit) {
          toast.error(`QR code limit reached (${limit}). Upgrade your plan to create more codes.`);
          setLoading(false);
          return null;
        }
      }

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
