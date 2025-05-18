import React, { useState, useEffect } from 'react';
import { calculateDistance } from './utils';
import { BusinessLocation } from './types';
import { useLocation } from '@/hooks/use-location';
import { useCapacitor } from '@/hooks/use-capacitor';

interface LocationProviderProps {
  businesses: BusinessLocation[];
  setUserLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
  setNearbyBusinesses: React.Dispatch<React.SetStateAction<BusinessLocation[]>>;
  isVisible?: boolean;
  userLocation: { lat: number; lng: number } | null;
  children: ({ loading, error, getUserLocation }: { loading: boolean; error: string | null; getUserLocation: (forceRefresh?: boolean) => Promise<void> }) => React.ReactNode;
}

const LocationProvider: React.FC<LocationProviderProps> = ({ 
  businesses, 
  setUserLocation, 
  setNearbyBusinesses, 
  isVisible = true,
  userLocation,
  children 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { location, getCurrentPosition, loading: locationLoading, error: locationError } = useLocation();
  const { isNative, platform } = useCapacitor();
  
  // This useEffect handles displaying nearby businesses based on user location
  useEffect(() => {
    if (!location || !isVisible) return;
    
    // Set user location from location hook
    setUserLocation({ lat: location.lat, lng: location.lng });
    
    // Filter and sort businesses based on user's location
    const businessesWithDistance = businesses
      .map(business => {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          business.latitude,
          business.longitude
        );
        return { ...business, distance };
      })
      .sort((a, b) => a.distance - b.distance);
    
    setNearbyBusinesses(businessesWithDistance);
  }, [location, businesses, setUserLocation, setNearbyBusinesses, isVisible]);
  
  // This effect automatically gets the user's location when the component becomes visible
  useEffect(() => {
    if (!isVisible) return;
    
    // For iOS devices, we want to be more careful about when we request location
    // to provide a better user experience
    if (isNative && platform === 'ios') {
      // Check if we already have a location before requesting a new one
      if (!userLocation) {
        getUserLocation();
      }
    } else {
      // For other platforms, get location immediately when component becomes visible
      getUserLocation();
    }
  }, [isVisible]);
  
  // Handle getting user location
  const getUserLocation = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      await getCurrentPosition(forceRefresh);
      
      // Handle any location errors
      if (locationError) {
        setError(locationError);
      }
    } catch (err: any) {
      console.error('Error in getUserLocation:', err);
      setError(err.message || 'Error getting location');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      {children({
        loading: loading || locationLoading,
        error,
        getUserLocation,
      })}
    </>
  );
};

export default LocationProvider;
