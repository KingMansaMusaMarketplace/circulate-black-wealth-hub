
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { BusinessLocation } from './types';
import { useLocation } from '@/hooks/use-location';

const LocationProvider: React.FC<LocationProviderProps> = ({
  businesses,
  setUserLocation,
  setNearbyBusinesses,
  isVisible,
  children
}) => {
  const { 
    location, 
    loading, 
    error: locationError, 
    getCurrentPosition,
    getNearbyPoints,
    isUsingFallback
  } = useLocation({
    enableHighAccuracy: true,
    timeout: 5000
  });

  // Process location updates
  useEffect(() => {
    if (location) {
      setUserLocation({ lat: location.lat, lng: location.lng });
      
      // Process businesses with the getNearbyPoints utility
      const businessesWithDistance = getNearbyPoints(businesses);
      
      setNearbyBusinesses(businessesWithDistance);
      
      // Show appropriate toast based on location source
      if (isUsingFallback) {
        toast.info("Using approximate location", {
          description: `Showing ${businessesWithDistance.length} businesses near your approximate location.`,
          duration: 3000
        });
      } else {
        toast.success("Location found", {
          description: `Showing ${businessesWithDistance.length} businesses near you.`,
          duration: 3000
        });
      }
    }
  }, [location, businesses, setUserLocation, setNearbyBusinesses, getNearbyPoints, isUsingFallback]);

  // Automatically get location when map becomes visible
  useEffect(() => {
    if (isVisible && !location) {
      getCurrentPosition();
    }
  }, [isVisible, location, getCurrentPosition]);

  return (
    <>
      {children({ 
        loading, 
        error: locationError, 
        getUserLocation: () => getCurrentPosition(true) 
      })}
    </>
  );
};

export default LocationProvider;
