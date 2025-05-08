
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface LoyaltyNotification {
  id: string;
  title: string;
  message: string;
  type: 'reward' | 'milestone' | 'info';
  isRead: boolean;
  createdAt: string;
  data?: {
    rewardId?: string;
    points?: number;
    businessName?: string;
  };
}

export const useLoyaltyNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<LoyaltyNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get transactions to check for milestones
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          id,
          points_earned,
          transaction_date,
          businesses(business_name)
        `)
        .eq('customer_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(50);
        
      if (transactionsError) throw transactionsError;
      
      // Get redeemed rewards info
      const { data: redeemedRewards, error: rewardsError } = await supabase
        .from('redeemed_rewards')
        .select(`
          id,
          redemption_date,
          expiration_date,
          rewards(title, points_cost),
          businesses(business_name)
        `)
        .eq('customer_id', user.id)
        .order('redemption_date', { ascending: false });
        
      if (rewardsError) throw rewardsError;
      
      // Check for expiring rewards (within 7 days)
      const now = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(now.getDate() + 7);
      
      // Generate notifications
      const generatedNotifications: LoyaltyNotification[] = [];
      
      // Add notification for each expiring reward
      redeemedRewards.forEach((reward) => {
        if (!reward.expiration_date) return;
        
        const expirationDate = new Date(reward.expiration_date);
        
        if (expirationDate > now && expirationDate < oneWeekFromNow) {
          // Reward is expiring soon
          const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          generatedNotifications.push({
            id: `expiring-reward-${reward.id}`,
            title: 'Reward Expiring Soon',
            message: `Your "${reward.rewards?.title}" will expire in ${daysUntilExpiration} day${daysUntilExpiration !== 1 ? 's' : ''}. Don't forget to use it!`,
            type: 'reward',
            isRead: false,
            createdAt: now.toISOString(),
            data: {
              rewardId: reward.id,
              businessName: reward.businesses?.business_name
            }
          });
        }
      });
      
      // Check for point milestones
      let totalPoints = 0;
      transactions.forEach((transaction) => {
        totalPoints += transaction.points_earned || 0;
        
        // Check for milestone points in individual transactions
        if (transaction.points_earned >= 50) {
          generatedNotifications.push({
            id: `milestone-${transaction.id}`,
            title: 'Points Milestone',
            message: `Congratulations! You earned ${transaction.points_earned} points at ${transaction.businesses?.business_name || 'a business'}`,
            type: 'milestone',
            isRead: false,
            createdAt: transaction.transaction_date,
            data: {
              points: transaction.points_earned,
              businessName: transaction.businesses?.business_name
            }
          });
        }
      });
      
      // Add overall milestone notifications
      const milestones = [100, 250, 500, 1000, 2500, 5000];
      milestones.forEach(milestone => {
        if (totalPoints >= milestone) {
          generatedNotifications.push({
            id: `total-milestone-${milestone}`,
            title: 'Total Points Milestone',
            message: `Amazing! You've reached ${milestone} total loyalty points. Keep supporting local businesses!`,
            type: 'milestone',
            isRead: false,
            createdAt: now.toISOString(),
            data: {
              points: milestone
            }
          });
        }
      });
      
      // Sort notifications by date
      generatedNotifications.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Update state
      setNotifications(generatedNotifications);
      setUnreadCount(generatedNotifications.filter(n => !n.isRead).length);
      
    } catch (error: any) {
      console.error('Error fetching loyalty notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    // Reset unread count
    setUnreadCount(0);
  };
  
  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);
  
  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};
