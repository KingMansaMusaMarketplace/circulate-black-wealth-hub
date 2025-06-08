
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Grid3X3, List, MapPin } from 'lucide-react';

interface DesktopViewModeSelectorProps {
  viewMode: 'recommendations' | 'grid' | 'list' | 'map';
  setViewMode: (mode: 'recommendations' | 'grid' | 'list' | 'map') => void;
  loading: boolean;
  totalCount: number;
  location: any;
  error: any;
}

const DesktopViewModeSelector: React.FC<DesktopViewModeSelectorProps> = ({
  viewMode,
  setViewMode,
  loading,
  totalCount,
  location,
  error
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-gray-700">
          {loading ? 'Loading...' : `${totalCount} businesses found`}
          {location && ' near you'}
          {error && <span className="text-red-500 ml-2">Error loading data</span>}
        </div>
        
        <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as 'recommendations' | 'grid' | 'list' | 'map')}>
          <TabsList>
            <TabsTrigger value="recommendations">
              <TrendingUp className="h-4 w-4 mr-1" />
              AI Picks
            </TabsTrigger>
            <TabsTrigger value="grid">
              <Grid3X3 className="h-4 w-4 mr-1" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-1" />
              List
            </TabsTrigger>
            <TabsTrigger value="map">
              <MapPin className="h-4 w-4 mr-1" />
              Map
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default DesktopViewModeSelector;
