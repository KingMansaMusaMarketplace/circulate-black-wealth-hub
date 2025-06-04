
import { useState, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { useCapacitor } from '@/hooks/use-capacitor';

export interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

export type LocationPermissionStatus = 'granted' | 'denied' | 'prompt';

export interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  skipPermissionCheck?: boolean;
}

const CACHE_KEY = 'cached_location';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useLocation(options: UseLocationOptions = {}) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>('prompt');
  const { isNative } = useCapacitor();

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    skipPermissionCheck = false
  } = options;

  const getCachedLocation = (): LocationData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error reading cached location:', error);
    }
    return null;
  };

  const cacheLocation = (locationData: LocationData) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(locationData));
    } catch (error) {
      console.error('Error caching location:', error);
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!isNative) {
        // For web, we'll try to get location directly
        return true;
      }

      const permission = await Geolocation.requestPermissions();
      const granted = permission.location === 'granted';
      setPermissionStatus(granted ? 'granted' : 'denied');
      return granted;
    } catch (error) {
      console.error('Error requesting permission:', error);
      setPermissionStatus('denied');
      return false;
    }
  }, [isNative]);

  const getCurrentPosition = useCallback(async (forceRefresh = false): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = getCachedLocation();
        if (cached) {
          setLocation(cached);
          setLoading(false);
          return cached;
        }
      }

      // Request permission if needed
      if (!skipPermissionCheck && isNative) {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
          throw new Error('Location permission denied');
        }
      }

      // Get current position
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy,
        timeout,
        maximumAge
      });

      const locationData: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now()
      };

      setLocation(locationData);
      cacheLocation(locationData);
      return locationData;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get location';
      setError(errorMessage);
      console.error('Location error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enableHighAccuracy, timeout, maximumAge, skipPermissionCheck, isNative, requestPermission]);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
      setLocation(null);
    } catch (error) {
      console.error('Error clearing location cache:', error);
    }
  }, []);

  return {
    location,
    loading,
    error,
    permissionStatus,
    getCurrentPosition,
    requestPermission,
    clearCache
  };
}
