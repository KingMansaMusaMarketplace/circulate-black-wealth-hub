
import { useState } from 'react';
import { toast } from 'sonner';
import { QRCode } from '@/lib/api/qr-code-api';
import { supabase } from '@/lib/supabase';

export const useQRCode = () => {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<QRCode | null>(null);

  const generateQRCode = async (
    businessId?: string, 
    codeType?: string, 
    options?: any
  ): Promise<QRCode | null> => {
    if (!businessId) {
      toast.error('Business ID is required');
      return null;
    }

    setLoading(true);
    try {
      // Insert QR code into database
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          business_id: businessId,
          code_type: codeType || 'loyalty',
          is_active: true,
          points_value: options?.pointsValue || 10,
          discount_percentage: options?.discountPercentage,
          scan_limit: options?.scanLimit,
          current_scans: 0,
          expiration_date: options?.expirationDate
        })
        .select()
        .single();

      if (error) throw error;

      const newQrCode: QRCode = {
        id: data.id,
        code_type: data.code_type as 'loyalty' | 'discount' | 'checkin',
        business_id: data.business_id,
        is_active: data.is_active,
        points_value: data.points_value,
        discount_percentage: data.discount_percentage,
        scan_limit: data.scan_limit,
        current_scans: data.current_scans,
        expiration_date: data.expiration_date,
        created_at: data.created_at,
        updated_at: data.updated_at,
        qr_image_url: data.qr_image_url
      };
      
      setQrCode(newQrCode);
      toast.success('QR code generated successfully');
      return newQrCode;
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      toast.error(error.message || 'Failed to generate QR code');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessQRCodes = async (businessId: string): Promise<QRCode[]> => {
    if (!businessId) return [];

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(qr => ({
        id: qr.id,
        code_type: qr.code_type as 'loyalty' | 'discount' | 'checkin',
        business_id: qr.business_id,
        is_active: qr.is_active,
        points_value: qr.points_value,
        discount_percentage: qr.discount_percentage,
        scan_limit: qr.scan_limit,
        current_scans: qr.current_scans,
        expiration_date: qr.expiration_date,
        created_at: qr.created_at,
        updated_at: qr.updated_at,
        qr_image_url: qr.qr_image_url
      }));
    } catch (error: any) {
      console.error('Error fetching QR codes:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateQRCode = async (id: string, updates: Partial<QRCode>): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('qr_codes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('QR code updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating QR code:', error);
      toast.error(error.message || 'Failed to update QR code');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteQRCode = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('QR code deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting QR code:', error);
      toast.error(error.message || 'Failed to delete QR code');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const scanQRCode = async (qrData: string): Promise<any> => {
    setLoading(true);
    try {
      // Parse QR code data
      let qrCodeId: string | null = null;
      let businessId: string | null = null;

      try {
        const parsed = JSON.parse(qrData);
        qrCodeId = parsed.qrCodeId || parsed.id;
        businessId = parsed.businessId || parsed.business_id;
      } catch {
        // If not JSON, try to extract from URL or use as ID directly
        if (qrData.includes('business/')) {
          businessId = qrData.split('business/')[1]?.split(/[?#]/)[0];
        } else if (qrData.includes('qr/')) {
          qrCodeId = qrData.split('qr/')[1]?.split(/[?#]/)[0];
        } else {
          qrCodeId = qrData;
        }
      }

      if (!qrCodeId && !businessId) {
        throw new Error('Invalid QR code data');
      }

      // Fetch QR code details
      let qrCodeData;
      if (qrCodeId) {
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*, businesses(business_name)')
          .eq('id', qrCodeId)
          .single();

        if (error) throw error;
        qrCodeData = data;
      } else if (businessId) {
        const { data, error } = await supabase
          .from('qr_codes')
          .select('*, businesses(business_name)')
          .eq('business_id', businessId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        qrCodeData = data;
      }

      if (!qrCodeData) {
        throw new Error('QR code not found');
      }

      const pointsEarned = qrCodeData.points_value || 10;
      const businessName = (qrCodeData.businesses as any)?.business_name || 'Business';

      return {
        success: true,
        businessName,
        businessId: qrCodeData.business_id,
        pointsEarned,
        discountApplied: qrCodeData.discount_percentage || 0,
        qrCodeId: qrCodeData.id
      };
    } catch (error: any) {
      console.error('Error scanning QR code:', error);
      return {
        success: false,
        error: error.message || 'Failed to scan QR code'
      };
    } finally {
      setLoading(false);
    }
  };

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
