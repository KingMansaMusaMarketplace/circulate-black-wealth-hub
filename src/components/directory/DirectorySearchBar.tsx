
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid, List, Map, Navigation, Loader2, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LocationData } from '@/hooks/location/types';
import { searchBusinesses } from '@/lib/api/directory-api';
import { Business } from '@/types/business';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/use-debounce';
import { useSemanticSearch } from '@/hooks/use-semantic-search';

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
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { parseSearchQuery, isParsing } = useSemanticSearch();
  
  // Detect if query is natural language (more than 2 words)
  const isNaturalLanguageQuery = debouncedSearchTerm.trim().split(/\s+/).length > 2;
  
  // Search as you type with semantic search support
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.length >= 2) {
        setIsSearching(true);
        try {
          let results: Business[];
          
          // Use semantic search for natural language queries
          if (isNaturalLanguageQuery) {
            const parsed = await parseSearchQuery(debouncedSearchTerm, null);
            
            if (parsed) {
              // Use semantic filters
              results = await searchBusinesses(parsed.searchTerm, {
                category: parsed.category,
                minRating: parsed.rating,
                distance: parsed.distance,
                discount: parsed.discount
              });
            } else {
              // Fallback to basic search
              results = await searchBusinesses(debouncedSearchTerm);
            }
          } else {
            // Basic keyword search
            results = await searchBusinesses(debouncedSearchTerm);
          }
          
          setSearchResults(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowSearchResults(false);
      }
    };
    
    performSearch();
  }, [debouncedSearchTerm, isNaturalLanguageQuery, parseSearchQuery, userLocation]);

  // Handle clearing search
  const handleClearSearch = () => {
    onSearchChange('');
    setShowSearchResults(false);
  };
  
  // Handle clicking outside to close search results
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchResults(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Handle clicking on search result
  const handleSelectBusiness = (business: Business) => {
    navigate(`/business/${business.id}`);
    setShowSearchResults(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-grow" onClick={e => e.stopPropagation()}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Try 'soul food near me' or 'brunch spots downtown'"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-gray-50 pr-10"
            />
            {isNaturalLanguageQuery && (
              <Badge 
                variant="secondary" 
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs gap-1"
                title="AI-powered semantic search active"
              >
                <Sparkles className="h-3 w-3" />
                AI
              </Badge>
            )}
            {searchTerm && (
              <Button
                variant="ghost" 
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {/* Search results dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {searchResults.map((business) => (
                  <div 
                    key={business.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    onClick={() => handleSelectBusiness(business)}
                  >
                    <div className="flex items-start">
                      <div className="h-12 w-12 bg-gray-100 rounded mr-3 flex-shrink-0 overflow-hidden">
                        {business.imageUrl ? (
                          <img 
                            src={business.imageUrl} 
                            alt={business.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://placehold.co/100x100/e0e0e0/808080?text=${business.name.charAt(0)}`;
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-gray-500 font-bold">{business.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{business.name}</div>
                        <div className="text-xs text-gray-500">{business.category}</div>
                        {business.address && (
                          <div className="text-xs text-gray-400 mt-1">{business.address}</div>
                        )}
                      </div>
                      {business.isFeatured && (
                        <Badge variant="outline" className="ml-auto text-mansagold border-mansagold">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showSearchResults && searchResults.length === 0 && searchTerm && !isSearching && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <p className="text-sm text-gray-500 text-center">No businesses found</p>
              </div>
            )}
            
            {(isSearching || isParsing) && (
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
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
