import { useState, useEffect } from 'react';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

export const usePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializePushNotifications();
    }
  }, []);

  const initializePushNotifications = async () => {
    try {
      // Request permission for push notifications
      let permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
      
      if (permStatus.receive !== 'granted') {
        throw new Error('Push notification permission denied');
      }

      // Register for push notifications
      await PushNotifications.register();

      // Listen for registration success
      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        setToken(token.value);
        setIsRegistered(true);
        // Here you would typically send the token to your backend
      });

      // Listen for registration error
      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
        toast.error('Failed to register for push notifications');
      });

      // Listen for push notifications received
      PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('Push notification received: ', notification);
        
        // Show local notification if app is in foreground
        if (notification.title && notification.body) {
          showLocalNotification(notification.title, notification.body);
        }
      });

      // Listen for notification actions
      PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
        
        // Handle notification tap - could navigate to specific screen
        if (notification.notification.data?.route) {
          // Navigate to specific route
          window.location.href = notification.notification.data.route;
        }
      });

    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  };

  const showLocalNotification = async (title: string, body: string, data?: any) => {
    try {
      // Request permission for local notifications
      let permStatus = await LocalNotifications.checkPermissions();
      
      if (permStatus.display === 'prompt') {
        permStatus = await LocalNotifications.requestPermissions();
      }
      
      if (permStatus.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: Date.now(),
              schedule: { at: new Date(Date.now() + 1000) },
              sound: 'beep.wav',
              attachments: undefined,
              actionTypeId: '',
              extra: data
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error showing local notification:', error);
    }
  };

  const sendWelcomeNotification = () => {
    showLocalNotification(
      'Welcome to Mansa Musa Marketplace!',
      'Discover Black-owned businesses and start earning rewards.'
    );
  };

  const sendLoyaltyNotification = (points: number) => {
    showLocalNotification(
      'Loyalty Points Earned!',
      `You've earned ${points} loyalty points. Keep supporting Black-owned businesses!`
    );
  };

  const sendNewBusinessNotification = (businessName: string) => {
    showLocalNotification(
      'New Business Added!',
      `${businessName} just joined the marketplace. Check them out!`,
      { route: '/directory' }
    );
  };

  return {
    token,
    isRegistered,
    showLocalNotification,
    sendWelcomeNotification,
    sendLoyaltyNotification,
    sendNewBusinessNotification
  };
};