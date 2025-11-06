import React from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Award, 
  Flame, 
  TrendingUp, 
  Users, 
  Bell 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface NotificationsListProps {
  onClose: () => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead, isLoading, unreadCount } = useNotifications();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <Sparkles className="h-4 w-4 text-primary" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-orange-500" />;
      case 'streak':
        return <Flame className="h-4 w-4 text-orange-500" />;
      case 'investment':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'circle':
        return <Users className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground text-center">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllAsRead()}
            className="text-xs"
          >
            Mark all read
          </Button>
        )}
      </div>

      <Separator />

      {notifications.length === 0 ? (
        <div className="p-8 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm text-muted-foreground">No notifications yet</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  'p-3 rounded-lg mb-2 cursor-pointer transition-colors',
                  notification.read
                    ? 'hover:bg-muted/50'
                    : 'bg-primary/5 hover:bg-primary/10'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
