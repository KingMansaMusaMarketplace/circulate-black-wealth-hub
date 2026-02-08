import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, MapPin, Loader2 } from 'lucide-react';
import { VacationProperty } from '@/types/vacation-rental';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PropertyMapProps {
  properties: VacationProperty[];
  selectedPropertyId?: string;
  onSelectProperty?: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  center = [-98.5795, 39.8283], // US center
  zoom = 4,
  height = '500px',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const navigate = useNavigate();
  const [hoveredProperty, setHoveredProperty] = useState<VacationProperty | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Fetch Mapbox token from edge function
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setTokenLoading(true);
        const { data, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) {
          console.error('Error fetching Mapbox token:', error);
          setTokenError('Failed to load map configuration');
          return;
        }

        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          setTokenError('Mapbox token not available');
        }
      } catch (err) {
        console.error('Error:', err);
        setTokenError('Failed to load map configuration');
      } finally {
        setTokenLoading(false);
      }
    };

    fetchToken();
  }, []);

  // Initialize map once token is available
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center,
      zoom,
      pitch: 45,
      bearing: -17.6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken, center, zoom]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter properties with valid coordinates
    const validProperties = properties.filter(
      p => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
    );

    // Add markers for each property
    validProperties.forEach(property => {
      const el = document.createElement('div');
      el.className = 'property-marker';
      el.innerHTML = `
        <div class="relative">
          <div class="bg-mansagold text-black px-2 py-1 rounded-lg font-bold text-sm shadow-lg cursor-pointer transform transition-transform hover:scale-110 ${
            selectedPropertyId === property.id ? 'ring-2 ring-white scale-110' : ''
          }">
            $${property.base_nightly_rate}
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-mansagold"></div>
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectProperty?.(property.id);
        showPropertyPopup(property);
      });

      el.addEventListener('mouseenter', () => {
        setHoveredProperty(property);
      });

      el.addEventListener('mouseleave', () => {
        setHoveredProperty(null);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([property.longitude!, property.latitude!])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fit bounds to show all properties
    if (validProperties.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      validProperties.forEach(p => {
        bounds.extend([p.longitude!, p.latitude!]);
      });
      map.current.fitBounds(bounds, { padding: 100, maxZoom: 12 });
    } else if (validProperties.length === 1) {
      map.current.flyTo({
        center: [validProperties[0].longitude!, validProperties[0].latitude!],
        zoom: 14,
      });
    }
  }, [properties, selectedPropertyId]);

  const showPropertyPopup = (property: VacationProperty) => {
    if (!map.current) return;

    // Remove existing popup
    popupRef.current?.remove();

    const popupHtml = `
      <div class="property-popup bg-slate-800 p-0 rounded-lg overflow-hidden min-w-[250px]">
        ${property.photos && property.photos[0] 
          ? `<img src="${property.photos[0]}" alt="${property.title}" class="w-full h-32 object-cover" />`
          : '<div class="w-full h-32 bg-slate-700 flex items-center justify-center"><span class="text-slate-500">No image</span></div>'
        }
        <div class="p-3">
          <h3 class="font-semibold text-white text-sm mb-1">${property.title}</h3>
          <p class="text-slate-400 text-xs mb-2">${property.city}, ${property.state}</p>
          <div class="flex items-center justify-between">
            <div class="text-mansagold font-bold">
              $${property.base_nightly_rate}<span class="text-slate-400 text-xs font-normal">/night</span>
            </div>
            ${property.average_rating > 0 
              ? `<div class="flex items-center gap-1 text-slate-400 text-xs">
                  <span class="text-mansagold">★</span>
                  ${property.average_rating.toFixed(1)}
                </div>`
              : ''
            }
          </div>
        </div>
      </div>
    `;

    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      className: 'property-map-popup',
      offset: 25,
    })
      .setLngLat([property.longitude!, property.latitude!])
      .setHTML(popupHtml)
      .addTo(map.current);

    // Add click handler to popup for navigation
    popup.getElement()?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mapboxgl-popup-close-button')) {
        navigate(`/stays/${property.id}`);
      }
    });

    popupRef.current = popup;
  };

  // Show loading state
  if (tokenLoading) {
    return (
      <div className="relative flex items-center justify-center bg-slate-900/50 rounded-lg" style={{ height }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-mansagold mx-auto mb-2" />
          <p className="text-sm text-white/60">Loading map...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (tokenError) {
    return (
      <div className="relative flex items-center justify-center bg-slate-900/50 rounded-lg" style={{ height }}>
        <div className="text-center">
          <MapPin className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-400">{tokenError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />
      
      {/* Hover Card */}
      {hoveredProperty && (
        <div className="absolute top-4 left-4 z-10">
          <Card className="bg-slate-800/95 backdrop-blur-sm border-slate-700 w-72 shadow-xl">
            <CardContent className="p-3">
              <div className="flex gap-3">
                {hoveredProperty.photos && hoveredProperty.photos[0] ? (
                  <img
                    src={hoveredProperty.photos[0]}
                    alt={hoveredProperty.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-slate-700 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-slate-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm truncate">
                    {hoveredProperty.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {hoveredProperty.city}, {hoveredProperty.state}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {hoveredProperty.property_type}
                    </Badge>
                    {hoveredProperty.average_rating > 0 && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Star className="w-3 h-3 fill-mansagold text-mansagold" />
                        {hoveredProperty.average_rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-mansagold font-bold">
                      ${hoveredProperty.base_nightly_rate}
                      <span className="text-slate-400 text-xs font-normal">/night</span>
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {hoveredProperty.max_guests}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <CardContent className="p-2 flex items-center gap-2 text-xs text-slate-400">
            <div className="w-3 h-3 bg-mansagold rounded-sm" />
            <span>{properties.length} properties</span>
          </CardContent>
        </Card>
      </div>

      {/* Custom CSS for popup styling */}
      <style>{`
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .mapboxgl-popup-close-button {
          color: white;
          font-size: 18px;
          right: 4px;
          top: 4px;
        }
        .mapboxgl-popup-tip {
          display: none;
        }
        .property-map-popup .mapboxgl-popup-content {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default PropertyMap;
