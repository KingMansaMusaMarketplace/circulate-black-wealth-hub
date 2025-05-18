
import { useState, useEffect, useCallback } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { useCapacitor } from '@/hooks/use-capacitor';
import { LocationData, UseLocationOptions } from './types';
import { checkLocationPermission, requestLocationPermission } from './permissions';
import { getCachedLocation, isCacheValid, cacheLocation, DEFAULT_CACHE_DURATION } from './cache';
import { getFallbackLocation } from './fallback';

/**
 * Hook for handling location functionality with native iOS/Android optimizations
 */
export function useLocation(options: UseLocationOptions = {}) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isNative, platform } = useCapacitor();
  
  // Merge default options with passed options
  const {
    cacheDuration = DEFAULT_CACHE_DURATION,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    skipPermissionCheck = false
  } = options;

  // Get the current position using Capacitor's Geolocation API
  const getCurrentPosition = useCallback(async (forceRefresh = false): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we can use cached location
      if (!forceRefresh) {
        const cachedLoc = getCachedLocation();
        if (isCacheValid(cachedLoc, cacheDuration)) {
          setLocation(cachedLoc);
          setLoading(false);
          return cachedLoc;
        }
      }
      
      // Check for location permission if needed
      if (!skipPermissionCheck) {
        const permissionStatus = await checkLocationPermission();
        
        if (permissionStatus !== 'granted') {
          const granted = await requestLocationPermission();
          if (!granted) {
            throw new Error('Location permission denied');
          }
        }
      }
      
      // Get current position using Capacitor
      const geoOptions = {
        enableHighAccuracy,
        timeout,
        maximumAge
      };
      
      const position: Position = await Geolocation.getCurrentPosition(geoOptions);
      
      if (!position || !position.coords) {
        throw new Error('Failed to get position data');
      }
      
      const locationData: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now()
      };
      
      // Update state and cache the result
      setLocation(locationData);
      cacheLocation(locationData);
      return locationData;
    } catch (err: any) {
      console.error('Error getting location:', err);
      
      // Different error handling for iOS vs Android
      if (isNative) {
        if (platform === 'ios') {
          const iosError = err.message?.includes('denied') 
            ? 'Please enable location access in your iOS Settings app for Mansa Musa Marketplace'
            : 'Unable to determine your location';
          setError(iosError);
        } else {
          setError('Location error: ' + (err.message || 'Unknown error'));
        }
      } else {
        setError('Unable to access your location. Please check your browser settings.');
      }
      
      // Try fallback location
      const fallbackLoc = await getFallbackLocation();
      if (fallbackLoc) {
        setLocation(fallbackLoc);
        return fallbackLoc;
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [cacheDuration, enableHighAccuracy, timeout, maximumAge, skipPermissionCheck, isNative, platform]);

  // Get location on mount if autoGetLocation is true
  useEffect(() => {
    // Always check for cached location first
    const cachedLocation = getCachedLocation();
    if (isCacheValid(cachedLocation, cacheDuration)) {
      setLocation(cachedLocation);
    }
  }, [cacheDuration]);

  return {
    location,
    loading,
    error,
    getCurrentPosition,
  };
}
