
import { useState, useCallback } from 'react';

interface LocationData {
  lat: number;
  lng: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPosition = useCallback(async (forceRefresh: boolean = false) => {
    if (!forceRefresh && location) {
      return location;
    }

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setLocation(newLocation);
      setError(null);
      return newLocation;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get location';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [location]);

  const requestPermission = useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state === 'granted';
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  }, []);

  const clearCache = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    error,
    getCurrentPosition,
    requestPermission,
    clearCache
  };
};
