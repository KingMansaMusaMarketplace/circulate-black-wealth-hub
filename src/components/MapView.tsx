
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock business location data
interface BusinessLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: string;
}

interface MapViewProps {
  businesses: BusinessLocation[];
  onSelectBusiness?: (id: number) => void;
}

const MapView: React.FC<MapViewProps> = ({ businesses, onSelectBusiness }) => {
  const [showMap, setShowMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const toggleMap = () => {
    setShowMap(!showMap);
    
    if (!showMap) {
      toast("Map View", {
        description: "This is a simulated map view. In a real app, this would show an interactive map with business locations."
      });
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
            className="w-full h-[400px] bg-slate-100 flex items-center justify-center"
          >
            <div className="text-center p-6">
              <MapPin size={48} className="mx-auto mb-4 text-mansablue opacity-50" />
              <p className="text-gray-500 mb-2">Interactive Map</p>
              <p className="text-xs text-gray-400">
                This is a simulated map view. In production, this would display a real map with {businesses.length} business locations.
              </p>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {businesses.map((business) => (
                  <Button 
                    key={business.id}
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => onSelectBusiness && onSelectBusiness(business.id)}
                  >
                    <MapPin size={12} className="mr-1 text-mansablue" />
                    {business.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
