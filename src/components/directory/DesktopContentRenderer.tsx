
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import SmartBusinessRecommendations from '@/components/discovery/SmartBusinessRecommendations';
import BusinessGridView from './BusinessGridView';
import BusinessListView from './BusinessListView';
import MapView from '@/components/MapView';
import { Business } from '@/types/business';

interface DesktopContentRendererProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
  location: any;
  businesses: Business[];
  loading: boolean;
  onSelectBusiness: (id: number) => void;
  mapData: any[];
}

const DesktopContentRenderer: React.FC<DesktopContentRendererProps> = ({
  viewMode,
  setViewMode,
  location,
  businesses,
  loading,
  onSelectBusiness,
  mapData
}) => {
  return (
    <Tabs value={viewMode} onValueChange={(val) => setViewMode(val)}>
      <TabsContent value="recommendations" className="mt-0">
        <div className="space-y-8">
          <SmartBusinessRecommendations userLocation={location} />
          <div>
            <h2 className="text-2xl font-bold text-mansablue mb-4">All Businesses</h2>
            {loading ? (
              <div className="text-center py-8">Loading businesses...</div>
            ) : (
              <BusinessGridView 
                businesses={businesses} 
                onSelectBusiness={onSelectBusiness} 
              />
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="grid" className="mt-0">
        {loading ? (
          <div className="text-center py-8">Loading businesses...</div>
        ) : (
          <BusinessGridView 
            businesses={businesses} 
            onSelectBusiness={onSelectBusiness} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="list" className="mt-0">
        {loading ? (
          <div className="text-center py-8">Loading businesses...</div>
        ) : (
          <BusinessListView 
            businesses={businesses} 
            onSelectBusiness={onSelectBusiness} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="map" className="mt-0">
        <div className="h-[600px] rounded-lg overflow-hidden">
          <MapView 
            businesses={mapData} 
            onSelectBusiness={onSelectBusiness}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DesktopContentRenderer;
