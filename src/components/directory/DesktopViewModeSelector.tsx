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
  error,
}) => {
  return (
    <div className="border border-white/10 bg-slate-900/40 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-sm text-slate-300">
          {loading ? (
            <span className="text-slate-400">Loading…</span>
          ) : (
            <>
              <span className="text-white font-medium">{totalCount}</span>{' '}
              <span className="text-slate-400">
                verified {totalCount === 1 ? 'business' : 'businesses'}
              </span>
              {location && <span className="text-slate-400"> near you</span>}
            </>
          )}
          {error && <span className="text-red-400 ml-2">Error loading data</span>}
        </div>

        <Tabs
          value={viewMode}
          onValueChange={(val) => setViewMode(val as 'recommendations' | 'grid' | 'list' | 'map')}
        >
          <TabsList className="bg-slate-800/60 border border-white/10">
            <TabsTrigger
              value="recommendations"
              className="data-[state=active]:bg-mansagold data-[state=active]:text-black text-slate-300"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              AI Picks
            </TabsTrigger>
            <TabsTrigger
              value="grid"
              className="data-[state=active]:bg-mansagold data-[state=active]:text-black text-slate-300"
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Grid
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-mansagold data-[state=active]:text-black text-slate-300"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="data-[state=active]:bg-mansagold data-[state=active]:text-black text-slate-300"
            >
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
