import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';

interface RealtimeNotification {
  id: string;
  type: 'points_milestone' | 'reward_expiry' | 'new_business' | 'special_offer' | 'qr_scan';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

interface ActivityEvent {
  id: string;
  user_id: string;
  business_id: string;
  event_type: 'qr_scan' | 'review' | 'reward_redemption';
  points_earned?: number;
  created_at: string;
  business?: {
    business_name: string;
    logo_url?: string;
  };
}

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendPointsMilestoneEmail, sendNewBusinessEmail } = useEmailNotifications();
  
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Show browser notification
  const showBrowserNotification = (title: string, body: string, icon?: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: 'mansa-musa-notification'
      });
    }
  };

  // Show toast notification
  const showToastNotification = (notification: RealtimeNotification) => {
    toast({
      title: notification.title,
      description: notification.message,
      duration: 5000,
    });
  };

  // Handle new QR scan with milestone checking
  const handleQRScanEvent = async (scanData: any) => {
    console.log('New QR scan detected:', scanData);
    
    // Add to activity feed
    setActivityFeed(prev => [scanData, ...prev.slice(0, 49)]); // Keep last 50 items
    
    // Check for points milestones
    if (scanData.customer_id === user?.id && scanData.points_awarded) {
      // Get user's total points after this scan
      const { data: transactions } = await supabase
        .from('transactions')
        .select('points_earned')
        .eq('customer_id', user.id);
      
      const totalPoints = transactions?.reduce((sum, t) => sum + t.points_earned, 0) || 0;
      
      // Check milestone thresholds (100, 500, 1000, 2500, 5000, 10000)
      const milestones = [100, 500, 1000, 2500, 5000, 10000];
      const currentMilestone = milestones.find(m => 
        totalPoints >= m && (totalPoints - scanData.points_awarded) < m
      );
      
      if (currentMilestone) {
        const milestoneNotification: RealtimeNotification = {
          id: `milestone-${Date.now()}`,
          type: 'points_milestone',
          title: '🏆 Milestone Reached!',
          message: `Congratulations! You've reached ${currentMilestone} points!`,
          data: { points: currentMilestone },
          read: false,
          created_at: new Date().toISOString()
        };
        
        setNotifications(prev => [milestoneNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        showToastNotification(milestoneNotification);
        showBrowserNotification(milestoneNotification.title, milestoneNotification.message);
        
        // Send milestone email
        if (user?.email) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
            
          await sendPointsMilestoneEmail(
            user.id,
            user.email,
            profile?.full_name || 'User',
            currentMilestone
          );
        }
      }
    }
    
    // Regular scan notification
    const scanNotification: RealtimeNotification = {
      id: `scan-${Date.now()}`,
      type: 'qr_scan',
      title: 'QR Code Scanned! 📱',
      message: `You earned ${scanData.points_awarded || 0} points at ${scanData.business?.business_name || 'a business'}`,
      data: scanData,
      read: false,
      created_at: new Date().toISOString()
    };
    
    if (scanData.customer_id === user?.id) {
      setNotifications(prev => [scanNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      showToastNotification(scanNotification);
      showBrowserNotification(scanNotification.title, scanNotification.message);
    }
  };

  // Handle new business notifications
  const handleNewBusinessEvent = async (businessData: any) => {
    console.log('New business detected:', businessData);
    
    if (user?.id && user?.email) {
      const newBusinessNotification: RealtimeNotification = {
        id: `business-${Date.now()}`,
        type: 'new_business',
        title: '🏪 New Business Alert!',
        message: `${businessData.business_name} just joined your community!`,
        data: businessData,
        read: false,
        created_at: new Date().toISOString()
      };
      
      setNotifications(prev => [newBusinessNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      showToastNotification(newBusinessNotification);
      showBrowserNotification(newBusinessNotification.title, newBusinessNotification.message);
      
      // Send new business email
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
        
      await sendNewBusinessEmail(
        user.id,
        user.email,
        profile?.full_name || 'User',
        businessData.business_name
      );
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up realtime subscriptions for user:', user.id);

    // Subscribe to QR scans
    const qrScansChannel = supabase
      .channel('qr-scans-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'qr_scans'
        },
        (payload) => {
          console.log('QR scan realtime event:', payload);
          handleQRScanEvent(payload.new);
        }
      )
      .subscribe();

    // Subscribe to new businesses
    const businessesChannel = supabase
      .channel('businesses-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'businesses'
        },
        (payload) => {
          console.log('New business realtime event:', payload);
          handleNewBusinessEvent(payload.new);
        }
      )
      .subscribe();

    // Subscribe to transactions for rewards
    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `customer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Transaction realtime event:', payload);
          // Handle transaction-related notifications here
        }
      )
      .subscribe();

    // Request notification permission on mount
    requestNotificationPermission();

    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(qrScansChannel);
      supabase.removeChannel(businessesChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, [user?.id]);

  // Load initial notifications and activity
  useEffect(() => {
    if (!user?.id) return;

    const loadInitialData = async () => {
      try {
        // Load recent activity feed
        const { data: recentScans } = await supabase
          .from('qr_scans')
          .select(`
            id,
            customer_id,
            business_id,
            points_awarded,
            created_at,
            businesses (
              business_name,
              logo_url
            )
          `)
          .order('created_at', { ascending: false })
          .limit(20);

        if (recentScans) {
          const formattedActivity = recentScans.map(scan => ({
            id: scan.id,
            user_id: scan.customer_id,
            business_id: scan.business_id,
            event_type: 'qr_scan' as const,
            points_earned: scan.points_awarded,
            created_at: scan.created_at,
            business: {
              business_name: (scan.businesses as any)?.business_name || 'Unknown Business',
              logo_url: (scan.businesses as any)?.logo_url
            }
          }));
          setActivityFeed(formattedActivity);
        }
      } catch (error) {
        console.error('Error loading initial realtime data:', error);
      }
    };

    loadInitialData();
  }, [user?.id]);

  return {
    notifications,
    activityFeed,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    requestNotificationPermission,
    showBrowserNotification
  };
};