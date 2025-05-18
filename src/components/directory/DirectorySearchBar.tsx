
import React from 'react';
import { Search, SlidersHorizontal, Grid, List, Map, Navigation, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LocationData } from '@/hooks/use-location';

interface DirectorySearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  toggleFilters: () => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  userLocation?: LocationData | null;
  onGetLocation?: () => void;
  locationLoading?: boolean;
}

const DirectorySearchBar: React.FC<DirectorySearchBarProps> = ({
  searchTerm,
  onSearchChange,
  showFilters,
  toggleFilters,
  viewMode,
  setViewMode,
  userLocation,
  onGetLocation,
  locationLoading = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by business name, category, or location"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-gray-50"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleFilters}
            className={showFilters ? "border-mansablue text-mansablue" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          
          {onGetLocation && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onGetLocation}
              disabled={locationLoading}
              className="hidden sm:flex items-center gap-1"
            >
              {locationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              <span className="mr-1">Near Me</span>
              {userLocation && (
                <Badge variant="secondary" className="text-xs">Active</Badge>
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-100 px-3 py-2 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          View as:
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant={viewMode === 'grid' ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8"
          >
            <Grid className="h-4 w-4 mr-1" /> Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8"
          >
            <List className="h-4 w-4 mr-1" /> List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DirectorySearchBar;
