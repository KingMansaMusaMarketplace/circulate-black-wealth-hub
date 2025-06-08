
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const QRCodeNotifications: React.FC = () => {
  return (
    <Button variant="outline" size="sm">
      <Bell className="h-4 w-4 mr-2" />
      Notifications
    </Button>
  );
};

export default QRCodeNotifications;
