
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLoyalty } from '@/hooks/use-loyalty';

export interface LoyaltyNotification {
  id: string;
  title: string;
  message: string;
  type: 'reward' | 'milestone';
  date: string;
  isRead: boolean;
}

export const useLoyaltyNotifications = () => {
  const [notifications, setNotifications] = useState<LoyaltyNotification[]>([]);
  const { user } = useAuth();
  const { summary, availableRewards, redeemedRewards } = useLoyalty();
  const [hasUnread, setHasUnread] = useState(false);
  
  // Check for milestone notifications
  useEffect(() => {
    if (!user || !summary) return;
    
    const checkMilestones = () => {
      const milestones = [100, 250, 500, 1000];
      
      // Find the current milestone the user has reached
      const currentMilestone = milestones.filter(m => summary.totalPoints >= m).pop();
      
      if (currentMilestone) {
        // Check storage to see if we've already notified for this milestone
        const notifiedMilestones = JSON.parse(localStorage.getItem(`${user.id}_notified_milestones`) || '[]');
        
        if (!notifiedMilestones.includes(currentMilestone)) {
          // Create a new notification
          const newNotification: LoyaltyNotification = {
            id: `milestone_${Date.now()}`,
            title: 'Points Milestone Reached!',
            message: `Congratulations! You've reached ${currentMilestone} points.`,
            type: 'milestone',
            date: new Date().toISOString(),
            isRead: false,
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // Update storage
          notifiedMilestones.push(currentMilestone);
          localStorage.setItem(`${user.id}_notified_milestones`, JSON.stringify(notifiedMilestones));
        }
      }
    };
    
    // Check for expiring rewards
    const checkExpiringRewards = () => {
      // Check redeemed rewards for ones that are about to expire (within 3 days)
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      
      redeemedRewards.forEach(reward => {
        if (reward.expiration_date && reward.expiration_date < threeDaysFromNow && !reward.is_used) {
          // Check storage to see if we've already notified for this reward
          const notifiedRewards = JSON.parse(localStorage.getItem(`${user.id}_notified_rewards`) || '[]');
          
          if (!notifiedRewards.includes(reward.id)) {
            // Create a new notification
            const newNotification: LoyaltyNotification = {
              id: `reward_${reward.id}`,
              title: 'Reward Expiring Soon',
              message: `Your reward "${reward.rewards?.title}" is expiring soon. Don't forget to use it!`,
              type: 'reward',
              date: new Date().toISOString(),
              isRead: false,
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            
            // Update storage
            notifiedRewards.push(reward.id);
            localStorage.setItem(`${user.id}_notified_rewards`, JSON.stringify(notifiedRewards));
          }
        }
      });
    };
    
    // Initial check
    checkMilestones();
    checkExpiringRewards();
    
    // Load existing notifications from localStorage
    const loadFromStorage = () => {
      const storedNotifications = localStorage.getItem(`${user.id}_notifications`);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    };
    loadFromStorage();
    
  }, [user, summary, redeemedRewards]);
  
  // Update hasUnread state whenever notifications change
  useEffect(() => {
    setHasUnread(notifications.some(notification => !notification.isRead));
    
    // Save notifications to localStorage when they change
    if (user) {
      localStorage.setItem(`${user.id}_notifications`, JSON.stringify(notifications));
    }
  }, [notifications, user]);
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };
  
  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  return {
    notifications,
    hasUnread,
    markAsRead,
    markAllAsRead,
    removeNotification
  };
};
