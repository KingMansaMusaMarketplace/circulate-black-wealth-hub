
import React from 'react';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
import { MapContainerProps } from './types';
import { cn } from '@/lib/utils';

const MapContainer: React.FC<MapContainerProps> = ({ 
  userLocation, 
  nearbyBusinesses,
  loading, 
  error, 
  children 
}) => {
  const businessCount = nearbyBusinesses.length;

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
          {userLocation && (
            <div className="bg-mansablue/10 px-2 py-1 rounded text-sm text-mansablue">
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                <span>Location active</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Map Content */}
        <div className="flex-grow overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Distances & Business List */}
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
          
          {/* Right Side - Map Visualization */}
          <MapVisualization 
            userLocation={userLocation} 
            businessCount={businessCount} 
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

// Separated Map Visualization component
const MapVisualization: React.FC<{ 
  userLocation: { lat: number; lng: number } | null; 
  businessCount: number;
  loading: boolean;
  error: string | null;
}> = ({ userLocation, businessCount, loading, error }) => {
  return (
    <div className={cn(
      "flex-grow p-4 flex items-center justify-center", 
      userLocation ? "bg-gray-100" : "bg-slate-50"
    )}>
      <div className="text-center max-w-md mx-auto">
        {loading ? (
          <div className="py-8 flex flex-col items-center">
            <Loader2 size={48} className="mx-auto mb-4 animate-spin text-mansablue opacity-70" />
            <p className="text-gray-600">Loading map data...</p>
          </div>
        ) : error ? (
          <div className="py-8 flex flex-col items-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500 opacity-70" />
            <p className="text-red-600 mb-2">Unable to load map</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="relative h-40 bg-gray-100 rounded-md mb-4 overflow-hidden">
                {/* Simulated map visualization */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-gray-200">
                  {userLocation && (
                    <>
                      {/* Roads */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300"></div>
                      <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-gray-300"></div>
                      <div className="absolute top-0 bottom-0 right-1/4 w-0.5 bg-gray-300"></div>
                      
                      {/* User location */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full relative z-10"></div>
                      </div>
                      
                      {/* Business pins */}
                      {businessCount > 0 && (
                        <>
                          <div className="absolute top-[30%] left-[60%]">
                            <MapPin className="h-4 w-4 text-mansagold" />
                          </div>
                          {businessCount > 1 && (
                            <div className="absolute top-[40%] left-[30%]">
                              <MapPin className="h-4 w-4 text-mansagold" />
                            </div>
                          )}
                          {businessCount > 2 && (
                            <div className="absolute top-[60%] left-[45%]">
                              <MapPin className="h-4 w-4 text-mansagold" />
                            </div>
                          )}
                          {businessCount > 3 && (
                            <div className="absolute top-[70%] left-[65%]">
                              <MapPin className="h-4 w-4 text-mansagold" />
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Radius circle */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-mansablue/30"></div>
                    </>
                  )}
                </div>
              </div>
              
              <p className="text-mansablue font-medium mb-2">
                {userLocation
                  ? businessCount > 0 
                    ? `${businessCount} businesses near you` 
                    : "No businesses found nearby"
                  : "Get your location to see nearby businesses"}
              </p>
              
              {userLocation && businessCount > 0 && (
                <div className="text-sm text-gray-600 mb-4">
                  Click on a business in the list to see more details
                </div>
              )}
            </div>
            
            {!userLocation && (
              <p className="text-sm bg-mansablue/10 p-2 rounded text-mansablue">
                Use the refresh location button to detect your position
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MapContainer;
