import { useEffect, useState } from 'react';

// Safe native platform check without importing Capacitor at top level
const isNativePlatform = () => {
  try {
    return typeof window !== 'undefined' && 
           window.Capacitor && 
           typeof window.Capacitor.isNativePlatform === 'function' && 
           window.Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

export const useAppLifecycle = () => {
  const [appState, setAppState] = useState<'active' | 'background' | 'inactive'>('active');
  const [backgroundTime, setBackgroundTime] = useState<number>(0);
  const isNative = isNativePlatform();

  useEffect(() => {
    if (!isNative) return;

    let backgroundStartTime: number | null = null;
    let stateListener: any;
    let urlListener: any;
    let backListener: any;

    const setupListeners = async () => {
      try {
        const { App } = await import('@capacitor/app');
        
        stateListener = await App.addListener('appStateChange', (state) => {
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
      } catch (error) {
        console.error('Error setting up app lifecycle listeners:', error);
      }
    };

    setupListeners();

    return () => {
      if (stateListener) stateListener.remove();
      if (urlListener) urlListener.remove();
      if (backListener) backListener.remove();
    };
  }, [isNative]);

  const handleAppResume = async () => {
    // Trigger data refresh
    window.dispatchEvent(new CustomEvent('app-resumed'));
    
    // Clear any notifications that are no longer relevant
    if (isNative) {
      try {
        const { LocalNotifications } = await import('@capacitor/local-notifications');
        LocalNotifications.removeAllDeliveredNotifications();
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
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
        sessionStorage.setItem('referral_code', refCode || '');
        window.location.href = '/signup';
      } else {
        window.location.href = path || '/';
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  };

  const handleBackButton = async (canGoBack: boolean) => {
    if (canGoBack) {
      window.history.back();
    } else {
      // On home page, show exit confirmation
      if (confirm('Exit Mansa Musa Marketplace?')) {
        try {
          const { App } = await import('@capacitor/app');
          App.exitApp();
        } catch (error) {
          console.error('Error exiting app:', error);
        }
      }
    }
  };

  const showWelcomeBackNotification = async () => {
    if (!isNative) return;

    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      
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

  const exitApp = async () => {
    if (isNative) {
      try {
        const { App } = await import('@capacitor/app');
        App.exitApp();
      } catch (error) {
        console.error('Error exiting app:', error);
      }
    }
  };

  const minimizeApp = async () => {
    if (isNative) {
      try {
        const { App } = await import('@capacitor/app');
        App.minimizeApp();
      } catch (error) {
        console.error('Error minimizing app:', error);
      }
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
