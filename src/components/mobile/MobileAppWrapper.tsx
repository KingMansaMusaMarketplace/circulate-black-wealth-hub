
import React from 'react';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Wifi } from 'lucide-react';

interface MobileAppWrapperProps {
  children: React.ReactNode;
}

const MobileAppWrapper: React.FC<MobileAppWrapperProps> = ({ children }) => {
  const { isMobile, isCapacitor, isIOS } = useDeviceDetection();

  // Show iOS optimization notice for web users
  const showIOSNotice = isIOS && !isCapacitor;

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {showIOSNotice && (
        <Alert className="mx-4 mt-2 border-mansagold bg-mansagold/10">
          <Smartphone className="h-4 w-4" />
          <AlertDescription className="text-sm">
            For the best experience, add this app to your home screen! Tap the share button and select "Add to Home Screen".
          </AlertDescription>
        </Alert>
      )}
      
      {!navigator.onLine && (
        <Alert className="mx-4 mt-2 border-red-500 bg-red-50">
          <Wifi className="h-4 w-4" />
          <AlertDescription className="text-sm">
            You're offline. Some features may not work properly.
          </AlertDescription>
        </Alert>
      )}
      
      <div className={`w-full ${isMobile ? 'mobile-optimized' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default MobileAppWrapper;
