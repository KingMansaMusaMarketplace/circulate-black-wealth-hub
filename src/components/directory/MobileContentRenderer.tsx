
import React from 'react';
import SmartBusinessRecommendations from '@/components/discovery/SmartBusinessRecommendations';
import MapView from '@/components/MapView';
import MobileBusinessCard from './MobileBusinessCard';
import { Business } from '@/types/business';

interface MobileContentRendererProps {
  viewMode: 'recommendations' | 'grid' | 'list' | 'map';
  location: any;
  businesses: Business[];
  loading: boolean;
  onSelectBusiness: (id: number) => void;
  mapData: any[];
}

const MobileContentRenderer: React.FC<MobileContentRendererProps> = ({
  viewMode,
  location,
  businesses,
  loading,
  onSelectBusiness,
  mapData
}) => {
  const MobileBusinessList = () => (
    <div className="space-y-3 px-4">
      {businesses.map((business) => (
        <MobileBusinessCard
          key={business.id}
          {...business}
          onSelect={() => onSelectBusiness(business.id)}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {viewMode === 'recommendations' && (
        <div className="px-4">
          <SmartBusinessRecommendations userLocation={location} />
        </div>
      )}
      
      {viewMode === 'map' && (
        <div className="h-[60vh] mx-4 rounded-lg overflow-hidden">
          <MapView 
            businesses={mapData} 
            onSelectBusiness={onSelectBusiness}
          />
        </div>
      )}
      
      {(viewMode === 'grid' || viewMode === 'list') && (
        <>
          {loading ? (
            <div className="text-center py-8">Loading businesses...</div>
          ) : (
            <MobileBusinessList />
          )}
        </>
      )}
    </div>
  );
};

export default MobileContentRenderer;
