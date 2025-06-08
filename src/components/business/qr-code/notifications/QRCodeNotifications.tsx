
import React from 'react';
import { Bell, QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export const QRCodeNotifications: React.FC = () => {
  const notifications = [
    {
      id: '1',
      type: 'scan',
      message: 'New QR code scan - 5 points awarded',
      time: '2 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'limit',
      message: 'Discount QR code reached scan limit',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'expiry',
      message: 'QR code expires in 24 hours',
      time: '3 hours ago',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">QR Code Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} new</Badge>
            )}
          </div>
          
          <div className="space-y-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <QrCode className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <QrCode className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="pt-2 border-t">
              <Button variant="ghost" size="sm" className="w-full">
                Mark all as read
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
