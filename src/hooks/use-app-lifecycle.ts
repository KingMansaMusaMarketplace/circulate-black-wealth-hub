import { useEffect, useState } from 'react';
import { App, AppState } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export const useAppLifecycle = () => {
  const [appState, setAppState] = useState<'active' | 'background' | 'inactive'>('active');
  const [backgroundTime, setBackgroundTime] = useState<number>(0);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative) return;

    let backgroundStartTime: number | null = null;
    let stateListener: any;
    let urlListener: any;
    let backListener: any;

    const setupListeners = async () => {
      stateListener = await App.addListener('appStateChange', (state: AppState) => {
        const isActive = state.isActive;
        
        if (isActive) {
          // App came to foreground
          setAppState('active');
          
          if (backgroundStartTime) {
            const timeInBackground = Date.now() - backgroundStartTime;
            setBackgroundTime(timeInBackground);
            
            // If app was in background for more than 5 minutes, show welcome back message
            if (timeInBackground > 5 * 60 * 1000) {
              showWelcomeBackNotification();
            }
            
            backgroundStartTime = null;
          }

          // Refresh data that might have changed
          handleAppResume();
        } else {
          // App went to background
          setAppState('background');
          backgroundStartTime = Date.now();
          
          // Save current state
          handleAppBackground();
        }
      });

      // Handle app URL opens (deep links)
      urlListener = await App.addListener('appUrlOpen', (event) => {
        handleDeepLink(event.url);
      });

      // Handle back button (Android)
      backListener = await App.addListener('backButton', ({ canGoBack }) => {
        handleBackButton(canGoBack);
      });
    };

    setupListeners();

    return () => {
      if (stateListener) stateListener.remove();
      if (urlListener) urlListener.remove();
      if (backListener) backListener.remove();
    };
  }, [isNative]);

  const handleAppResume = () => {
    // Trigger data refresh
    window.dispatchEvent(new CustomEvent('app-resumed'));
    
    // Clear any notifications that are no longer relevant
    if (isNative) {
      LocalNotifications.removeAllDeliveredNotifications();
    }
  };

  const handleAppBackground = () => {
    // Save current scroll position
    const scrollY = window.scrollY;
    sessionStorage.setItem('scroll_position', scrollY.toString());
    
    // Save current page
    sessionStorage.setItem('last_page', window.location.pathname);
    
    // Trigger any background sync operations
    window.dispatchEvent(new CustomEvent('app-backgrounded'));
  };

  const handleDeepLink = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname;
      const params = parsedUrl.searchParams;

      // Navigate to the appropriate route
      if (path.includes('/business/')) {
        const businessId = path.split('/business/')[1];
        window.location.href = `/business/${businessId}`;
      } else if (params.get('ref')) {
        // Referral code
        const refCode = params.get('ref');
        sessionStorage.setItem('referral_code', refCode);
        window.location.href = '/signup';
      } else {
        window.location.href = path || '/';
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  };

  const handleBackButton = (canGoBack: boolean) => {
    if (canGoBack) {
      window.history.back();
    } else {
      // On home page, show exit confirmation
      if (confirm('Exit Mansa Musa Marketplace?')) {
        App.exitApp();
      }
    }
  };

  const showWelcomeBackNotification = async () => {
    if (!isNative) return;

    try {
      let permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display === 'prompt') {
        permStatus = await LocalNotifications.requestPermissions();
      }

      if (permStatus.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [{
            title: 'Welcome Back! 👋',
            body: 'Discover new Black-owned businesses and check your rewards.',
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) }
          }]
        });
      }
    } catch (error) {
      console.error('Error showing welcome back notification:', error);
    }
  };

  const exitApp = () => {
    if (isNative) {
      App.exitApp();
    }
  };

  const minimizeApp = () => {
    if (isNative) {
      App.minimizeApp();
    }
  };

  return {
    appState,
    backgroundTime,
    exitApp,
    minimizeApp,
    isNative
  };
};
