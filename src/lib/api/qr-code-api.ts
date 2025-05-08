
// Define the QR code types
export type QRCodeType = 'loyalty' | 'discount' | 'info';

// Define the QR code model
export interface QRCode {
  id: string;
  business_id: string;
  code_type: QRCodeType;
  points_value?: number;
  discount_percentage?: number;
  qr_image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  current_scans: number;
  scan_limit?: number;
  expiration_date?: string;
}

// Define the QR code scan model
export interface QRScan {
  id: string;
  qr_code_id: string;
  customer_id: string;
  business_id: string;
  scan_date: string;
  points_awarded: number;
  discount_applied: number;
  location_lat?: number;
  location_lng?: number;
}

// Define parameters for QR code generation
export interface QRCodeGenerationParams {
  businessId: string;
  codeType: QRCodeType;
  pointsValue?: number;
  discountPercentage?: number;
  scanLimit?: number;
  expirationDays?: number;
}

// Define QR code update parameters
export interface QRCodeUpdateParams {
  is_active?: boolean;
  points_value?: number;
  discount_percentage?: number;
  scan_limit?: number;
  expiration_date?: string;
  qr_image_url?: string;
}

// Get QR scans for a customer
export const getCustomerQRScans = async (customerId: string): Promise<QRScan[]> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data, error } = await supabase
      .from('qr_scans')
      .select('*')
      .eq('customer_id', customerId);
    
    if (error) throw error;
    
    return data as QRScan[];
  } catch (error) {
    console.error('Error fetching customer QR scans:', error);
    return [];
  }
};
