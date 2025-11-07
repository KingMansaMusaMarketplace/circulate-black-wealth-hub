
import React, { useState, useEffect, useRef } from 'react';
import LocationProvider from './LocationProvider';
import MapContainer from './MapContainer';
import { BusinessLocation } from './types';
import BusinessList from './BusinessList';
import DistanceRanges from './DistanceRanges';
import { RefreshCcw } from 'lucide-react';

interface MapViewProps {
  businesses: BusinessLocation[];
  isVisible?: boolean;
  onSelectBusiness?: (id: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ businesses, isVisible = true, onSelectBusiness }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<BusinessLocation[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);

  // Scroll into view when map becomes visible
  useEffect(() => {
    if (isVisible && mapRef.current && !userLocation) {
      // Wait a moment before scrolling to give the map time to render
      const timer = setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, userLocation]);

  return (
    <div ref={mapRef} className="relative">
      <LocationProvider
        businesses={businesses}
        setUserLocation={setUserLocation}
        setNearbyBusinesses={setNearbyBusinesses}
        isVisible={isVisible}
        userLocation={userLocation}
      >
        {({ loading, error, getUserLocation }) => (
          <MapContainer 
            userLocation={userLocation}
            nearbyBusinesses={nearbyBusinesses}
            loading={loading}
            error={error}
            onSelectBusiness={onSelectBusiness}
          >
            <DistanceRanges nearbyBusinesses={nearbyBusinesses} />
            <BusinessList 
              nearbyBusinesses={nearbyBusinesses} 
              onSelectBusiness={onSelectBusiness} 
            />
            
            <button 
              onClick={() => getUserLocation(true)}
              className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-50 transition-colors"
              aria-label="Refresh location"
            >
              <RefreshCcw className="h-5 w-5 text-mansablue" />
            </button>
          </MapContainer>
        )}
      </LocationProvider>
    </div>
  );
};

export default MapView;
