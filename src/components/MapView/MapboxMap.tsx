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
  flyToOnClick?: boolean;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ 
  apiKey, 
  userLocation, 
  businesses, 
  onBusinessClick,
  highlightedBusinessId,
  onMarkerHover,
  flyToOnClick = true,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
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
        setMapReady(true);
        setMapError(null);
      });

      map.current.on('error', (e: any) => {
        const status = e?.error?.status;
        console.error('Mapbox error:', e);
        if (status === 401 || status === 403) {
          setMapError('Map tiles unauthorized. Add this site to your Mapbox token URL allowlist.');
        } else {
          setMapError('Failed to load map tiles. Please try again.');
        }
        setMapLoading(false);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please check your API key.');
      setMapLoading(false);
    }

    return () => {
      map.current?.remove();
      setMapReady(false);
    };
  }, [apiKey]);

  // Update map center when user location changes
  useEffect(() => {
    if (map.current && userLocation) {
      map.current.setCenter([userLocation.lng, userLocation.lat]);
      map.current.setZoom(13);
    }
  }, [userLocation]);

  const lastFitSignature = useRef<string>('');
  const handlersRef = useRef({ onBusinessClick, onMarkerHover, flyToOnClick });
  handlersRef.current = { onBusinessClick, onMarkerHover, flyToOnClick };

  // User location marker
  useEffect(() => {
    if (!map.current || !mapReady) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (userLocation) {
      const userMarker = new mapboxgl.Marker({ color: '#3B82F6', scale: 1.2 })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<div class="font-medium">Your Location</div>'))
        .addTo(map.current);
      markersRef.current.push(userMarker);
    }
  }, [userLocation, mapReady]);

  // Set up clustered source + layers once
  useEffect(() => {
    const m = map.current;
    if (!m || !mapReady || m.getSource('biz')) return;

    m.addSource('biz', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterMaxZoom: 13,
      clusterRadius: 50,
    });
    m.addLayer({
      id: 'biz-clusters', type: 'circle', source: 'biz', filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#D97706', 100, '#F59E0B', 1000, '#FFB300'],
        'circle-radius': ['step', ['get', 'point_count'], 16, 100, 22, 1000, 30],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#1e293b',
      },
    });
    m.addLayer({
      id: 'biz-cluster-count', type: 'symbol', source: 'biz', filter: ['has', 'point_count'],
      layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12 },
      paint: { 'text-color': '#000000' },
    });
    m.addLayer({
      id: 'biz-points', type: 'circle', source: 'biz', filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#D97706',
        'circle-radius': 8,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#1e293b',
      },
    });
    m.addLayer({
      id: 'biz-highlight', type: 'circle', source: 'biz', filter: ['==', ['get', 'id'], ''],
      paint: {
        'circle-color': '#D97706',
        'circle-radius': 11,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#FCD34D',
      },
    });

    m.on('click', 'biz-clusters', (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const src = m.getSource('biz') as mapboxgl.GeoJSONSource;
      src.getClusterExpansionZoom(f.properties!.cluster_id, (err, zoom) => {
        if (err || zoom == null) return;
        m.easeTo({ center: (f.geometry as any).coordinates, zoom });
      });
    });

    const popup = new mapboxgl.Popup({ offset: 15, closeButton: false });
    m.on('click', 'biz-points', (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const [lng, lat] = (f.geometry as any).coordinates;
      const p = f.properties as any;
      const esc = (s: string) => String(s ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
      popup.setLngLat([lng, lat])
        .setHTML(`<div class="p-2"><h3 class="font-medium text-sm mb-1">${esc(p.name)}</h3><p class="text-xs text-gray-600">${esc(p.category)}</p></div>`)
        .addTo(m);
      const h = handlersRef.current;
      if (h.flyToOnClick) m.flyTo({ center: [lng, lat], zoom: 15, pitch: 50, duration: 1200, essential: true });
      h.onBusinessClick?.(p.id);
    });
    m.on('mouseenter', 'biz-points', (e) => {
      m.getCanvas().style.cursor = 'pointer';
      const id = (e.features?.[0]?.properties as any)?.id;
      if (id) handlersRef.current.onMarkerHover?.(id);
    });
    m.on('mouseleave', 'biz-points', () => {
      m.getCanvas().style.cursor = '';
      handlersRef.current.onMarkerHover?.(null);
    });
    m.on('mouseenter', 'biz-clusters', () => { m.getCanvas().style.cursor = 'pointer'; });
    m.on('mouseleave', 'biz-clusters', () => { m.getCanvas().style.cursor = ''; });
  }, [mapReady]);

  // Update data
  useEffect(() => {
    const m = map.current;
    if (!m || !mapReady) return;
    const src = m.getSource('biz') as mapboxgl.GeoJSONSource | undefined;
    if (!src) return;

    const valid = businesses.filter(b =>
      Number.isFinite(Number(b.lat)) && Number.isFinite(Number(b.lng)) &&
      Number(b.lat) !== 0 && Number(b.lng) !== 0 &&
      Math.abs(Number(b.lat)) <= 90 && Math.abs(Number(b.lng)) <= 180);

    src.setData({
      type: 'FeatureCollection',
      features: valid.map(b => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [Number(b.lng), Number(b.lat)] },
        properties: { id: b.id, name: b.name, category: b.category },
      })),
    });

    const sig = `${valid.length}:${valid[0]?.id ?? ''}:${valid[valid.length - 1]?.id ?? ''}`;
    if (sig !== lastFitSignature.current && valid.length > 0 && !userLocation) {
      const bounds = new mapboxgl.LngLatBounds();
      valid.forEach(b => bounds.extend([Number(b.lng), Number(b.lat)]));
      m.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      lastFitSignature.current = sig;
    }
  }, [businesses, mapReady, userLocation]);

  // Highlight
  useEffect(() => {
    const m = map.current;
    if (!m || !mapReady || !m.getLayer('biz-highlight')) return;
    m.setFilter('biz-highlight', ['all', ['!', ['has', 'point_count']], ['==', ['get', 'id'], highlightedBusinessId || '']]);
  }, [highlightedBusinessId, mapReady]);

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