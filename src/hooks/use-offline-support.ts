import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Safe native platform check without importing Capacitor
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

// --- Typed queued actions ---
interface FavoriteAction {
  type: 'business_favorite';
  userId: string;
  businessId: string;
  isFavorite: boolean;
}

interface ProfileUpdateAction {
  type: 'profile_update';
  userId: string;
  data: Record<string, unknown>;
}

interface ReviewSubmitAction {
  type: 'review_submit';
  userId: string;
  businessId: string;
  rating: number;
  comment?: string;
}

type QueuedAction = (FavoriteAction | ProfileUpdateAction | ReviewSubmitAction) & {
  timestamp: number;
};

// Cache TTL: 24 hours for native, 1 hour for web
const getCacheTTL = () => isNativePlatform() ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<QueuedAction[]>(() => {
    try {
      const stored = localStorage.getItem('offline_queue');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist queue to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('offline_queue', JSON.stringify(offlineQueue));
    } catch (error) {
      console.error('Error persisting offline queue:', error);
    }
  }, [offlineQueue]);

  const processOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return;

    const queue = [...offlineQueue];
    const failed: QueuedAction[] = [];

    for (const action of queue) {
      try {
        await processQueuedAction(action);
      } catch (error) {
        console.error('Error processing queued action:', error);
        failed.push(action);
      }
    }

    setOfflineQueue(failed);

    if (failed.length === 0 && queue.length > 0) {
      toast.success('All offline actions synced successfully!');
    } else if (failed.length > 0) {
      toast.warning(`${queue.length - failed.length} synced, ${failed.length} failed. Will retry.`);
    }
  }, [offlineQueue]);

  useEffect(() => {
    if (isNativePlatform()) {
      initializeNetworkStatus();
    } else {
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
  }, [processOfflineQueue]);

  const initializeNetworkStatus = async () => {
    try {
      const { Network } = await import('@capacitor/network');
      const status = await Network.getStatus();
      setIsOnline(status.connected);

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

  const queueAction = (action: Omit<QueuedAction, 'timestamp'>) => {
    if (!isOnline) {
      setOfflineQueue(prev => [...prev, { ...action, timestamp: Date.now() } as QueuedAction]);
      toast.info('Action queued for when you\'re back online');
      return true;
    }
    return false;
  };

  const processQueuedAction = async (action: QueuedAction) => {
    switch (action.type) {
      case 'business_favorite': {
        if (action.isFavorite) {
          const { error } = await supabase
            .from('favorites')
            .upsert({ user_id: action.userId, business_id: action.businessId }, { onConflict: 'user_id,business_id' });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', action.userId)
            .eq('business_id', action.businessId);
          if (error) throw error;
        }
        break;
      }
      case 'profile_update': {
        const { error } = await supabase
          .from('profiles')
          .update(action.data)
          .eq('id', action.userId);
        if (error) throw error;
        break;
      }
      case 'review_submit': {
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_id: action.userId,
            business_id: action.businessId,
            rating: action.rating,
            comment: action.comment || '',
          });
        if (error) throw error;
        break;
      }
      default:
        console.log('Unknown action type:', (action as any).type);
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
        if (Date.now() - parsed.timestamp < getCacheTTL()) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.error('Error retrieving cached data:', error);
    }
    return null;
  };

  const cacheProfileData = (profile: Record<string, unknown>) => {
    try {
      localStorage.setItem('cached_profile', JSON.stringify({
        data: profile,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching profile data:', error);
    }
  };

  const getCachedProfileData = () => {
    try {
      const cached = localStorage.getItem('cached_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < getCacheTTL()) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.error('Error retrieving cached profile:', error);
    }
    return null;
  };

  const cacheFavorites = (favorites: any[]) => {
    try {
      localStorage.setItem('cached_favorites', JSON.stringify({
        data: favorites,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching favorites:', error);
    }
  };

  const getCachedFavorites = () => {
    try {
      const cached = localStorage.getItem('cached_favorites');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < getCacheTTL()) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.error('Error retrieving cached favorites:', error);
    }
    return null;
  };

  return {
    isOnline,
    offlineQueue: offlineQueue.length,
    queueAction,
    processOfflineQueue,
    cacheBusinessData,
    getCachedBusinessData,
    cacheProfileData,
    getCachedProfileData,
    cacheFavorites,
    getCachedFavorites,
  };
};
