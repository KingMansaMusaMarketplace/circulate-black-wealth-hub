
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { createBusinessQrCodeUrl } from './qr-generator';

export interface QRCode {
  id: string;
  business_id: string;
  code_type: 'discount' | 'loyalty' | 'info';
  discount_percentage?: number;
  points_value?: number;
  is_active: boolean;
  expiration_date?: string;
  scan_limit?: number;
  current_scans: number;
  qr_image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QRScan {
  id: string;
  qr_code_id: string;
  customer_id: string;
  business_id: string;
  points_awarded: number;
  discount_applied: number;
  scan_date: string;
  location_lat?: number;
  location_lng?: number;
  created_at: string;
}

// Generate QR code for a business
export const generateBusinessQRCode = async (
  businessId: string,
  codeType: 'discount' | 'loyalty' | 'info',
  options: {
    discountPercentage?: number;
    pointsValue?: number;
  } = {}
): Promise<{ success: boolean; qrCode?: QRCode; error?: any }> => {
  try {
    // Generate QR code image URL
    const qrData = {
      discount: options.discountPercentage,
      points: options.pointsValue
    };
    
    const qrImageUrl = await createBusinessQrCodeUrl(businessId, codeType, qrData);
    
    // Create QR code in database
    const { data, error } = await supabase.rpc('create_business_qr_code', {
      p_business_id: businessId,
      p_code_type: codeType,
      p_discount_percentage: options.discountPercentage || null,
      p_points_value: options.pointsValue || null
    });
    
    if (error) throw error;
    
    // Fetch the created QR code
    const { data: qrCode, error: fetchError } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', data)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Update QR code with image URL
    const { error: updateError } = await supabase
      .from('qr_codes')
      .update({ qr_image_url: qrImageUrl })
      .eq('id', data);
      
    if (updateError) throw updateError;
    
    // Also update the business record with QR code info
    const { error: businessUpdateError } = await supabase
      .from('businesses')
      .update({ 
        qr_code_id: data,
        qr_code_url: qrImageUrl
      })
      .eq('id', businessId);
    
    if (businessUpdateError) throw businessUpdateError;
    
    // Return with the image URL added
    const completeQrCode = {
      ...qrCode,
      qr_image_url: qrImageUrl
    };
    
    toast.success('QR code generated successfully!');
    return { success: true, qrCode: completeQrCode };
  } catch (error: any) {
    console.error('Error generating QR code:', error.message);
    toast.error('Failed to generate QR code: ' + error.message);
    return { success: false, error };
  }
};

// Process a QR code scan
export const processQRScan = async (
  qrCodeId: string,
  customerId: string,
  location?: {
    lat: number;
    lng: number;
  }
): Promise<{ success: boolean; result?: any; error?: any }> => {
  try {
    const { data, error } = await supabase.rpc('process_qr_scan', {
      p_qr_code_id: qrCodeId,
      p_customer_id: customerId,
      p_lat: location?.lat || null,
      p_lng: location?.lng || null
    });
    
    if (error) throw error;
    
    if (!data.success) {
      toast.error(data.message || 'QR scan failed');
      return { success: false, error: data.message };
    }
    
    toast.success(`QR scan successful! Earned ${data.points_awarded} points.`);
    return { success: true, result: data };
  } catch (error: any) {
    console.error('Error processing QR scan:', error.message);
    toast.error('Failed to process QR scan: ' + error.message);
    return { success: false, error };
  }
};

// Get QR scans for a customer
export const getCustomerQRScans = async (customerId: string): Promise<QRScan[]> => {
  try {
    const { data, error } = await supabase
      .from('qr_scans')
      .select('*, businesses(business_name)')
      .eq('customer_id', customerId)
      .order('scan_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching QR scans:', error.message);
    return [];
  }
};

// Get QR scans for a business
export const getBusinessQRScans = async (businessId: string): Promise<QRScan[]> => {
  try {
    const { data, error } = await supabase
      .from('qr_scans')
      .select('*, profiles(full_name)')
      .eq('business_id', businessId)
      .order('scan_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching business QR scans:', error.message);
    return [];
  }
};

// Get a single QR code by ID
export const getQRCodeById = async (qrCodeId: string): Promise<QRCode | null> => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', qrCodeId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching QR code:', error.message);
    return null;
  }
};

// Update a QR code
export const updateQRCode = async (
  qrCodeId: string, 
  updates: Partial<QRCode>
): Promise<{ success: boolean; qrCode?: QRCode; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .update(updates)
      .eq('id', qrCodeId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('QR code updated successfully!');
    return { success: true, qrCode: data };
  } catch (error: any) {
    console.error('Error updating QR code:', error.message);
    toast.error('Failed to update QR code: ' + error.message);
    return { success: false, error };
  }
};
