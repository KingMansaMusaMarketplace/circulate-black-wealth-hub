import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminNotificationPreferences {
  id: string;
  admin_user_id: string;
  business_verification_enabled: boolean;
  agent_milestone_enabled: boolean;
  milestone_referrals_enabled: boolean;
  milestone_earnings_enabled: boolean;
  milestone_conversion_enabled: boolean;
  min_referral_milestone: number;
  min_earnings_milestone: number;
  min_conversion_milestone: number;
  send_immediate: boolean;
  send_daily_digest: boolean;
  send_weekly_digest: boolean;
  digest_time: string;
  notification_email: string;
  send_to_multiple_emails: string[] | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get admin notification preferences (creates default if not exists)
 */
export const getAdminNotificationPreferences = async (): Promise<AdminNotificationPreferences | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    // Use RPC to get or create preferences
    const { data, error } = await supabase.rpc('get_admin_notification_preferences', {
      p_admin_id: user.id
    });

    if (error) throw error;

    return data as AdminNotificationPreferences;
  } catch (error: any) {
    console.error('Error fetching admin notification preferences:', error);
    toast.error('Failed to load notification preferences');
    return null;
  }
};

/**
 * Update admin notification preferences
 */
export const updateAdminNotificationPreferences = async (
  updates: Partial<Omit<AdminNotificationPreferences, 'id' | 'admin_user_id' | 'created_at' | 'updated_at'>>
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    const { error } = await supabase
      .from('admin_notification_preferences')
      .update(updates)
      .eq('admin_user_id', user.id);

    if (error) throw error;

    toast.success('Notification preferences updated successfully');
    return true;
  } catch (error: any) {
    console.error('Error updating admin notification preferences:', error);
    toast.error('Failed to update notification preferences: ' + error.message);
    return false;
  }
};

/**
 * Check if a notification should be sent based on preferences
 */
export const shouldSendNotification = async (
  notificationType: 'business_verification' | 'agent_milestone',
  milestoneData?: {
    type: string;
    value: number;
  }
): Promise<{ shouldSend: boolean; preferences: AdminNotificationPreferences | null }> => {
  try {
    const preferences = await getAdminNotificationPreferences();
    
    if (!preferences) {
      // If no preferences found, allow all notifications (default behavior)
      return { shouldSend: true, preferences: null };
    }

    // Check if immediate notifications are enabled
    if (!preferences.send_immediate) {
      return { shouldSend: false, preferences };
    }

    // Check business verification notifications
    if (notificationType === 'business_verification') {
      return { 
        shouldSend: preferences.business_verification_enabled,
        preferences 
      };
    }

    // Check agent milestone notifications
    if (notificationType === 'agent_milestone' && milestoneData) {
      if (!preferences.agent_milestone_enabled) {
        return { shouldSend: false, preferences };
      }

      const { type, value } = milestoneData;

      // Check referral milestones
      if (type.startsWith('referrals_')) {
        if (!preferences.milestone_referrals_enabled) {
          return { shouldSend: false, preferences };
        }
        if (value < preferences.min_referral_milestone) {
          return { shouldSend: false, preferences };
        }
      }

      // Check earnings milestones
      if (type.startsWith('earnings_')) {
        if (!preferences.milestone_earnings_enabled) {
          return { shouldSend: false, preferences };
        }
        if (value < preferences.min_earnings_milestone) {
          return { shouldSend: false, preferences };
        }
      }

      // Check conversion milestones
      if (type.startsWith('conversion_')) {
        if (!preferences.milestone_conversion_enabled) {
          return { shouldSend: false, preferences };
        }
        if (value < preferences.min_conversion_milestone) {
          return { shouldSend: false, preferences };
        }
      }
    }

    return { shouldSend: true, preferences };
  } catch (error) {
    console.error('Error checking notification preferences:', error);
    // On error, allow notification (fail open)
    return { shouldSend: true, preferences: null };
  }
};

/**
 * Get notification recipients based on preferences
 */
export const getNotificationRecipients = async (): Promise<string[]> => {
  try {
    const preferences = await getAdminNotificationPreferences();
    
    if (!preferences) {
      // Fallback to ADMIN_EMAIL environment variable
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      return adminEmail ? [adminEmail] : [];
    }

    const recipients: string[] = [preferences.notification_email];
    
    // Add additional emails if configured
    if (preferences.send_to_multiple_emails && preferences.send_to_multiple_emails.length > 0) {
      recipients.push(...preferences.send_to_multiple_emails);
    }

    return recipients.filter(email => email && email.trim() !== '');
  } catch (error) {
    console.error('Error getting notification recipients:', error);
    return [];
  }
};
