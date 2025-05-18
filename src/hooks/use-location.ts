
import { useState, useEffect, useCallback } from 'react';
import { Geolocation, GeolocationPosition, PositionOptions } from '@capacitor/geolocation';
import { toast } from 'sonner';
import { useCapacitor } from './use-capacitor';
import { calculateDistance } from '@/components/MapView/utils';

// Cache duration in milliseconds (default: 5 minutes)
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

// Type for our location data
export interface LocationData {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy?: number;
}

// Options for the useLocation hook
export interface UseLocationOptions {
  cacheDuration?: number; // Cache duration in milliseconds
  enableHighAccuracy?: boolean;
  timeout?: number; // Timeout in milliseconds
  maximumAge?: number; // Maximum age of cached position
  skipPermissionCheck?: boolean; // Skip permission check (useful for subsequent calls)
}

// Function to get a fallback location using IP (mock implementation)
const getFallbackLocation = async (): Promise<LocationData | null> => {
  try {
    // In a real implementation, you would call an IP geolocation API here
    // For example: const response = await fetch('https://ipapi.co/json/');
    // For now, return a mock location (central US)
    return {
      lat: 39.8283,
      lng: -98.5795,
      timestamp: Date.now(),
      accuracy: 5000 // Very low accuracy for IP-based location
    };
  } catch (error) {
    console.error('Error getting fallback location:', error);
    return null;
  }
};

// Check if cached location is still valid
const isCacheValid = (cachedLocation: LocationData | null, cacheDuration: number): boolean => {
  if (!cachedLocation) return false;
  return Date.now() - cachedLocation.timestamp < cacheDuration;
};

// Get cached location from localStorage
const getCachedLocation = (): LocationData | null => {
  try {
    const cached = localStorage.getItem('userLocation');
    if (!cached) return null;
    return JSON.parse(cached) as LocationData;
  } catch (error) {
    console.error('Error parsing cached location:', error);
    return null;
  }
};

// Save location to localStorage
const cacheLocation = (location: LocationData): void => {
  try {
    localStorage.setItem('userLocation', JSON.stringify(location));
  } catch (error) {
    console.error('Error caching location:', error);
  }
};

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
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>(
    localStorage.getItem('locationPermission') as 'granted' | 'denied' | 'prompt' || 'prompt'
  );

  // Check permission status
  const checkPermission = useCallback(async () => {
    if (skipPermissionCheck) return true;
    
    try {
      if (isCapacitor) {
        const permission = await Geolocation.checkPermissions();
        const status = permission.location;
        setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
        localStorage.setItem('locationPermission', status === 'granted' ? 'granted' : 'denied');
        return status === 'granted';
      } else {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
          localStorage.setItem('locationPermission', result.state as string);
          return result.state === 'granted';
        }
        // If Permissions API is not supported, we'll try directly
        return true;
      }
    } catch (err) {
      console.error('Error checking location permission:', err);
      return false;
    }
  }, [isCapacitor, skipPermissionCheck]);

  // Request permission
  const requestPermission = useCallback(async () => {
    try {
      if (isCapacitor) {
        const permission = await Geolocation.requestPermissions();
        const status = permission.location;
        setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
        localStorage.setItem('locationPermission', status === 'granted' ? 'granted' : 'denied');
        return status === 'granted';
      } else {
        // For browser, we'll try to get the current position which prompts permission
        return true;
      }
    } catch (err) {
      setPermissionStatus('denied');
      localStorage.setItem('locationPermission', 'denied');
      return false;
    }
  }, [isCapacitor]);

  // Get current position
  const getCurrentPosition = useCallback(async (force: boolean = false): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we have a valid cached location
      const cachedLocation = getCachedLocation();
      if (!force && isCacheValid(cachedLocation, cacheDuration)) {
        setLocation(cachedLocation);
        setLoading(false);
        return cachedLocation;
      }
      
      // Check permission first
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        const permissionGranted = await requestPermission();
        if (!permissionGranted) {
          setError('Location permission denied');
          setLoading(false);
          
          // Try fallback
          toast.info("Using approximate location", {
            description: "We couldn't access your precise location. Using an approximate location instead."
          });
          
          const fallbackLocation = await getFallbackLocation();
          if (fallbackLocation) {
            setLocation(fallbackLocation);
            cacheLocation(fallbackLocation);
            return fallbackLocation;
          }
          return null;
        }
      }
      
      // Get the current position
      const positionOptions: PositionOptions = {
        enableHighAccuracy,
        timeout,
        maximumAge
      };

      let position: GeolocationPosition;
      
      if (isCapacitor) {
        position = await Geolocation.getCurrentPosition(positionOptions);
      } else {
        // Use browser's Geolocation API
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, positionOptions);
        });
      }
      
      const newLocation: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp || Date.now()
      };
      
      setLocation(newLocation);
      cacheLocation(newLocation);
      setLoading(false);
      return newLocation;
    } catch (err: any) {
      console.error('Error getting location:', err);
      
      // Prepare a user-friendly error message
      let errorMessage = 'Unable to get your location';
      if (err.code === 1) {
        errorMessage = 'Location permission denied';
      } else if (err.code === 2) {
        errorMessage = 'Location unavailable';
      } else if (err.code === 3) {
        errorMessage = 'Location request timed out';
      }
      
      setError(errorMessage);
      
      // Try fallback if main location method fails
      try {
        toast.info("Using approximate location", {
          description: "We couldn't access your precise location. Using an approximate location instead."
        });
        
        const fallbackLocation = await getFallbackLocation();
        if (fallbackLocation) {
          setLocation(fallbackLocation);
          cacheLocation(fallbackLocation);
          setLoading(false);
          return fallbackLocation;
        }
      } catch (fallbackErr) {
        console.error('Fallback location also failed:', fallbackErr);
      }
      
      setLoading(false);
      return null;
    }
  }, [cacheDuration, enableHighAccuracy, timeout, maximumAge, isCapacitor, checkPermission, requestPermission]);

  // Calculate distance between user location and a point
  const getDistanceFromPoint = useCallback((pointLat: number, pointLng: number): number | null => {
    if (!location) return null;
    return calculateDistance(location.lat, location.lng, pointLat, pointLng);
  }, [location]);

  // Get nearby points from an array
  const getNearbyPoints = useCallback(<T extends { lat: number; lng: number }>(
    points: T[],
    maxDistance?: number
  ): Array<T & { distance: number }> => {
    if (!location) return [];
    
    return points
      .map(point => {
        const distance = calculateDistance(
          location.lat, 
          location.lng, 
          point.lat, 
          point.lng
        );
        return { ...point, distance };
      })
      .filter(point => maxDistance === undefined || point.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }, [location]);

  // Clear cached location
  const clearCache = useCallback(() => {
    localStorage.removeItem('userLocation');
    setLocation(null);
  }, []);

  return {
    location,
    loading,
    error,
    permissionStatus,
    getCurrentPosition,
    getDistanceFromPoint,
    getNearbyPoints,
    clearCache,
    requestPermission,
    isUsingFallback: location?.accuracy && location.accuracy > 1000
  };
}
