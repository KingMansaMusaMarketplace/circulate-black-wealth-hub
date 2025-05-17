
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MapContainer from './MapContainer';
import LocationProvider from './LocationProvider';
import BusinessList from './BusinessList';
import DistanceRanges from './DistanceRanges';
import { BusinessLocation } from './types';

interface MapViewProps {
  businesses: BusinessLocation[];
  onSelectBusiness?: (id: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ businesses, onSelectBusiness }) => {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<BusinessLocation[]>([]);

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        onClick={toggleMap}
        className="w-full mb-4 flex items-center justify-center gap-2"
      >
        <MapPin size={16} />
        {showMap ? "Hide Map View" : "Show Map View"}
      </Button>

      {showMap && (
        <LocationProvider
          businesses={businesses}
          setUserLocation={setUserLocation}
          setNearbyBusinesses={setNearbyBusinesses}
          isVisible={showMap}
          userLocation={userLocation}
        >
          {(props) => (
            <MapContainer 
              userLocation={userLocation}
              nearbyBusinesses={nearbyBusinesses}
              loading={props.loading}
              error={props.error}
            >
              <DistanceRanges nearbyBusinesses={nearbyBusinesses} />
              <BusinessList 
                nearbyBusinesses={nearbyBusinesses} 
                onSelectBusiness={onSelectBusiness} 
              />
            </MapContainer>
          )}
        </LocationProvider>
      )}
    </div>
  );
};

export default MapView;
