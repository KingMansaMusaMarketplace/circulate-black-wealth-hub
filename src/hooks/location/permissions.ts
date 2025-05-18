
import { Geolocation } from '@capacitor/geolocation';
import { useCapacitor } from '@/hooks/use-capacitor';
import { toast } from 'sonner';
import { LocationPermissionStatus } from './types';

/**
 * Check current location permission status
 */
export async function checkLocationPermission(): Promise<LocationPermissionStatus> {
  try {
    // On native platforms, we can use Capacitor's permissions API
    if (window?.Capacitor?.isNativePlatform()) {
      const permission = await Geolocation.checkPermissions();
      
      if (permission.location === 'granted') {
        return 'granted';
      } else if (permission.location === 'denied') {
        return 'denied';
      }
      return 'prompt';
    }
    
    // For web, we use the Permissions API if available
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state as LocationPermissionStatus;
      } catch (error) {
        console.error('Error checking geolocation permission:', error);
        return 'prompt'; // Default to prompt if we can't check
      }
    }
    
    return 'prompt'; // Default status if we can't determine
  } catch (error) {
    console.error('Error checking location permission:', error);
    return 'prompt';
  }
}

/**
 * Request location permission 
 * Returns true if permission was granted, false otherwise
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const currentStatus = await checkLocationPermission();
    
    // If permission is already granted, return true
    if (currentStatus === 'granted') {
      return true;
    }
    
    // If permission is denied and we're on native, show a toast with instructions
    if (currentStatus === 'denied' && window?.Capacitor?.isNativePlatform()) {
      const platform = window.Capacitor.getPlatform();
      
      if (platform === 'ios') {
        toast.error('Location access denied', {
          description: 'Please enable location access in your iOS Settings app for Mansa Musa Marketplace',
          duration: 5000,
        });
      } else {
        toast.error('Location access denied', {
          description: 'Please enable location permissions in your device settings',
          duration: 5000,
        });
      }
      
      return false;
    }
    
    // Try to request permission
    await Geolocation.requestPermissions({ permissions: ['location'] });
    
    // Check if permission was granted
    const newStatus = await checkLocationPermission();
    return newStatus === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
}

/**
 * Hook for iOS-friendly permission handling
 */
export function useLocationPermissions() {
  const { isNative, platform } = useCapacitor();
  
  const openAppSettings = async () => {
    if (!isNative) return false;
    
    try {
      // This would ideally use a capacitor plugin to open settings
      // For now we show instructions in a toast
      if (platform === 'ios') {
        toast.info('How to enable location access', {
          description: 'Go to iOS Settings > Privacy > Location Services > Mansa Musa Marketplace',
          duration: 8000,
        });
      } else {
        toast.info('How to enable location access', {
          description: 'Go to Settings > Apps > Mansa Musa Marketplace > Permissions > Location',
          duration: 8000,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error opening app settings:', error);
      return false;
    }
  };
  
  return {
    checkPermission: checkLocationPermission,
    requestPermission: requestLocationPermission,
    openAppSettings,
  };
}
