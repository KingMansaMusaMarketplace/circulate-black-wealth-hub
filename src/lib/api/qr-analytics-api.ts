import { supabase } from '@/integrations/supabase/client';

export interface QRCodeAnalytics {
  total_scans: number;
  unique_scans: number;
  total_conversions: number;
  conversion_rate: number;
  scans_last_7_days: number;
  scans_last_30_days: number;
  conversions_last_7_days: number;
  conversions_last_30_days: number;
}

export interface QRCodeScan {
  id: string;
  referral_code: string;
  scanned_at: string;
  converted: boolean;
  converted_at?: string;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Track a QR code scan
 */
export const trackQRCodeScan = async (referralCode: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('track_qr_scan', {
      p_referral_code: referralCode,
      p_ip_address: null,
      p_user_agent: navigator.userAgent
    });

    if (error) {
      console.error('Error tracking QR scan:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error tracking QR scan:', error);
    return null;
  }
};

/**
 * Get QR code analytics for an agent's referral code
 */
export const getQRCodeAnalytics = async (referralCode: string): Promise<QRCodeAnalytics | null> => {
  try {
    const { data, error } = await supabase.rpc('get_agent_qr_analytics', {
      agent_referral_code: referralCode
    });

    if (error) {
      console.error('Error fetching QR analytics:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return {
        total_scans: 0,
        unique_scans: 0,
        total_conversions: 0,
        conversion_rate: 0,
        scans_last_7_days: 0,
        scans_last_30_days: 0,
        conversions_last_7_days: 0,
        conversions_last_30_days: 0
      };
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching QR analytics:', error);
    return null;
  }
};

/**
 * Get recent QR code scans for an agent
 */
export const getRecentQRScans = async (salesAgentId: string, limit: number = 10): Promise<QRCodeScan[]> => {
  try {
    const { data, error } = await supabase
      .from('qr_code_scans')
      .select('*')
      .eq('sales_agent_id', salesAgentId)
      .order('scanned_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent QR scans:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching recent QR scans:', error);
    return [];
  }
};

/**
 * Mark a QR code scan as converted (called after successful signup)
 */
export const markQRScanConverted = async (referralCode: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('mark_qr_scan_converted', {
      p_referral_code: referralCode,
      p_user_id: userId
    });

    if (error) {
      console.error('Error marking QR scan as converted:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Error marking QR scan as converted:', error);
    return false;
  }
};
