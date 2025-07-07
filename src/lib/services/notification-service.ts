
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface NotificationData {
  id: string;
  notification_type: string;
  subtype?: string;
  source: 'stripe' | 'apple' | 'apple_sandbox';
  processed_at: string;
  user_affected?: string;
}

export const notificationService = {
  // Subscribe to real-time subscription notifications
  subscribeToNotifications(userId: string, onNotification: (notification: NotificationData) => void) {
    const channel = supabase
      .channel('subscription-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'subscription_notifications'
        },
        (payload) => {
          console.log('Subscription notification received:', payload);
          onNotification(payload.new as NotificationData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Handle different types of notifications
  handleNotification(notification: NotificationData) {
    switch (notification.notification_type) {
      case 'SUBSCRIBED':
        toast.success('Subscription activated successfully!');
        break;
      case 'DID_RENEW':
        toast.success('Subscription renewed successfully!');
        break;
      case 'EXPIRED':
        toast.warning('Your subscription has expired.');
        break;
      case 'DID_CHANGE_RENEWAL_STATUS':
        toast.info('Subscription renewal settings updated.');
        break;
      case 'REFUND':
        toast.info('A refund has been processed for your subscription.');
        break;
      default:
        console.log('Unknown notification type:', notification.notification_type);
    }
  }
};
