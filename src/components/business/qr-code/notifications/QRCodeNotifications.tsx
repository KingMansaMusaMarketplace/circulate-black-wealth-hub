
import React, { useEffect } from 'react';
import {
  Bell,
  XCircle,
  Calendar,
  QrCode,
  AlertTriangle,
  Info,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useQRCodeNotifications } from '@/hooks/use-qr-code-notifications';
import { useBusinessProfile } from '@/hooks/use-business-profile';

export const QRCodeNotifications: React.FC = () => {
  const { profile } = useBusinessProfile();
  const { 
    notifications, 
    loadNotifications, 
    extendQRCodeExpiration,
    increaseQRCodeScanLimit,
    markNotificationAsSeen 
  } = useQRCodeNotifications(profile?.id);
  
  const [open, setOpen] = React.useState(false);
  const [actionDialogOpen, setActionDialogOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<any>(null);
  const [actionType, setActionType] = React.useState<'extend' | 'increase' | null>(null);
  
  useEffect(() => {
    if (profile?.id) {
      loadNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);
  
  const unseenCount = notifications.filter(n => !n.seen).length;
  
  const handleNotificationClick = (notification: any) => {
    markNotificationAsSeen(notification.id);
    
    if (notification.id.startsWith('expiration_') || notification.id.startsWith('expired_')) {
      setSelectedNotification(notification);
      setActionType('extend');
      setActionDialogOpen(true);
    } else if (notification.id.startsWith('scan_limit_')) {
      setSelectedNotification(notification);
      setActionType('increase');
      setActionDialogOpen(true);
    }
  };
  
  const handleAction = async () => {
    if (!selectedNotification || !actionType) return;
    
    if (actionType === 'extend') {
      // Extract QR code ID from notification ID
      const qrCodeId = selectedNotification.qrCodeId;
      await extendQRCodeExpiration(qrCodeId, 30); // Extend by 30 days
    } else if (actionType === 'increase') {
      // Extract QR code ID from notification ID
      const qrCodeId = selectedNotification.qrCodeId;
      await increaseQRCodeScanLimit(qrCodeId, 50); // Add 50 more scans
    }
    
    setActionDialogOpen(false);
    setOpen(false);
    loadNotifications();
  };
  
  const getNotificationIcon = (notification: any) => {
    if (notification.id.startsWith('expiration_') || notification.id.startsWith('expired_')) {
      return <Calendar className="h-4 w-4" />;
    } else if (notification.id.startsWith('scan_limit_')) {
      return <QrCode className="h-4 w-4" />;
    } else if (notification.id.startsWith('inactive_')) {
      return <Info className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
  };
  
  const getActionDialogContent = () => {
    if (!selectedNotification || !actionType) return null;
    
    if (actionType === 'extend') {
      return {
        title: 'Extend QR Code Expiration',
        description: 'Would you like to extend this QR code\'s expiration date by 30 days?',
        action: 'Extend Expiration'
      };
    } else if (actionType === 'increase') {
      return {
        title: 'Increase QR Code Scan Limit',
        description: 'Would you like to increase this QR code\'s scan limit by 50 scans?',
        action: 'Increase Limit'
      };
    }
    
    return null;
  };
  
  const actionDialogContent = getActionDialogContent();
  
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unseenCount > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1.5 h-5 min-w-5 flex items-center justify-center">
                {unseenCount > 9 ? '9+' : unseenCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">QR Code Notifications</h3>
            <Button variant="ghost" size="sm" onClick={() => loadNotifications()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center p-4 text-sm text-gray-500">
                No notifications at this time
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${!notification.seen ? 'bg-blue-50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={`p-2 rounded-full mr-3 ${
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                      notification.type === 'error' ? 'bg-red-100 text-red-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{notification.message}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {actionDialogContent && (
        <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{actionDialogContent.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {actionDialogContent.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleAction}>
                {actionDialogContent.action}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default QRCodeNotifications;
