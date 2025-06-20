
import { useState, useCallback } from 'react';

export interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPosition = useCallback(async (forceRefresh = false): Promise<LocationData | null> => {
    if (location && !forceRefresh) {
      return location;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const newLocation: LocationData = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      setLocation(newLocation);
      return newLocation;
    } catch (err: any) {
      const errorMessage = err.code === 1 ? 'Location access denied' : 'Unable to get location';
      setError(errorMessage);
      console.error('Location error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [location]);

  return {
    location,
    getCurrentPosition,
    loading,
    error
  };
}
