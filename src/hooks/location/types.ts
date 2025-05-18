
// Location data interface
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

// For storing permission status
export type LocationPermissionStatus = 'granted' | 'denied' | 'prompt';
