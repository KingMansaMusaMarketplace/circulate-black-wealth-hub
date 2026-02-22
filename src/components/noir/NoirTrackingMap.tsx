import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Star, Navigation, Clock, X } from 'lucide-react';
import type { DriverLocation, RideStatus } from '@/hooks/useDriverTracking';
import { supabase } from '@/integrations/supabase/client';

interface NoirTrackingMapProps {
  driverLocation: DriverLocation | null;
  rideStatus: RideStatus | null;
  pickupCoords?: [number, number]; // [lng, lat]
  dropoffCoords?: [number, number];
  onClose?: () => void;
  isDemo?: boolean;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  requested: { label: 'Finding your driver...', color: 'bg-yellow-500' },
  accepted: { label: 'Driver assigned', color: 'bg-blue-500' },
  driver_en_route: { label: 'Driver en route', color: 'bg-purple-500' },
  arrived: { label: 'Driver arrived', color: 'bg-green-500' },
  in_progress: { label: 'Ride in progress', color: 'bg-green-600' },
  completed: { label: 'Ride completed', color: 'bg-gray-500' },
  cancelled: { label: 'Ride cancelled', color: 'bg-red-500' },
};

const NoirTrackingMap: React.FC<NoirTrackingMapProps> = ({
  driverLocation,
  rideStatus,
  pickupCoords,
  dropoffCoords,
  onClose,
  isDemo = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const driverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  // Demo animation state
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [demoLocation, setDemoLocation] = useState<DriverLocation | null>(null);
  const [demoStatus, setDemoStatus] = useState<RideStatus | null>(null);

  const activeLocation = isDemo ? demoLocation : driverLocation;
  const activeStatus = isDemo ? demoStatus : rideStatus;

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        if (!error && data?.token) {
          setMapboxToken(data.token);
        }
      } catch (e) {
        console.error('Failed to fetch Mapbox token:', e);
      }
    };
    fetchToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    const defaultCenter: [number, number] = pickupCoords || [-84.388, 33.749];

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: defaultCenter,
      zoom: 14,
      attributionControl: false,
    });

    map.on('load', () => {
      setMapReady(true);

      // Force resize after animation completes
      setTimeout(() => {
        map.resize();
      }, 500);

      if (pickupCoords) {
        new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat(pickupCoords)
          .setPopup(new mapboxgl.Popup().setText('Pickup'))
          .addTo(map);
      }

      if (dropoffCoords) {
        new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat(dropoffCoords)
          .setPopup(new mapboxgl.Popup().setText('Dropoff'))
          .addTo(map);

        if (pickupCoords) {
          const bounds = new mapboxgl.LngLatBounds()
            .extend(pickupCoords)
            .extend(dropoffCoords);
          map.fitBounds(bounds, { padding: 80 });
        }
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [mapboxToken, pickupCoords, dropoffCoords]);

  // Update driver marker position
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || !activeLocation) return;

    const lngLat: [number, number] = [activeLocation.lng, activeLocation.lat];

    if (!driverMarkerRef.current) {
      // Create custom car marker
      const el = document.createElement('div');
      const innerDiv = document.createElement('div');
      Object.assign(innerDiv.style, {
        width: '40px',
        height: '40px',
        background: '#d4af37',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(212,175,55,0.6)',
        transform: `rotate(${activeLocation.heading || 0}deg)`,
        transition: 'transform 0.5s ease',
      });
      innerDiv.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5">
          <path d="M12 2L19 21L12 17L5 21L12 2Z"/>
        </svg>
      `;
      el.appendChild(innerDiv);

      driverMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat(lngLat)
        .addTo(map);
    } else {
      // Smoothly update position
      driverMarkerRef.current.setLngLat(lngLat);
      try {
        const markerEl = driverMarkerRef.current.getElement();
        const child = markerEl?.firstChild as HTMLElement | null;
        if (child?.style) {
          child.style.transform = `rotate(${activeLocation.heading || 0}deg)`;
        }
      } catch (e) {
        // Marker element may have been removed
      }
    }

    // Pan map to follow driver
    try {
      map.panTo(lngLat, { duration: 1000 });
    } catch (e) {
      // Map may have been removed
    }
  }, [activeLocation, mapReady]);

  // Demo mode: simulate a driver approaching pickup
  useEffect(() => {
    if (!isDemo || !mapReady) return;

    const pickup = pickupCoords || [-84.388, 33.749];
    let step = 0;
    const totalSteps = 60;
    const startLat = pickup[1] + 0.015;
    const startLng = pickup[0] - 0.012;

    setDemoStatus({
      id: 'demo',
      status: 'driver_en_route',
      driver_name: 'Marcus Johnson',
      vehicle_info: '2023 Tesla Model 3 · Black',
      driver_rating: 4.92,
      estimated_arrival_minutes: 4,
    });

    demoIntervalRef.current = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const lat = startLat + (pickup[1] - startLat) * progress;
      const lng = startLng + (pickup[0] - startLng) * progress;
      const heading = Math.atan2(pickup[0] - startLng, pickup[1] - startLat) * (180 / Math.PI);

      setDemoLocation({
        driver_id: 'demo-driver',
        lat,
        lng,
        heading,
        speed: 25 + Math.random() * 10,
        timestamp: Date.now(),
      });

      setDemoStatus(prev => prev ? {
        ...prev,
        estimated_arrival_minutes: Math.max(1, Math.round((1 - progress) * 4)),
        status: progress > 0.9 ? 'arrived' : 'driver_en_route',
      } : null);

      if (step >= totalSteps) {
        if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
      }
    }, 1500);

    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [isDemo, mapReady, pickupCoords]);

  const statusInfo = activeStatus ? STATUS_LABELS[activeStatus.status] || STATUS_LABELS.requested : STATUS_LABELS.requested;

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl border border-white/10" style={{ height: '100%', overflow: 'hidden' }}>
      {/* Map */}
      <div
        ref={mapContainer}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-sm rounded-full p-2 hover:bg-black/90 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      )}

      {/* Status banner */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <div className="pointer-events-auto bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 flex items-center gap-2 w-fit">
          <div className={`w-2.5 h-2.5 rounded-full ${statusInfo.color} animate-pulse`} />
          <span className="text-white font-medium text-xs">{statusInfo.label}</span>
          {activeStatus?.estimated_arrival_minutes && activeStatus.status !== 'arrived' && (
            <Badge variant="outline" className="border-[#d4af37]/50 text-[#d4af37] gap-1 text-[10px] px-1.5 py-0.5">
              <Clock className="h-2.5 w-2.5" />
              {activeStatus.estimated_arrival_minutes} min
            </Badge>
          )}
        </div>
      </div>

      {/* Driver info card */}
      {activeStatus?.driver_name && (
        <Card className="absolute bottom-3 left-3 right-3 z-10 bg-black/85 backdrop-blur-md border-white/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8960c] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                {activeStatus.driver_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm truncate">{activeStatus.driver_name}</h4>
                {activeStatus.vehicle_info && (
                  <p className="text-white/60 text-xs truncate">{activeStatus.vehicle_info}</p>
                )}
                {activeStatus.driver_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-[#d4af37] text-[#d4af37]" />
                    <span className="text-[#d4af37] text-xs font-medium">{activeStatus.driver_rating}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <Button size="icon" variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 h-8 w-8">
                  <Phone className="h-3.5 w-3.5 text-white" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 h-8 w-8">
                  <MessageSquare className="h-3.5 w-3.5 text-white" />
                </Button>
              </div>
            </div>
            {activeLocation && (
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-[10px] text-white/40">
                <Navigation className="h-2.5 w-2.5 text-[#d4af37]" />
                <span>Live · {Math.round(activeLocation.speed || 0)} mph</span>
                <span className="ml-auto">{isDemo ? 'Demo' : 'Connected'}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NoirTrackingMap;
