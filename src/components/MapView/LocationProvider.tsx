
import React, { useState, useEffect, useCallback } from 'react';
import { calculateDistance } from './utils';
import { BusinessLocation } from './types';
import { useLocation } from '@/hooks/use-location';
import { useCapacitor } from '@/hooks/use-capacitor';
import { toast } from 'sonner';

interface LocationProviderProps {
  businesses: BusinessLocation[];
  setUserLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>;
  setNearbyBusinesses: React.Dispatch<React.SetStateAction<BusinessLocation[]>>;
  isVisible?: boolean;
  userLocation: { lat: number; lng: number } | null;
  children: ({ loading, error, getUserLocation }: { 
    loading: boolean; 
    error: string | null; 
    getUserLocation: (forceRefresh?: boolean) => Promise<void> 
  }) => React.ReactNode;
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
  
  const updateBusinessesWithLocation = useCallback((loc: { lat: number; lng: number }) => {
    if (!businesses || businesses.length === 0) return;
    
    // Filter and sort businesses based on user's location
    const businessesWithDistance = businesses
      .map(business => {
        const distance = calculateDistance(
          loc.lat,
          loc.lng,
          business.lat,
          business.lng
        );
        return { 
          ...business, 
          distance: distance.toFixed(1) + ' mi', 
          distanceValue: distance 
        };
      })
      .sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0));
    
    setNearbyBusinesses(businessesWithDistance);
  }, [businesses, setNearbyBusinesses]);
  
  // This useEffect handles displaying nearby businesses based on user location
  useEffect(() => {
    if (!location || !isVisible) return;
    
    // Set user location from location hook
    setUserLocation({ lat: location.lat, lng: location.lng });
    
    // Update businesses with distance information
    updateBusinessesWithLocation(location);
    
  }, [location, isVisible, setUserLocation, updateBusinessesWithLocation]);
  
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
      const result = await getCurrentPosition(forceRefresh);
      
      // If we have a location from the result
      if (result && !locationError) {
        setUserLocation({ lat: result.lat, lng: result.lng });
        updateBusinessesWithLocation(result);
        toast.success("Location updated", {
          description: "Showing businesses near your location",
          duration: 3000
        });
      } else if (locationError) {
        setError(locationError);
        toast.error("Location error", {
          description: locationError,
          duration: 5000
        });
      }
    } catch (err: any) {
      console.error('Error in getUserLocation:', err);
      setError(err.message || 'Error getting location');
      toast.error("Location error", {
        description: err.message || 'Could not determine your location',
        duration: 5000
      });
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
