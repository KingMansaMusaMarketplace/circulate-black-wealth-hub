
import React from 'react';
import { Bell, BellDot, Check, Trash2, RefreshCw } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLoyaltyNotifications, LoyaltyNotification } from '@/hooks/use-loyalty-notifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const NotificationsPopover = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead,
    refreshNotifications 
  } = useLoyaltyNotifications();
  
  const [open, setOpen] = React.useState(false);
  
  const handleNotificationClick = (notification: LoyaltyNotification) => {
    markAsRead(notification.id);
    // If there's any special action for clicking a notification, 
    // it would go here (e.g., navigation)
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  const getNotificationIcon = (type: LoyaltyNotification['type']) => {
    switch (type) {
      case 'reward':
        return <div className="w-2 h-2 bg-yellow-400 rounded-full" />;
      case 'milestone':
        return <div className="w-2 h-2 bg-green-400 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-blue-400 rounded-full" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          onClick={() => setOpen(true)}
        >
          {unreadCount > 0 ? <BellDot className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium text-sm">Notifications</h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleMarkAllAsRead}
                title="Mark all as read"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={refreshNotifications}
              title="Refresh notifications"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Separator />
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground opacity-50 mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                    !notification.isRead && "bg-muted/20"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="mt-1.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-medium", !notification.isRead && "font-semibold")}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    {notification.data?.businessName && (
                      <p className="text-xs text-muted-foreground">
                        {notification.data.businessName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
