
import { LocationData } from './types';

// Default cache duration is 5 minutes (300000ms)
export const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;
export const LOCATION_CACHE_KEY = 'mmm_location_cache';

// Cache the user's location
export const cacheLocation = (location: LocationData) => {
  if (!location) return;
  try {
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location));
  } catch (error) {
    console.error('Error caching location:', error);
  }
};

// Get cached location
export const getCachedLocation = (): LocationData | null => {
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached) as LocationData;
  } catch (error) {
    console.error('Error reading cached location:', error);
    return null;
  }
};

// Clear location cache
export const clearLocationCache = (): void => {
  try {
    localStorage.removeItem(LOCATION_CACHE_KEY);
  } catch (error) {
    console.error('Error clearing location cache:', error);
  }
};

// Check if cached location is still valid
export const isCacheValid = (
  location: LocationData | null, 
  cacheDuration: number = DEFAULT_CACHE_DURATION
): boolean => {
  if (!location || !location.timestamp) return false;
  
  const now = Date.now();
  const expirationTime = location.timestamp + cacheDuration;
  
  return now < expirationTime;
};
