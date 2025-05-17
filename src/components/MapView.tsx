
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface BusinessLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: string;
  distanceValue?: number;
  distance?: string;
}

interface MapViewProps {
  businesses: BusinessLocation[];
  onSelectBusiness?: (id: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ businesses, onSelectBusiness }) => {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<BusinessLocation[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

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

  // Calculate distance ranges
  const getDistanceRanges = () => {
    if (!nearbyBusinesses.length) return null;
    
    const ranges = {
      under1: 0,
      under5: 0,
      under10: 0,
      over10: 0
    };
    
    nearbyBusinesses.forEach(business => {
      const distance = business.distanceValue || 0;
      if (distance < 1) ranges.under1++;
      else if (distance < 5) ranges.under5++;
      else if (distance < 10) ranges.under10++;
      else ranges.over10++;
    });
    
    return ranges;
  };
  
  const distanceRanges = getDistanceRanges();

  // Toggle map visibility
  const toggleMap = () => {
    if (!showMap) {
      setShowMap(true);
      if (!userLocation) {
        getUserLocation();
      }
    } else {
      setShowMap(false);
    }
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
        <div className="relative mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <div 
            ref={mapContainerRef} 
            className="w-full h-[500px] bg-slate-100 flex flex-col"
          >
            {/* Map Header with Location Controls */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-mansablue">Nearby Black-Owned Businesses</h3>
                <p className="text-sm text-gray-500">
                  {userLocation ? `Your current location detected` : `Find businesses near you`}
                </p>
              </div>
              
              <Button
                onClick={getUserLocation}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />} 
                {userLocation ? "Refresh Location" : "Get My Location"}
              </Button>
            </div>
            
            {/* Main Map Content */}
            <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
              {/* Left Side - Distances & Business List */}
              <div className="w-full md:w-1/3 p-4 bg-white border-r border-gray-200 overflow-y-auto">
                {error ? (
                  <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">
                    {error}
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 text-mansablue animate-spin" />
                    <p className="ml-2">Detecting your location...</p>
                  </div>
                ) : (
                  <>
                    {/* Distance Information */}
                    {distanceRanges && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Businesses Near You:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {distanceRanges.under1 > 0 && (
                            <Badge variant="outline" className="flex justify-between px-3 py-1.5">
                              <span>Under 1 mile:</span>
                              <span className="font-bold text-mansablue">{distanceRanges.under1}</span>
                            </Badge>
                          )}
                          {distanceRanges.under5 > 0 && (
                            <Badge variant="outline" className="flex justify-between px-3 py-1.5">
                              <span>1-5 miles:</span>
                              <span className="font-bold text-mansablue">{distanceRanges.under5}</span>
                            </Badge>
                          )}
                          {distanceRanges.under10 > 0 && (
                            <Badge variant="outline" className="flex justify-between px-3 py-1.5">
                              <span>5-10 miles:</span>
                              <span className="font-bold text-mansablue">{distanceRanges.under10}</span>
                            </Badge>
                          )}
                          {distanceRanges.over10 > 0 && (
                            <Badge variant="outline" className="flex justify-between px-3 py-1.5">
                              <span>10+ miles:</span>
                              <span className="font-bold text-mansablue">{distanceRanges.over10}</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Business List */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Businesses by Distance:</h4>
                      {nearbyBusinesses.map((business) => (
                        <Card 
                          key={business.id}
                          className="p-3 cursor-pointer hover:border-mansablue transition-colors"
                          onClick={() => onSelectBusiness && onSelectBusiness(business.id)}
                        >
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-mansablue/10 flex items-center justify-center mr-3">
                              <MapPin size={16} className="text-mansablue" />
                            </div>
                            <div className="flex-grow">
                              <h5 className="font-medium">{business.name}</h5>
                              <p className="text-xs text-gray-500">{business.category}</p>
                            </div>
                            <Badge variant="outline" className="ml-2 whitespace-nowrap">
                              {business.distance} mi
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Right Side - Map Visualization */}
              <div className="flex-grow bg-slate-100 p-4 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                  <MapPin size={48} className="mx-auto mb-4 text-mansablue opacity-50" />
                  <p className="text-gray-500 mb-2">Interactive Map</p>
                  <p className="text-xs text-gray-400 mb-4">
                    {userLocation 
                      ? `Showing ${nearbyBusinesses.length} businesses near your location` 
                      : 'Get your location to see businesses near you'}
                  </p>
                  
                  {userLocation && (
                    <p className="text-sm bg-mansablue/10 p-2 rounded text-mansablue">
                      For a fully integrated map experience, a map integration (like Mapbox or Google Maps) would be added here
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
