
import { Geolocation } from '@capacitor/geolocation';
import { LocationPermissionStatus } from './types';

// Check permission status
export const checkPermission = async (isCapacitor: boolean, skipPermissionCheck: boolean = false): Promise<boolean> => {
  if (skipPermissionCheck) return true;
  
  try {
    if (isCapacitor) {
      const permission = await Geolocation.checkPermissions();
      const status = permission.location;
      storePermissionStatus(status === 'granted' ? 'granted' : 'denied');
      return status === 'granted';
    } else {
      // For browser
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        storePermissionStatus(result.state as LocationPermissionStatus);
        return result.state === 'granted';
      }
      // If Permissions API is not supported, we'll try directly
      return true;
    }
  } catch (err) {
    console.error('Error checking location permission:', err);
    return false;
  }
};

// Request permission
export const requestPermission = async (isCapacitor: boolean): Promise<boolean> => {
  try {
    if (isCapacitor) {
      const permission = await Geolocation.requestPermissions();
      const status = permission.location;
      storePermissionStatus(status === 'granted' ? 'granted' : 'denied');
      return status === 'granted';
    } else {
      // For browser, we'll try to get the current position which prompts permission
      return true;
    }
  } catch (err) {
    storePermissionStatus('denied');
    return false;
  }
};

// Store permission status in localStorage
export const storePermissionStatus = (status: LocationPermissionStatus): void => {
  localStorage.setItem('locationPermission', status);
};

// Get stored permission status
export const getStoredPermissionStatus = (): LocationPermissionStatus => {
  return localStorage.getItem('locationPermission') as LocationPermissionStatus || 'prompt';
};
