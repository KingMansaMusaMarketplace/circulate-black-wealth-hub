import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, UserPlus, Building2, DollarSign, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'user' | 'business' | 'fraud' | 'payment' | 'security';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('admin-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'business_verifications' }, () => {
        addNotification('business', 'New Verification Request', 'A business has submitted verification documents');
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'fraud_alerts' }, () => {
        addNotification('fraud', 'Fraud Alert', 'New suspicious activity detected');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    // Fetch recent activity to generate notifications
    const { data: recentUsers } = await supabase
      .from('profiles')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: recentBusinesses } = await supabase
      .from('businesses')
      .select('id, business_name, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    const mockNotifications: Notification[] = [];

    recentUsers?.forEach((user, idx) => {
      mockNotifications.push({
        id: `user-${user.id}`,
        type: 'user',
        title: 'New User Registered',
        message: 'A new user has joined the platform',
        timestamp: new Date(user.created_at),
        read: idx > 0,
      });
    });

    recentBusinesses?.forEach((business, idx) => {
      mockNotifications.push({
        id: `business-${business.id}`,
        type: 'business',
        title: 'New Business',
        message: `${business.business_name} has been registered`,
        timestamp: new Date(business.created_at!),
        read: idx > 0,
      });
    });

    setNotifications(mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10));
  };

  const addNotification = (type: Notification['type'], title: string, message: string) => {
    const newNotification: Notification = {
      id: `${type}-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 20));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'user': return <UserPlus className="h-4 w-4 text-blue-400" />;
      case 'business': return <Building2 className="h-4 w-4 text-green-400" />;
      case 'fraud': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-yellow-400" />;
      case 'security': return <Shield className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-blue-200 hover:text-white hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-slate-900 border-white/10" align="end">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-blue-200/60">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-blue-500/10' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-blue-200/70 truncate">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-blue-200/50 mt-1">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                  )}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
