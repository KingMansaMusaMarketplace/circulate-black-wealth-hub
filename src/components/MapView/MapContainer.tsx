
import React from 'react';
import { Loader2 } from 'lucide-react';
import { MapContainerProps } from './types';

const MapContainer: React.FC<MapContainerProps> = ({ 
  userLocation, 
  nearbyBusinesses,
  loading, 
  error, 
  children 
}) => {
  return (
    <div className="relative mt-4 border border-gray-200 rounded-lg overflow-hidden">
      <div className="w-full h-[500px] bg-slate-100 flex flex-col">
        {/* Map Header with Location Controls */}
        <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-mansablue">Nearby Black-Owned Businesses</h3>
            <p className="text-sm text-gray-500">
              {userLocation ? `Your current location detected` : `Find businesses near you`}
            </p>
          </div>
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
                {children}
              </>
            )}
          </div>
          
          {/* Right Side - Map Visualization */}
          <MapVisualization userLocation={userLocation} businessCount={nearbyBusinesses.length} />
        </div>
      </div>
    </div>
  );
};

// Separated Map Visualization component
const MapVisualization: React.FC<{ 
  userLocation: { lat: number; lng: number } | null; 
  businessCount: number 
}> = ({ userLocation, businessCount }) => {
  return (
    <div className="flex-grow bg-slate-100 p-4 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <MapPin size={48} className="mx-auto mb-4 text-mansablue opacity-50" />
        <p className="text-gray-500 mb-2">Interactive Map</p>
        <p className="text-xs text-gray-400 mb-4">
          {userLocation 
            ? `Showing ${businessCount} businesses near your location` 
            : 'Get your location to see businesses near you'}
        </p>
        
        {userLocation && (
          <p className="text-sm bg-mansablue/10 p-2 rounded text-mansablue">
            For a fully integrated map experience, a map integration (like Mapbox or Google Maps) would be added here
          </p>
        )}
      </div>
    </div>
  );
};

export default MapContainer;
