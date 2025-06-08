
export interface QRCode {
  id: string;
  qr_image_url?: string;
  code_type: 'loyalty' | 'discount' | 'info';
  points_value?: number;
  discount_percentage?: number;
  business_id: string;
  is_active: boolean;
  scan_limit?: number;
  current_scans: number;
  expiration_date?: string;
  created_at: string;
  updated_at: string;
}

export interface QRCodeGenerationParams {
  businessId: string;
  codeType: 'loyalty' | 'discount' | 'info';
  pointsValue?: number;
  discountPercentage?: number;
  scanLimit?: number;
  expirationDate?: string;
  isActive?: boolean;
}

export interface QRCodeScanResult {
  success: boolean;
  businessName?: string;
  pointsEarned?: number;
  discountApplied?: number;
  error?: string;
}
