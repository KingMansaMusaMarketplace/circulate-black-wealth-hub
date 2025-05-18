
import React, { useState } from 'react';
import LocationProvider from './LocationProvider';
import MapContainer from './MapContainer';
import { BusinessLocation } from './types';

interface MapViewProps {
  businesses: BusinessLocation[];
  isVisible: boolean;
}

const MapView: React.FC<MapViewProps> = ({ businesses, isVisible }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<BusinessLocation[]>([]);

  return (
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
        >
          <button 
            onClick={() => getUserLocation(true)}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg z-10"
            aria-label="Refresh location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </button>
        </MapContainer>
      )}
    </LocationProvider>
  );
};

export default MapView;
