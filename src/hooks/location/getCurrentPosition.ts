
import { Geolocation, GeolocationPosition, PositionOptions } from '@capacitor/geolocation';
import { toast } from 'sonner';
import { LocationData, UseLocationOptions } from './types';
import { cacheLocation, isCacheValid, getCachedLocation } from './cache';
import { checkLocationPermission, requestLocationPermission } from './permissions';
import { getFallbackLocation } from './fallback';

// Get current position
export const getCurrentPosition = async (
  isCapacitor: boolean,
  options: UseLocationOptions = {},
  force: boolean = false
): Promise<{
  location: LocationData | null;
  error: string | null;
}> => {
  const {
    cacheDuration,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    skipPermissionCheck = false
  } = options;
  
  try {
    // Check if we have a valid cached location
    const cachedLocation = getCachedLocation();
    if (!force && cacheDuration && isCacheValid(cachedLocation, cacheDuration)) {
      return { 
        location: cachedLocation,
        error: null
      };
    }
    
    // Check permission first
    const hasPermission = await checkLocationPermission();
    if (!skipPermissionCheck && !hasPermission) {
      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) {
        // Try fallback
        toast.info("Using approximate location", {
          description: "We couldn't access your precise location. Using an approximate location instead."
        });
        
        const fallbackLocation = await getFallbackLocation();
        if (fallbackLocation) {
          cacheLocation(fallbackLocation);
          return {
            location: fallbackLocation,
            error: null
          };
        }
        return {
          location: null,
          error: 'Location permission denied'
        };
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
    
    cacheLocation(newLocation);
    return {
      location: newLocation,
      error: null
    };
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
    
    // Try fallback if main location method fails
    try {
      toast.info("Using approximate location", {
        description: "We couldn't access your precise location. Using an approximate location instead."
      });
      
      const fallbackLocation = await getFallbackLocation();
      if (fallbackLocation) {
        cacheLocation(fallbackLocation);
        return {
          location: fallbackLocation,
          error: null
        };
      }
    } catch (fallbackErr) {
      console.error('Fallback location also failed:', fallbackErr);
    }
    
    return {
      location: null,
      error: errorMessage
    };
  }
};
