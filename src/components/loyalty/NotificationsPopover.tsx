
import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoyaltyNotifications } from '@/hooks/use-loyalty-notifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const NotificationsPopover: React.FC = () => {
  const { notifications, markAllAsRead, removeNotification, hasUnread } = useLoyaltyNotifications();
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute top-1 right-1 block w-2 h-2 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Notifications</h2>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={!hasUnread}
              className="h-8 px-2"
              title="Mark all as read"
            >
              <Check className="h-4 w-4 mr-1" />
              <span className="text-xs">Mark all read</span>
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="py-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 hover:bg-slate-50 ${notification.isRead ? '' : 'bg-blue-50/30'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{notification.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex justify-between items-center">
                    <Badge 
                      variant={notification.type === 'reward' ? 'default' : 'secondary'} 
                      className="text-[10px] h-5"
                    >
                      {notification.type === 'reward' ? 'Reward' : 'Points'}
                    </Badge>
                    <span className="text-[10px] text-gray-400">
                      {new Date(notification.date).toLocaleString()}
                    </span>
                  </div>
                  {notification !== notifications[notifications.length - 1] && <Separator className="mt-2" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4">
              No notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
