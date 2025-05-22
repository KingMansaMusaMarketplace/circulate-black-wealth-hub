
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLoyaltyRewards } from '@/hooks/loyalty-qr-code/use-loyalty-rewards';

const NotificationsPopover = () => {
  // This is just a demo component with mock notifications
  const notifications = [
    {
      id: 1,
      title: "100 Points Earned",
      description: "You earned 100 points at Coffee Shop",
      time: "2 hours ago",
      isUnread: true
    },
    {
      id: 2,
      title: "New Reward Available",
      description: "Free Smoothie reward is now available",
      time: "Yesterday",
      isUnread: true
    },
    {
      id: 3,
      title: "Points Updated",
      description: "Your points total has been updated",
      time: "3 days ago",
      isUnread: false
    }
  ];
  
  const unreadCount = notifications.filter(n => n.isUnread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Notifications</h4>
          <Button variant="ghost" className="text-xs h-auto p-0">Mark all as read</Button>
        </div>
        <Separator className="my-2" />
        {notifications.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-2 rounded-md ${notification.isUnread ? 'bg-muted' : ''}`}
              >
                <div className="flex justify-between">
                  <h5 className="text-sm font-medium">{notification.title}</h5>
                  {notification.isUnread && (
                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-muted-foreground">No notifications</p>
        )}
        <Separator className="my-2" />
        <Button variant="outline" className="w-full text-xs" size="sm">
          View all notifications
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
