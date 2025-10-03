import { useState, useEffect } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { toast } from 'sonner';

interface NearbyBusiness {
  id: string;
  name: string;
  distance: number;
}

export const useBackgroundLocation = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastPosition, setLastPosition] = useState<Position | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);
  const isNative = Capacitor.isNativePlatform();

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
      await Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
      setIsTracking(false);
      console.log('Background location tracking stopped');
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

    // Store location history for analytics (last 10 positions)
    const history = JSON.parse(localStorage.getItem('location_history') || '[]');
    history.push({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: position.timestamp
    });
    
    // Keep only last 10 positions
    const recentHistory = history.slice(-10);
    localStorage.setItem('location_history', JSON.stringify(recentHistory));
  };

  const checkNearbyBusinesses = async (lat: number, lng: number): Promise<NearbyBusiness[]> => {
    // This would normally query your backend for nearby businesses
    // For now, we'll return empty array as placeholder
    // In production, this would use Supabase with PostGIS or similar
    
    try {
      // Example implementation:
      // const { data } = await supabase.rpc('get_nearby_businesses', {
      //   user_lat: lat,
      //   user_lng: lng,
      //   radius_km: 5
      // });
      // return data || [];
      
      return [];
    } catch (error) {
      console.error('Error checking nearby businesses:', error);
      return [];
    }
  };

  const notifyNearbyBusinesses = async (businesses: NearbyBusiness[]) => {
    if (!isNative || businesses.length === 0) return;

    try {
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
        await LocalNotifications.schedule({
          notifications: [{
            title: '🎯 Black-Owned Business Nearby!',
            body: `${business.name} is just ${business.distance.toFixed(1)} km away. Visit and earn rewards!`,
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
