
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { QRCode } from '@/lib/api/qr-code-api';

interface UseQRCodeScanningOptions {
  setLoading: (loading: boolean) => void;
}

export const useQRCodeScanning = ({ setLoading }: UseQRCodeScanningOptions) => {
  const { user } = useAuth();

  // Scan a QR code
  const scanQRCode = async (qrCodeId: string, location?: { lat: number; lng: number }): Promise<any> => {
    setLoading(true);
    try {
      // Verify the QR code exists and is valid
      const { data: qrCode, error: qrError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrCodeId)
        .single();
      
      if (qrError || !qrCode) {
        console.error('Error finding QR code:', qrError);
        toast.error('Invalid QR code');
        return { success: false };
      }
      
      if (!qrCode.is_active) {
        toast.error('This QR code is inactive');
        return { success: false };
      }
      
      // Check if the QR code has reached its scan limit
      if (qrCode.scan_limit && qrCode.current_scans >= qrCode.scan_limit) {
        toast.error('This QR code has reached its scan limit');
        return { success: false };
      }
      
      // Check if the QR code has expired
      if (qrCode.expiration_date && new Date(qrCode.expiration_date) < new Date()) {
        toast.error('This QR code has expired');
        return { success: false };
      }
      
      // Record the scan
      const scanData = {
        qr_code_id: qrCodeId,
        customer_id: user?.id || 'anonymous',
        business_id: qrCode.business_id,
        points_awarded: qrCode.points_value || 0,
        discount_applied: qrCode.discount_percentage || 0,
        location_lat: location?.lat,
        location_lng: location?.lng
      };
      
      const { data: scanResult, error: scanError } = await supabase
        .from('qr_scans')
        .insert(scanData)
        .select()
        .single();
        
      if (scanError) {
        console.error('Error recording scan:', scanError);
        toast.error('Failed to record scan');
        return { success: false };
      }
      
      // Update the current_scans count
      await supabase
        .from('qr_codes')
        .update({ current_scans: qrCode.current_scans + 1 })
        .eq('id', qrCodeId);
      
      // For loyalty QR codes, update the user's points
      if (qrCode.code_type === 'loyalty' && qrCode.points_value && user) {
        // First check if the user already has points with this business
        const { data: existingPoints } = await supabase
          .from('loyalty_points')
          .select('*')
          .eq('customer_id', user.id)
          .eq('business_id', qrCode.business_id)
          .single();
          
        if (existingPoints) {
          // Update existing points
          await supabase
            .from('loyalty_points')
            .update({ points: existingPoints.points + qrCode.points_value })
            .eq('id', existingPoints.id);
        } else {
          // Create new points record
          await supabase
            .from('loyalty_points')
            .insert({
              customer_id: user.id,
              business_id: qrCode.business_id,
              points: qrCode.points_value
            });
        }
        
        toast.success(`You earned ${qrCode.points_value} points!`);
      }
      
      // For discount QR codes, show the discount amount
      if (qrCode.code_type === 'discount' && qrCode.discount_percentage) {
        toast.success(`You received a ${qrCode.discount_percentage}% discount!`);
      }
      
      return { 
        success: true,
        business_id: qrCode.business_id,
        points_awarded: qrCode.points_value || 0,
        discount_applied: qrCode.discount_percentage || 0,
        scan_id: scanResult.id
      };
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast.error('Failed to scan QR code');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    scanQRCode
  };
};
