
import { supabase } from '@/integrations/supabase/client';
import { QRCodeScanResult } from '@/lib/api/qr-code-api';
import { toast } from 'sonner';

interface UseQRCodeScanningOptions {
  setLoading: (loading: boolean) => void;
}

export const useQRCodeScanning = ({ setLoading }: UseQRCodeScanningOptions) => {
  const scanQRCode = async (qrCodeId: string): Promise<QRCodeScanResult | null> => {
    setLoading(true);
    try {
      const { data: qrCode, error: qrError } = await supabase
        .from('qr_codes')
        .select('*, businesses(business_name)')
        .eq('id', qrCodeId)
        .single();

      if (qrError || !qrCode) {
        toast.error('Invalid QR code');
        return { success: false, error: 'Invalid QR code' };
      }

      if (!qrCode.is_active) {
        toast.error('This QR code is no longer active');
        return { success: false, error: 'QR code is inactive' };
      }

      if (qrCode.scan_limit && qrCode.current_scans >= qrCode.scan_limit) {
        toast.error('This QR code has reached its scan limit');
        return { success: false, error: 'Scan limit reached' };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to scan QR codes');
        return { success: false, error: 'Authentication required' };
      }

      const scanData = {
        qr_code_id: qrCodeId,
        customer_id: user.id,
        business_id: qrCode.business_id,
        points_awarded: qrCode.points_value || 0,
        discount_applied: qrCode.discount_percentage || 0
      };

      const { error: scanError } = await supabase
        .from('qr_scans')
        .insert(scanData);

      if (scanError) {
        console.error('Error recording scan:', scanError);
        toast.error('Failed to record scan');
        return { success: false, error: 'Failed to record scan' };
      }

      await supabase
        .from('qr_codes')
        .update({ current_scans: qrCode.current_scans + 1 })
        .eq('id', qrCodeId);

      if (qrCode.points_value > 0) {
        await supabase
          .from('loyalty_points')
          .upsert({
            customer_id: user.id,
            business_id: qrCode.business_id,
            points: qrCode.points_value
          }, {
            onConflict: 'customer_id,business_id'
          });
      }

      const result = {
        success: true,
        businessName: qrCode.businesses?.business_name || 'Business',
        pointsEarned: qrCode.points_value || 0,
        discountApplied: qrCode.discount_percentage || 0
      };

      toast.success(`Scanned successfully! Earned ${result.pointsEarned} points`);
      return result;
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast.error('Failed to scan QR code');
      return { success: false, error: 'Scan failed' };
    } finally {
      setLoading(false);
    }
  };

  return {
    scanQRCode
  };
};
