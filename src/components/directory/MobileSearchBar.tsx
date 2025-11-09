
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
  Loader2,
  Settings,
  Sparkles
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SearchSuggestions from './SearchSuggestions';
import UserPreferencesDialog from './UserPreferencesDialog';
import { useSearchHistory } from '@/hooks/use-search-history';

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
  categories?: string[];
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
  totalResults = 0,
  categories = []
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addToSearchHistory } = useSearchHistory();

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    if (value.trim() && value.length > 2) {
      // Add to search history when user types
      addToSearchHistory(value, undefined, undefined, totalResults);
    }
  };

  const handleSearchSelect = (term: string) => {
    onSearchChange(term);
    setShowSuggestions(false);
  };

  const isNaturalLanguage = searchTerm.trim().split(/\s+/).length > 2;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40 md:hidden">
      {/* Main Search Row */}
      <div className="p-4 space-y-3">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Try 'soul food near me'"
                    className="pl-10 h-12 text-base rounded-lg pr-20"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setShowSuggestions(true);
                    }}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  {isNaturalLanguage && (
                    <Badge 
                      variant="secondary" 
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      AI
                    </Badge>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent 
                className="w-full p-0 mt-1" 
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <SearchSuggestions
                  onSearchSelect={handleSearchSelect}
                  onClose={() => setShowSuggestions(false)}
                />
              </PopoverContent>
            </Popover>
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
            
            <UserPreferencesDialog categories={categories}>
              <Button variant="outline" size="sm" className="h-9 px-3">
                <Settings className="h-4 w-4" />
                <span className="ml-1 text-xs">Prefs</span>
              </Button>
            </UserPreferencesDialog>
            
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
