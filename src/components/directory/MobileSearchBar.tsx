
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Grid3X3, 
  List, 
  Map,
  X,
  Loader2
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showFilters: boolean;
  toggleFilters: () => void;
  viewMode: 'grid' | 'list' | 'map';
  setViewMode: (mode: 'grid' | 'list' | 'map') => void;
  userLocation: any;
  onGetLocation: () => void;
  locationLoading: boolean;
  totalResults?: number;
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  showFilters,
  toggleFilters,
  viewMode,
  setViewMode,
  userLocation,
  onGetLocation,
  locationLoading,
  totalResults = 0
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40 md:hidden">
      {/* Main Search Row */}
      <div className="p-4 space-y-3">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search businesses..."
              className="pl-10 h-12 text-base rounded-lg"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 p-0"
                onClick={() => onSearchChange('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFilters}
            className={`h-12 px-3 ${showFilters ? 'bg-mansablue text-white' : ''}`}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGetLocation}
              disabled={locationLoading}
              className="h-9 px-3"
            >
              {locationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span className="ml-1 text-xs">
                {userLocation ? 'Near me' : 'Location'}
              </span>
            </Button>
            
            {totalResults > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalResults} found
              </Badge>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-3 w-3" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="h-3 w-3" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="h-8 px-3"
            >
              <Map className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchBar;
