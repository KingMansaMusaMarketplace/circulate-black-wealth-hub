
import { useState, useEffect } from 'react';
import { useLoyalty } from './use-loyalty';

export const useLoyaltyNotifications = () => {
  const { summary, redeemedRewards, loyaltyPoints } = useLoyalty();
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'points' | 'reward' | 'milestone';
    message: string;
    read: boolean;
    createdAt: string;
  }>>([]);

  useEffect(() => {
    // Mock notifications based on loyalty data
    const mockNotifications = [
      {
        id: '1',
        type: 'points' as const,
        message: `You earned 25 points at Test Business!`,
        read: false,
        createdAt: new Date().toISOString()
      }
    ];

    setNotifications(mockNotifications);
  }, [summary, redeemedRewards, loyaltyPoints]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    markAllAsRead
  };
};
