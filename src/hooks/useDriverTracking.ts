import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface DriverLocation {
  driver_id: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  timestamp: number;
}

export interface RideStatus {
  id: string;
  status: string;
  driver_name?: string;
  driver_photo?: string;
  vehicle_info?: string;
  driver_rating?: number;
  estimated_arrival_minutes?: number;
}

export function useDriverTracking(rideId: string | null) {
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [rideStatus, setRideStatus] = useState<RideStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!rideId) return;

    // Subscribe to ride status changes via Postgres changes
    const rideChannel = supabase
      .channel(`ride-status-${rideId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'noir_rides',
          filter: `id=eq.${rideId}`,
        },
        (payload) => {
          const ride = payload.new as any;
          setRideStatus(prev => prev ? { ...prev, status: ride.status } : null);
        }
      )
      .subscribe();

    // Subscribe to real-time driver location via Broadcast (low latency, no DB writes)
    const locationChannel = supabase
      .channel(`driver-location-${rideId}`)
      .on('broadcast', { event: 'location_update' }, (payload) => {
        const loc = payload.payload as DriverLocation;
        setDriverLocation(loc);
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = locationChannel;

    return () => {
      supabase.removeChannel(rideChannel);
      supabase.removeChannel(locationChannel);
      channelRef.current = null;
      setIsConnected(false);
    };
  }, [rideId]);

  return { driverLocation, rideStatus, isConnected, setRideStatus };
}

// Hook for drivers to broadcast their location
export function useDriverBroadcast(rideId: string | null) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const startBroadcasting = useCallback(() => {
    if (!rideId) return;

    const channel = supabase.channel(`driver-location-${rideId}`);
    channelRef.current = channel;

    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') return;

      // Use browser geolocation API (Capacitor will intercept on native)
      if ('geolocation' in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const locationData: DriverLocation = {
              driver_id: '', // Will be set by caller
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              heading: position.coords.heading || 0,
              speed: position.coords.speed || 0,
              timestamp: Date.now(),
            };

            channel.send({
              type: 'broadcast',
              event: 'location_update',
              payload: locationData,
            });
          },
          (error) => console.error('Geolocation error:', error),
          {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 5000,
          }
        );
      }
    });
  }, [rideId]);

  const stopBroadcasting = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopBroadcasting();
  }, [stopBroadcasting]);

  return { startBroadcasting, stopBroadcasting };
}
