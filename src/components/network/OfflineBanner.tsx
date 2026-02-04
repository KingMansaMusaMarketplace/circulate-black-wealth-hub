/**
 * Offline Banner Component
 * Shows a persistent banner when the user loses internet connection
 * Automatically hides when connection is restored
 */

import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { cn } from '@/lib/utils';

interface OfflineBannerProps {
  className?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ className }) => {
  const { isOnline, wasOffline, pendingActionCount } = useNetworkStatus({
    showToasts: false, // We're showing the banner instead
  });

  // Show reconnected message briefly after coming back online
  const [showReconnected, setShowReconnected] = React.useState(false);
  
  React.useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const handleRetry = () => {
    window.location.reload();
  };

  // Show reconnected banner
  if (showReconnected) {
    return (
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] bg-primary text-primary-foreground px-4 py-2",
          "animate-in slide-in-from-top duration-300",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
          <Wifi className="h-4 w-4" />
          <span>Back online!</span>
          {pendingActionCount > 0 && (
            <span className="opacity-80">
              Syncing {pendingActionCount} pending action{pendingActionCount > 1 ? 's' : ''}...
            </span>
          )}
        </div>
      </div>
    );
  }

  // Don't render if online
  if (isOnline) return null;

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground px-4 py-3",
        "animate-in slide-in-from-top duration-300",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 flex-shrink-0" />
          <div>
            <span className="font-medium text-sm">You're offline</span>
            <span className="hidden sm:inline text-sm opacity-90 ml-2">
              Check your internet connection
            </span>
          </div>
        </div>
        
        <Button 
          onClick={handleRetry}
          size="sm"
          variant="secondary"
          className="bg-background/20 hover:bg-background/30 text-destructive-foreground border-0 flex-shrink-0"
        >
          <RefreshCw className="h-3 w-3 mr-1.5" />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default OfflineBanner;
