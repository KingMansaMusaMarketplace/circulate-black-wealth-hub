import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2, MapPin, AlertCircle, Navigation } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface BusinessLocationMapProps {
  lat: number;
  lng: number;
  businessName: string;
  address: string;
  city: string;
  state: string;
}

const BusinessLocationMap: React.FC<BusinessLocationMapProps> = ({
  lat,
  lng,
  businessName,
  address,
  city,
  state,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(
    lat !== 0 && lng !== 0 ? { lat, lng } : null
  );

  // Fetch mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          setError('Sign in to view map');
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (fetchError || !data?.token) {
          console.error('Failed to fetch Mapbox token:', fetchError);
          setError('Map unavailable');
          setLoading(false);
          return;
        }

        setMapToken(data.token);

        // If no coordinates, try geocoding
        if (!coordinates && address && city && state) {
          const fullAddress = `${address}, ${city}, ${state}`;
          const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${data.token}&limit=1`;
          
          try {
            const geocodeResponse = await fetch(geocodeUrl);
            const geocodeData = await geocodeResponse.json();
            
            if (geocodeData.features && geocodeData.features.length > 0) {
              const [geoLng, geoLat] = geocodeData.features[0].center;
              setCoordinates({ lat: geoLat, lng: geoLng });
            } else {
              setError('Location not found');
              setLoading(false);
            }
          } catch (geoError) {
            console.error('Geocoding failed:', geoError);
            setError('Could not locate address');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error fetching token:', err);
        setError('Map unavailable');
        setLoading(false);
      }
    };

    fetchToken();
  }, [lat, lng, address, city, state, coordinates]);

  // Initialize map when we have token and coordinates
  useEffect(() => {
    if (!mapContainer.current || !mapToken || !coordinates) return;

    try {
      mapboxgl.accessToken = mapToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [coordinates.lng, coordinates.lat],
        zoom: 15,
        pitch: 0,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: false }),
        'top-right'
      );

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">${businessName}</h3>
          <p class="text-xs text-gray-600">${address}</p>
          <p class="text-xs text-gray-600">${city}, ${state}</p>
        </div>
      `);

      new mapboxgl.Marker({ color: '#D97706' })
        .setLngLat([coordinates.lng, coordinates.lat])
        .setPopup(popup)
        .addTo(map.current);

      map.current.on('load', () => {
        setLoading(false);
        setError(null);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map');
        setLoading(false);
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
      setLoading(false);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapToken, coordinates, businessName, address, city, state]);

  const handleGetDirections = () => {
    const fullAddress = `${address}, ${city}, ${state}`;
    window.open(
      `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (error) {
    return (
      <div className="h-80 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={handleGetDirections}>
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-80 rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-background/75 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default BusinessLocationMap;
