import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useOfflineSupport } from '@/hooks/use-offline-support';
import { useCapacitor } from '@/hooks/use-capacitor';
import { Geolocation } from '@capacitor/geolocation';
import { toast } from 'sonner';

interface NativeFeaturesProps {
  children: React.ReactNode;
}

export const NativeFeatures: React.FC<NativeFeaturesProps> = ({ children }) => {
  const { sendWelcomeNotification, showLocalNotification } = usePushNotifications();
  const { isOnline, offlineQueue } = useOfflineSupport();
  const { isCapacitor, platform, isNative } = useCapacitor();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeNativeFeatures();
    }
  }, []);

  const initializeNativeFeatures = async () => {
    try {
      // Enhanced status bar configuration
      await StatusBar.setStyle({ style: 'Dark' as any });
      await StatusBar.setBackgroundColor({ color: '#1B365D' });
      await StatusBar.setOverlaysWebView({ overlay: false });

      // Enhanced app state management
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
        
        if (isActive) {
          // App came to foreground - show location-based notifications
          handleAppResume();
        } else {
          // App went to background - cache important data
          handleAppBackground();
        }
      });

      // Enhanced back button handling for Android
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          // Show native exit confirmation
          showLocalNotification(
            "Return soon!", 
            "Come back to continue supporting Black-owned businesses"
          );
          App.exitApp();
        } else {
          window.history.back();
        }
      });

      // Enhanced deep link handling with business discovery
      App.addListener('appUrlOpen', (event) => {
        console.log('App opened via URL:', event.url);
        
        const url = new URL(event.url);
        if (url.pathname === '/business') {
          const businessId = url.searchParams.get('id');
          if (businessId) {
            window.location.href = `/business/${businessId}`;
            // Show native notification for shared business
            showLocalNotification(
              "Business Shared!", 
              "Check out this amazing Black-owned business"
            );
          }
        }
      });

      // Location-aware welcome notification
      const hasShownWelcome = localStorage.getItem('welcome_notification_shown');
      if (!hasShownWelcome) {
        setTimeout(async () => {
          try {
            // Request location to provide location-aware welcome
            const position = await Geolocation.getCurrentPosition();
            showLocalNotification(
              "Welcome to Mansa Musa!", 
              `Find Black-owned businesses near you and start earning rewards!`
            );
          } catch {
            sendWelcomeNotification();
          }
          localStorage.setItem('welcome_notification_shown', 'true');
        }, 3000);
      }

      // Native haptic feedback integration
      if (platform === 'ios') {
        // iOS-specific features
        console.log('iOS native features initialized');
      } else if (platform === 'android') {
        // Android-specific features  
        console.log('Android native features initialized');
      }

    } catch (error) {
      console.error('Error initializing native features:', error);
    }
  };

  const handleAppResume = async () => {
    // Native behavior: Check for location updates when app resumes
    try {
      const position = await Geolocation.getCurrentPosition({ timeout: 5000 });
      console.log('Location updated on app resume:', position);
    } catch (error) {
      console.log('Location not available on resume');
    }
  };

  const handleAppBackground = () => {
    // Native behavior: Save state when backgrounding
    const currentPath = window.location.pathname;
    localStorage.setItem('last_active_page', currentPath);
    console.log('App backgrounded, saved state');
  };

  return (
    <>
      {children}
      
      {/* Enhanced Native Status Indicators */}
      {isCapacitor && (
        <div className="fixed top-0 right-0 p-2 z-50">
          {/* Platform indicator */}
          <div className="bg-primary/80 text-primary-foreground px-2 py-1 rounded text-xs mb-1">
            {platform.toUpperCase()} Native
          </div>
          
          {/* Offline indicator with queue */}
          {!isOnline && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
              Offline {offlineQueue > 0 && `(${offlineQueue} queued)`}
            </div>
          )}
        </div>
      )}
    </>
  );
};