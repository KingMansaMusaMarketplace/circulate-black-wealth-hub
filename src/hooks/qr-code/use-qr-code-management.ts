
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QRCode } from '@/lib/api/qr-code-api';

interface UseQRCodeManagementOptions {
  setLoading: (loading: boolean) => void;
}

export const useQRCodeManagement = ({ setLoading }: UseQRCodeManagementOptions) => {
  // Fetch QR codes for a business
  const fetchBusinessQRCodes = async (businessId: string): Promise<QRCode[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('business_id', businessId);

      if (error) {
        console.error('Error fetching QR codes:', error);
        toast.error('Failed to fetch QR codes');
        return [];
      }

      return data as QRCode[];
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update QR code properties
  const updateQRCode = async (qrCodeId: string, updates: Partial<QRCode>): Promise<QRCode | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .update(updates)
        .eq('id', qrCodeId)
        .select()
        .single();

      if (error) {
        console.error('Error updating QR code:', error);
        toast.error('Failed to update QR code');
        return null;
      }

      toast.success('QR code updated successfully');
      return data as QRCode;
    } catch (error) {
      console.error('Error updating QR code:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a QR code
  const deleteQRCode = async (qrCodeId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', qrCodeId);

      if (error) {
        console.error('Error deleting QR code:', error);
        toast.error('Failed to delete QR code');
        return false;
      }

      toast.success('QR code deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting QR code:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchBusinessQRCodes,
    updateQRCode,
    deleteQRCode
  };
};
