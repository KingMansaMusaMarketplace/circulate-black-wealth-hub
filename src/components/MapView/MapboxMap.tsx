import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BusinessLocation } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

interface MapboxMapProps {
  apiKey: string;
  userLocation: { lat: number; lng: number } | null;
  businesses: BusinessLocation[];
  onBusinessClick?: (businessId: string) => void;
  highlightedBusinessId?: string | null;
  onMarkerHover?: (businessId: string | null) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ 
  apiKey, 
  userLocation, 
  businesses, 
  onBusinessClick,
  highlightedBusinessId,
  onMarkerHover,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !apiKey) return;

    try {
      mapboxgl.accessToken = apiKey;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: userLocation ? [userLocation.lng, userLocation.lat] : [-74.0060, 40.7128], // Default to NYC
        zoom: userLocation ? 14 : 11,
        pitch: 45,
        bearing: -17.6,
        antialias: true,
      });

      // Add 3D buildings and enhance labels on load
      map.current.on('style.load', () => {
        const mapInstance = map.current!;
        const layers = mapInstance.getStyle().layers;
        const labelLayerId = layers?.find(
          (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
        )?.id;

        // Brighten labels for maximum readability on dark background
        layers?.forEach((layer) => {
          if (layer.type === 'symbol' && layer.id.includes('label')) {
            // Pure white text for maximum brightness
            mapInstance.setPaintProperty(layer.id, 'text-color', '#ffffff');
            // Strong dark halo for contrast
            mapInstance.setPaintProperty(layer.id, 'text-halo-color', '#000000');
            mapInstance.setPaintProperty(layer.id, 'text-halo-width', 2.5);
            // Increase text opacity
            mapInstance.setPaintProperty(layer.id, 'text-opacity', 1);
          }
        });

        mapInstance.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 14,
            paint: {
              'fill-extrusion-color': '#1e293b',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.8,
            },
          },
          labelLayerId
        );
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('load', () => {
        setMapLoading(false);
        setMapError(null);
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Failed to load map. Please check your API key.');
        setMapLoading(false);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please check your API key.');
      setMapLoading(false);
    }

    return () => {
      map.current?.remove();
    };
  }, [apiKey]);

  // Update map center when user location changes
  useEffect(() => {
    if (map.current && userLocation) {
      map.current.setCenter([userLocation.lng, userLocation.lat]);
      map.current.setZoom(13);
    }
  }, [userLocation]);

  // Track if we've done initial bounds fit
  const hasInitialFit = useRef(false);

  // Add/update markers when businesses change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add user location marker
    if (userLocation) {
      const userMarker = new mapboxgl.Marker({
        color: '#3B82F6', // Blue color for user
        scale: 1.2
      })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<div class="font-medium">Your Location</div>'))
        .addTo(map.current);
      
      markersRef.current.push(userMarker);
    }

    // Add business markers
    businesses.forEach(business => {
      const isHighlighted = highlightedBusinessId === business.id;
      
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-medium text-sm mb-1">${business.name}</h3>
          <p class="text-xs text-gray-600 mb-1">${business.category}</p>
          ${business.distance ? `<p class="text-xs text-blue-600">${business.distance}</p>` : ''}
        </div>
      `);

      // Create custom marker element for highlighting
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.style.cssText = `
        width: ${isHighlighted ? '24px' : '20px'};
        height: ${isHighlighted ? '24px' : '20px'};
        background: ${isHighlighted ? '#D97706' : '#D97706'};
        border: 3px solid ${isHighlighted ? '#FCD34D' : '#1e293b'};
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: ${isHighlighted ? '0 0 20px rgba(217, 119, 6, 0.6)' : '0 2px 4px rgba(0,0,0,0.3)'};
        ${isHighlighted ? 'animation: pulse 1.5s infinite;' : ''}
      `;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([business.lng, business.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add hover listener
      el.addEventListener('mouseenter', () => {
        onMarkerHover?.(business.id);
      });
      
      el.addEventListener('mouseleave', () => {
        onMarkerHover?.(null);
      });

      // Add click listener for business selection
      if (onBusinessClick) {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onBusinessClick(business.id);
        });
      }

      markersRef.current.push(marker);
    });

    // Fit map to show all markers ONLY on initial load
    if (!hasInitialFit.current && markersRef.current.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add user location to bounds
      if (userLocation) {
        bounds.extend([userLocation.lng, userLocation.lat]);
      }
      
      // Add business locations to bounds
      businesses.forEach(business => {
        bounds.extend([business.lng, business.lat]);
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
      
      hasInitialFit.current = true;
    }
  }, [businesses, userLocation, onBusinessClick, highlightedBusinessId, onMarkerHover]);

  if (mapError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Map Error</p>
          <p className="text-sm text-gray-600">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {mapLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-mansablue mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default MapboxMap;