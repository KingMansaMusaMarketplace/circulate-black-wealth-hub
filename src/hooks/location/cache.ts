
import { LocationData } from './types';

// Cache duration in milliseconds (default: 5 minutes)
export const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

// Check if cached location is still valid
export const isCacheValid = (cachedLocation: LocationData | null, cacheDuration: number): boolean => {
  if (!cachedLocation) return false;
  return Date.now() - cachedLocation.timestamp < cacheDuration;
};

// Get cached location from localStorage
export const getCachedLocation = (): LocationData | null => {
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
export const cacheLocation = (location: LocationData): void => {
  try {
    localStorage.setItem('userLocation', JSON.stringify(location));
  } catch (error) {
    console.error('Error caching location:', error);
  }
};

// Clear cached location
export const clearLocationCache = (): void => {
  localStorage.removeItem('userLocation');
};
