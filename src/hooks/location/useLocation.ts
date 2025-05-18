
import { useState, useEffect, useCallback } from 'react';
import { useCapacitor } from '@/hooks/use-capacitor';
import { 
  LocationData, 
  UseLocationOptions, 
  LocationPermissionStatus,
  DEFAULT_CACHE_DURATION,
  getCachedLocation,
  clearLocationCache,
  getStoredPermissionStatus,
  storePermissionStatus,
  checkPermission,
  requestPermission,
  getDistanceFromPoint,
  getNearbyPoints,
  getCurrentPosition as getPosition
} from './index';

export function useLocation(options: UseLocationOptions = {}) {
  const {
    cacheDuration = DEFAULT_CACHE_DURATION,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    skipPermissionCheck = false
  } = options;

  const { isCapacitor, isNative } = useCapacitor();
  const [location, setLocation] = useState<LocationData | null>(getCachedLocation());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>(
    getStoredPermissionStatus()
  );

  // Get current position
  const getCurrentPosition = useCallback(async (force: boolean = false): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);
    
    const result = await getPosition(
      isCapacitor, 
      { 
        cacheDuration, 
        enableHighAccuracy, 
        timeout, 
        maximumAge, 
        skipPermissionCheck 
      },
      force
    );
    
    if (result.location) {
      setLocation(result.location);
    } else if (result.error) {
      setError(result.error);
    }
    
    setLoading(false);
    return result.location;
  }, [isCapacitor, cacheDuration, enableHighAccuracy, timeout, maximumAge, skipPermissionCheck]);

  // Request permission wrapper
  const requestLocationPermission = useCallback(async () => {
    try {
      const result = await requestPermission(isCapacitor);
      setPermissionStatus(result ? 'granted' : 'denied');
      return result;
    } catch (err) {
      console.error('Error requesting permission:', err);
      setPermissionStatus('denied');
      return false;
    }
  }, [isCapacitor]);

  // Clear cache wrapper
  const clearCache = useCallback(() => {
    clearLocationCache();
    setLocation(null);
  }, []);

  return {
    location,
    loading,
    error,
    permissionStatus,
    getCurrentPosition,
    getDistanceFromPoint: useCallback((pointLat: number, pointLng: number) => 
      getDistanceFromPoint(location, pointLat, pointLng), [location]),
    getNearbyPoints: useCallback(<T extends { lat: number; lng: number }>(
      points: T[],
      maxDistance?: number
    ) => getNearbyPoints(location, points, maxDistance), [location]),
    clearCache,
    requestPermission: requestLocationPermission,
    isUsingFallback: location?.accuracy && location.accuracy > 1000
  };
}

export default useLocation;
