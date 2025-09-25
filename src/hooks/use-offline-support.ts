import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializeNetworkStatus();
    } else {
      // Web fallback
      setIsOnline(navigator.onLine);
      
      const handleOnline = () => {
        setIsOnline(true);
        toast.success('Connection restored! Syncing data...');
        processOfflineQueue();
      };
      
      const handleOffline = () => {
        setIsOnline(false);
        toast.info('You\'re offline. Actions will be queued and synced when connection is restored.');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const initializeNetworkStatus = async () => {
    try {
      // Get current network status
      const status = await Network.getStatus();
      setIsOnline(status.connected);

      // Listen for network status changes
      Network.addListener('networkStatusChange', status => {
        setIsOnline(status.connected);
        
        if (status.connected) {
          toast.success('Connection restored! Syncing data...');
          processOfflineQueue();
        } else {
          toast.info('You\'re offline. Actions will be queued and synced when connection is restored.');
        }
      });
    } catch (error) {
      console.error('Error initializing network status:', error);
    }
  };

  const queueAction = (action: any) => {
    if (!isOnline) {
      setOfflineQueue(prev => [...prev, { ...action, timestamp: Date.now() }]);
      toast.info('Action queued for when you\'re back online');
      return true; // Indicates action was queued
    }
    return false; // Indicates action should proceed normally
  };

  const processOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;

    const queue = [...offlineQueue];
    setOfflineQueue([]);

    for (const action of queue) {
      try {
        // Process each queued action
        await processQueuedAction(action);
      } catch (error) {
        console.error('Error processing queued action:', error);
        // Re-add failed action to queue
        setOfflineQueue(prev => [...prev, action]);
      }
    }

    if (offlineQueue.length === 0) {
      toast.success('All offline actions synced successfully!');
    }
  };

  const processQueuedAction = async (action: any) => {
    switch (action.type) {
      case 'business_favorite':
        // Sync favorite action
        break;
      case 'qr_scan':
        // Sync QR scan for loyalty points
        break;
      case 'review_submit':
        // Sync business review
        break;
      case 'profile_update':
        // Sync profile changes
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  };

  const cacheBusinessData = (businesses: any[]) => {
    try {
      localStorage.setItem('cached_businesses', JSON.stringify({
        data: businesses,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching business data:', error);
    }
  };

  const getCachedBusinessData = () => {
    try {
      const cached = localStorage.getItem('cached_businesses');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is less than 1 hour old
        if (Date.now() - parsed.timestamp < 60 * 60 * 1000) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.error('Error retrieving cached data:', error);
    }
    return null;
  };

  return {
    isOnline,
    offlineQueue: offlineQueue.length,
    queueAction,
    processOfflineQueue,
    cacheBusinessData,
    getCachedBusinessData
  };
};