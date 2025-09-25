import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useOfflineSupport } from '@/hooks/use-offline-support';
import { toast } from 'sonner';

interface NativeFeaturesProps {
  children: React.ReactNode;
}

export const NativeFeatures: React.FC<NativeFeaturesProps> = ({ children }) => {
  const { sendWelcomeNotification } = usePushNotifications();
  const { isOnline, offlineQueue } = useOfflineSupport();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeNativeFeatures();
    }
  }, []);

  const initializeNativeFeatures = async () => {
    try {
      // Configure status bar
      await StatusBar.setStyle({ style: 'Dark' as any });
      await StatusBar.setBackgroundColor({ color: '#1B365D' });

      // Listen for app state changes
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
        
        if (isActive) {
          // App came to foreground
          console.log('App resumed');
        } else {
          // App went to background
          console.log('App backgrounded');
        }
      });

      // Listen for back button on Android
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          // Show exit confirmation
          App.exitApp();
        } else {
          // Navigate back
          window.history.back();
        }
      });

      // Listen for deep links
      App.addListener('appUrlOpen', (event) => {
        console.log('App opened via URL:', event.url);
        
        // Handle deep links
        const url = new URL(event.url);
        if (url.pathname === '/business') {
          const businessId = url.searchParams.get('id');
          if (businessId) {
            window.location.href = `/business/${businessId}`;
          }
        }
      });

      // Send welcome notification for new users
      const hasShownWelcome = localStorage.getItem('welcome_notification_shown');
      if (!hasShownWelcome) {
        setTimeout(() => {
          sendWelcomeNotification();
          localStorage.setItem('welcome_notification_shown', 'true');
        }, 3000); // Show after 3 seconds
      }

    } catch (error) {
      console.error('Error initializing native features:', error);
    }
  };

  return (
    <>
      {children}
      
      {/* Native Status Indicators */}
      {Capacitor.isNativePlatform() && (
        <div className="fixed top-0 right-0 p-2 z-50">
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