import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Safe native platform check without importing Capacitor at top level
const isNativePlatform = () => {
  try {
    return typeof window !== 'undefined' && 
           window.Capacitor && 
           typeof window.Capacitor.isNativePlatform === 'function' && 
           window.Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

interface NearbyBusiness {
  id: string;
  name: string;
  distance: number;
  category?: string;
  logoUrl?: string;
}

interface Position {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export const useBackgroundLocation = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastPosition, setLastPosition] = useState<Position | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);
  const isNative = isNativePlatform();

  useEffect(() => {
    if (isNative) {
      // Check if background location is enabled in user preferences
      const bgLocationEnabled = localStorage.getItem('background_location_enabled') === 'true';
      if (bgLocationEnabled) {
        startTracking();
      }
    }

    return () => {
      stopTracking();
    };
  }, []);

  const startTracking = async () => {
    if (!isNative || isTracking) return;

    try {
      const { Geolocation } = await import('@capacitor/geolocation');
      
      // Request background location permissions
      const permission = await Geolocation.requestPermissions({
        permissions: ['location', 'coarseLocation']
      });

      if (permission.location !== 'granted') {
        toast.error('Location permission required for nearby business alerts');
        return;
      }

      // Start watching position with background updates
      const id = await Geolocation.watchPosition(
        {
          enableHighAccuracy: false, // Save battery
          timeout: 30000,
          maximumAge: 300000 // 5 minutes cache
        },
        (position) => {
          if (position) {
            handlePositionUpdate(position);
          }
        }
      );

      setWatchId(id);
      setIsTracking(true);
      console.log('Background location tracking started');
    } catch (error) {
      console.error('Error starting background location:', error);
      toast.error('Failed to start location tracking');
    }
  };

  const stopTracking = async () => {
    if (watchId) {
      try {
        const { Geolocation } = await import('@capacitor/geolocation');
        await Geolocation.clearWatch({ id: watchId });
        setWatchId(null);
        setIsTracking(false);
        console.log('Background location tracking stopped');
      } catch (error) {
        console.error('Error stopping location tracking:', error);
      }
    }
  };

  const handlePositionUpdate = async (position: Position) => {
    setLastPosition(position);
    
    // Check for nearby businesses
    const nearbyBusinesses = await checkNearbyBusinesses(
      position.coords.latitude,
      position.coords.longitude
    );

    // Send notifications for new nearby businesses
    if (nearbyBusinesses.length > 0) {
      await notifyNearbyBusinesses(nearbyBusinesses);
    }

    // Note: Location history is NOT stored locally for privacy compliance (GDPR/CCPA)
    // If analytics are needed, implement server-side storage with proper encryption and user consent
  };

  const checkNearbyBusinesses = async (lat: number, lng: number): Promise<NearbyBusiness[]> => {
    // Get user's preferred notification radius (default 0.5 miles)
    const radiusMiles = parseFloat(localStorage.getItem('proximity_radius_miles') || '0.5');
    
    try {
      const { data, error } = await supabase.rpc('get_nearby_businesses', {
        user_lat: lat,
        user_lng: lng,
        radius_miles: radiusMiles
      });

      if (error) {
        console.error('Error fetching nearby businesses:', error);
        return [];
      }

      // Map to NearbyBusiness format
      return (data || []).map((b: any) => ({
        id: b.id,
        name: b.business_name,
        distance: b.distance_miles,
        category: b.category,
        logoUrl: b.logo_url
      }));
    } catch (error) {
      console.error('Error checking nearby businesses:', error);
      return [];
    }
  };

  const notifyNearbyBusinesses = async (businesses: NearbyBusiness[]) => {
    if (!isNative || businesses.length === 0) return;

    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      
      // Check if we've already notified about these businesses today
      const notifiedToday = JSON.parse(localStorage.getItem('notified_businesses_today') || '[]');
      const today = new Date().toDateString();
      
      const newBusinesses = businesses.filter(b => 
        !notifiedToday.some((n: any) => n.id === b.id && n.date === today)
      );

      if (newBusinesses.length === 0) return;

      // Request notification permissions
      let permStatus = await LocalNotifications.checkPermissions();
      if (permStatus.display === 'prompt') {
        permStatus = await LocalNotifications.requestPermissions();
      }

      if (permStatus.display === 'granted') {
        // Send notification for first nearby business
        const business = newBusinesses[0];
        const distanceText = business.distance < 0.1 
          ? 'just steps away' 
          : `${(business.distance).toFixed(1)} miles away`;
        
        await LocalNotifications.schedule({
          notifications: [{
            title: '🎯 Black-Owned Business Nearby!',
            body: `${business.name}${business.category ? ` (${business.category})` : ''} is ${distanceText}. Visit and earn rewards!`,
            id: Date.now(),
            schedule: { at: new Date(Date.now() + 1000) },
            sound: 'beep.wav',
            extra: {
              businessId: business.id,
              route: `/business/${business.id}`
            }
          }]
        });

        // Mark as notified
        notifiedToday.push({ id: business.id, date: today });
        localStorage.setItem('notified_businesses_today', JSON.stringify(notifiedToday));
      }
    } catch (error) {
      console.error('Error sending nearby business notification:', error);
    }
  };

  const enableBackgroundLocation = async () => {
    localStorage.setItem('background_location_enabled', 'true');
    await startTracking();
    toast.success('Background location enabled for nearby business alerts');
  };

  const disableBackgroundLocation = async () => {
    localStorage.setItem('background_location_enabled', 'false');
    await stopTracking();
    toast.info('Background location disabled');
  };

  return {
    isTracking,
    lastPosition,
    startTracking,
    stopTracking,
    enableBackgroundLocation,
    disableBackgroundLocation,
    isNative
  };
};
