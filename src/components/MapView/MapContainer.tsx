
import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { MapContainerProps } from './types';
import MapboxApiKey from './MapboxApiKey';
import MapboxMap from './MapboxMap';

const MapContainer: React.FC<MapContainerProps> = ({ 
  userLocation, 
  nearbyBusinesses,
  loading, 
  error, 
  children,
  onSelectBusiness
}) => {
  const [mapboxApiKey, setMapboxApiKey] = useState<string>('');

  return (
    <div className="relative mt-4 border border-gray-200 rounded-lg overflow-hidden">
      <div className="w-full h-[500px] bg-slate-100 flex flex-col">
        {/* Map Header with Location Controls */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-mansablue">Nearby Black-Owned Businesses</h3>
              <p className="text-sm text-gray-500">
                {userLocation ? `${nearbyBusinesses.length} businesses found near you` : `Find businesses near you`}
              </p>
            </div>
          </div>
          
          <MapboxApiKey onApiKeySet={setMapboxApiKey} />
        </div>
        
        {/* Main Map Content */}
        <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Business List */}
          <div className="w-full md:w-1/3 p-4 bg-white border-r border-gray-200 overflow-y-auto">
            {error ? (
              <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Location Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-mansablue animate-spin mr-3" />
                <p>Detecting your location...</p>
              </div>
            ) : (
              <>
                {children}
              </>
            )}
          </div>
          
          {/* Right Side - Interactive Mapbox Map */}
          <div className="flex-grow">
            {mapboxApiKey ? (
              <MapboxMap
                apiKey={mapboxApiKey}
                userLocation={userLocation}
                businesses={nearbyBusinesses}
                onBusinessClick={onSelectBusiness}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Configure Mapbox API key above to enable interactive map</p>
                  <p className="text-sm text-gray-500">The map will show your location and nearby businesses</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default MapContainer;
