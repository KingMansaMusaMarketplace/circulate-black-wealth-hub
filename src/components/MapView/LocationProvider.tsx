
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BusinessLocation, LocationProviderProps } from './types';
import { calculateDistance } from './utils';

const LocationProvider: React.FC<LocationProviderProps> = ({
  businesses,
  userLocation,
  setUserLocation,
  setNearbyBusinesses,
  isVisible,
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current user location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      toast.error("Geolocation not supported", {
        description: "Your browser doesn't support geolocation services."
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Calculate distances and sort businesses by proximity
        const businessesWithDistance = businesses.map(business => {
          const distance = calculateDistance(
            latitude, 
            longitude, 
            business.lat, 
            business.lng
          );
          
          return {
            ...business,
            distanceValue: distance,
            distance: distance.toFixed(1)
          };
        }).sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0));
        
        setNearbyBusinesses(businessesWithDistance);
        setLoading(false);
        
        // Show success toast
        toast.success("Location found", {
          description: `Showing ${businessesWithDistance.length} businesses near you.`
        });
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
        setLoading(false);
        toast.error("Location error", {
          description: "Couldn't access your location. Please check your browser permissions."
        });
      }
    );
  };

  // Automatically get location when map becomes visible and no location yet
  useEffect(() => {
    if (isVisible && !userLocation) {
      getUserLocation();
    }
  }, [isVisible, userLocation]);

  return (
    <>
      {children({ loading, error, getUserLocation })}
    </>
  );
};

export default LocationProvider;
