
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QRCode, QRCodeUpdateParams } from '@/lib/api/qr-code-api';
import { useAuth } from '@/contexts/AuthContext';

// Hook for managing QR code generation and operations
export const useQRCode = () => {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const { user } = useAuth();

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

      // We need to create the QR code with SQL since the function isn't available via RPC yet
      const { data, error } = await supabase.rpc('create_business_qr_code', {
        p_business_id: businessId,
        p_code_type: codeType,
        p_discount_percentage: options?.discountPercentage || null,
        p_points_value: options?.pointsValue || null
      });

      if (error) {
        console.error('Error generating QR code:', error);
        toast.error('Failed to generate QR code');
        return null;
      }

      // Fetch the newly created QR code - assuming the function returns the id
      const qrCodeId = data && Array.isArray(data) && data.length > 0 ? data[0].create_business_qr_code : null;
      
      if (!qrCodeId) {
        toast.error('Failed to retrieve QR code ID');
        return null;
      }
      
      const { data: qrCodeData, error: fetchError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrCodeId)
        .single();

      if (fetchError) {
        console.error('Error fetching QR code:', fetchError);
        toast.error('QR code generated but failed to retrieve details');
        return null;
      }

      // Generate QR image URL if not already set
      if (!qrCodeData.qr_image_url) {
        // In a real app, you would generate the QR code image here
        // For demo purposes, we'll use a placeholder
        const updatedQRCode = await updateQRCodeImage(qrCodeId, businessId);
        setQrCode(updatedQRCode);
        return updatedQRCode;
      }

      setQrCode(qrCodeData as QRCode);
      return qrCodeData as QRCode;
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
  
  // Scan a QR code
  const scanQRCode = async (qrCodeId: string, location?: { lat: number; lng: number }): Promise<any> => {
    setLoading(true);
    try {
      // In a real app, you would implement the scan logic here
      // For demo purposes, we'll just return a success message
      toast.success('QR code scanned successfully');
      return { 
        success: true,
        business_id: 'demo-business-id',
        points_awarded: 10,
        discount_applied: 0
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
    loading,
    qrCode,
    generateQRCode,
    fetchBusinessQRCodes,
    updateQRCode,
    deleteQRCode,
    scanQRCode
  };
};
