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

export interface ScanHeatmapData {
  day: number; // 0 = Sunday, 6 = Saturday
  hour: number; // 0-23
  count: number;
}

/**
 * Track a QR code scan with optional email notification
 */
export const trackQRCodeScan = async (referralCode: string, sendNotification: boolean = true): Promise<string | null> => {
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

    const scanId = data;

    // Send email notification if enabled
    if (scanId && sendNotification) {
      try {
        // Get agent ID from referral code
        const { data: agent } = await supabase
          .from('sales_agents')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (agent) {
          await supabase.functions.invoke('send-qr-scan-notification', {
            body: {
              salesAgentId: agent.id,
              scanId: scanId,
              notificationType: 'scan'
            }
          });
        }
      } catch (notifError) {
        console.error('Error sending scan notification:', notifError);
        // Don't fail the tracking if notification fails
      }
    }

    return scanId;
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
 * Get QR code scan heatmap data (day of week x hour of day)
 */
export const getQRScanHeatmap = async (salesAgentId: string, days: number = 30): Promise<ScanHeatmapData[]> => {
  try {
    // Fetch scans from the last X days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabase
      .from('qr_code_scans')
      .select('scanned_at')
      .eq('sales_agent_id', salesAgentId)
      .gte('scanned_at', cutoffDate.toISOString())
      .order('scanned_at', { ascending: true });

    if (error) {
      console.error('Error fetching QR scan heatmap:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Process the data to create a heatmap
    const heatmapMap = new Map<string, number>();

    data.forEach((scan) => {
      const date = new Date(scan.scanned_at);
      const day = date.getDay(); // 0 = Sunday, 6 = Saturday
      const hour = date.getHours(); // 0-23
      const key = `${day}-${hour}`;

      heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
    });

    // Convert map to array
    const heatmapData: ScanHeatmapData[] = [];
    heatmapMap.forEach((count, key) => {
      const [day, hour] = key.split('-').map(Number);
      heatmapData.push({ day, hour, count });
    });

    return heatmapData;
  } catch (error) {
    console.error('Error fetching QR scan heatmap:', error);
    return [];
  }
};

/**
 * Mark a QR code scan as converted with optional email notification
 */
export const markQRScanConverted = async (referralCode: string, userId: string, sendNotification: boolean = true): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('mark_qr_scan_converted', {
      p_referral_code: referralCode,
      p_user_id: userId
    });

    if (error) {
      console.error('Error marking QR scan as converted:', error);
      return false;
    }

    // Send conversion notification if enabled
    if (data === true && sendNotification) {
      try {
        // Get agent and scan details
        const { data: agent } = await supabase
          .from('sales_agents')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (agent) {
          // Get the most recent scan that was just converted
          const { data: scan } = await supabase
            .from('qr_code_scans')
            .select('id')
            .eq('referral_code', referralCode)
            .eq('converted', true)
            .order('converted_at', { ascending: false })
            .limit(1)
            .single();

          if (scan) {
            await supabase.functions.invoke('send-qr-scan-notification', {
              body: {
                salesAgentId: agent.id,
                scanId: scan.id,
                notificationType: 'conversion'
              }
            });
          }
        }
      } catch (notifError) {
        console.error('Error sending conversion notification:', notifError);
        // Don't fail the conversion if notification fails
      }
    }

    return data === true;
  } catch (error) {
    console.error('Error marking QR scan as converted:', error);
    return false;
  }
};
