
import React from 'react';
import SmartBusinessRecommendations from '@/components/discovery/SmartBusinessRecommendations';
import MobileBusinessCard from './MobileBusinessCard';
import { Business } from '@/types/business';
import { getBusinessCardImage } from '@/utils/businessBanners';

// Lazy load MapView for better code splitting
const MapView = React.lazy(() => import('@/components/MapView'));

interface MobileContentRendererProps {
  viewMode: 'recommendations' | 'grid' | 'list' | 'map';
  location: any;
  businesses: Business[];
  loading: boolean;
  onSelectBusiness: (id: string) => void;
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
      {businesses.map((business) => {
        const cardImageUrl = getBusinessCardImage(business.id, business.bannerUrl) || business.imageUrl;
        return (
          <MobileBusinessCard
            key={business.id}
            {...business}
            imageUrl={cardImageUrl}
            onSelect={() => onSelectBusiness(business.id)}
          />
        );
      })}
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
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-full bg-muted">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          }>
            <MapView 
              businesses={mapData} 
              onSelectBusiness={onSelectBusiness}
            />
          </React.Suspense>
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
