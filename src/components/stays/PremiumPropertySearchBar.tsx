import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { PropertySearchFilters, LISTING_MODES, ListingMode } from '@/types/vacation-rental';
import { supabase } from '@/integrations/supabase/client';

interface LocationSuggestion {
  city: string;
  state: string;
  count: number;
}

interface PremiumPropertySearchBarProps {
  filters: PropertySearchFilters;
  onFilterChange: (filters: Partial<PropertySearchFilters>) => void;
  onSearch: () => void;
  onOpenFilters?: () => void;
}

const PremiumPropertySearchBar: React.FC<PremiumPropertySearchBarProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onOpenFilters,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [allLocations, setAllLocations] = useState<LocationSuggestion[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all available locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('vacation_properties')
          .select('city, state')
          .eq('is_active', true);

        if (error) throw error;

        // Group by city/state and count
        const locationMap = new Map<string, LocationSuggestion>();
        data?.forEach((property) => {
          if (property.city && property.state) {
            const key = `${property.city}-${property.state}`;
            const existing = locationMap.get(key);
            if (existing) {
              existing.count++;
            } else {
              locationMap.set(key, {
                city: property.city,
                state: property.state,
                count: 1,
              });
            }
          }
        });

        const locations = Array.from(locationMap.values()).sort((a, b) => 
          a.city.localeCompare(b.city)
        );
        setAllLocations(locations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (locationInput.trim().length > 0) {
      setLoadingSuggestions(true);
      const searchTerm = locationInput.toLowerCase();
      const filtered = allLocations.filter(
        (loc) =>
          loc.city.toLowerCase().includes(searchTerm) ||
          loc.state.toLowerCase().includes(searchTerm)
      );
      setSuggestions(filtered);
      setLoadingSuggestions(false);
    } else {
      setSuggestions(allLocations);
    }
  }, [locationInput, allLocations]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      onFilterChange({ checkIn: format(range.from, 'yyyy-MM-dd') });
    }
    if (range?.to) {
      onFilterChange({ checkOut: format(range.to, 'yyyy-MM-dd') });
    }
  };

  const handleLocationInputChange = (value: string) => {
    setLocationInput(value);
    setShowSuggestions(true);
    // Parse city/state from input
    const parts = value.split(',').map(p => p.trim());
    if (parts.length >= 1) {
      onFilterChange({ city: parts[0] });
    }
    if (parts.length >= 2) {
      onFilterChange({ state: parts[1] });
    }
  };

  const handleSelectLocation = (location: LocationSuggestion) => {
    const displayValue = `${location.city}, ${location.state}`;
    setLocationInput(displayValue);
    onFilterChange({ city: location.city, state: location.state });
    setShowSuggestions(false);
  };

  const handleLocationFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative max-w-4xl mx-auto"
    >
      {/* Animated glow effect */}
      <div 
        className={cn(
          "absolute -inset-1 rounded-2xl transition-all duration-500",
          isFocused 
            ? "bg-gradient-to-r from-mansagold/40 via-amber-500/30 to-mansagold/40 blur-xl opacity-100" 
            : "bg-gradient-to-r from-mansablue/20 via-blue-500/20 to-mansagold/20 blur-lg opacity-60"
        )}
      />
      
      <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        {/* AI Badge */}
        <div className="absolute -top-3 left-6">
          <Badge className="bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 font-semibold px-3 py-1 text-xs flex items-center gap-1 shadow-lg">
            <Sparkles className="h-3 w-3" />
            Smart Search
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-2">
          {/* Stay Type Toggle */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 self-start md:self-end mb-2 md:mb-0">
            {LISTING_MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => onFilterChange({ listingMode: filters.listingMode === mode.value ? undefined : mode.value as ListingMode })}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  filters.listingMode === mode.value
                    ? 'bg-mansagold text-slate-900'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-2">
          {/* Location with Autocomplete */}
          <div className="flex-1 min-w-[200px] relative" ref={dropdownRef}>
            <label className="text-xs text-white font-medium mb-1 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mansagold z-10" />
              <Input
                ref={inputRef}
                placeholder="Search city or state..."
                value={locationInput}
                onChange={(e) => handleLocationInputChange(e.target.value)}
                onFocus={handleLocationFocus}
                onBlur={() => setIsFocused(false)}
                className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-mansagold/50 h-11"
              />
            </div>

            {/* Location Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-800 border border-white/20 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
                >
                  {loadingSuggestions ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 text-mansagold animate-spin" />
                    </div>
                  ) : suggestions.length > 0 ? (
                    <ul className="py-2">
                      {suggestions.map((location, index) => (
                        <li key={`${location.city}-${location.state}-${index}`}>
                          <button
                            type="button"
                            onClick={() => handleSelectLocation(location)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-700/80 transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              <MapPin className="w-4 h-4 text-mansagold/70 group-hover:text-mansagold" />
                              <div>
                                <span className="text-white font-medium">{location.city}</span>
                                <span className="text-white/60">, {location.state}</span>
                              </div>
                            </div>
                            <span className="text-xs text-white/40 bg-white/10 px-2 py-1 rounded-full">
                              {location.count} {location.count === 1 ? 'property' : 'properties'}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-4 px-4 text-center text-white/60">
                      <MapPin className="w-6 h-6 mx-auto mb-2 text-white/40" />
                      <p className="text-sm">No locations found</p>
                      <p className="text-xs text-white/40 mt-1">Try a different search term</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dates */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-white font-medium mb-1 block">Dates</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left h-11 bg-slate-800/50 border-white/10 hover:bg-slate-700/50",
                    !dateRange ? "text-white/70" : "text-white"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4 text-mansagold" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <span className="text-white">
                        {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
                      </span>
                    ) : (
                      <span className="text-white">{format(dateRange.from, 'MMM d, yyyy')}</span>
                    )
                  ) : (
                    <span className="text-white/70">Check in - Check out</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-white/20 z-50" align="start">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto bg-slate-800 text-white [&_.rdp-day]:text-white [&_.rdp-day_button]:text-white [&_.rdp-head_cell]:text-white/80 [&_.rdp-caption]:text-white [&_.rdp-nav_button]:text-white [&_.rdp-day_disabled]:text-white/30"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="w-full md:w-32">
            <label className="text-xs text-white font-medium mb-1 block">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mansagold" />
              <Input
                type="number"
                min={1}
                max={20}
                placeholder="2"
                value={filters.guests || ''}
                onChange={(e) => onFilterChange({ guests: parseInt(e.target.value) || undefined })}
                className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-mansagold/50 h-11"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end gap-2">
            <Button
              onClick={onSearch}
              size="lg"
              className="bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 hover:from-amber-400 hover:to-mansagold font-bold px-6 h-11 shadow-lg shadow-mansagold/30 transition-all duration-300 hover:shadow-mansagold/50 hover:scale-105"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onOpenFilters}
                    className="h-11 w-11 border-white/10 hover:bg-white/10 hover:border-mansagold/50"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-slate-800 border-white/20 text-white">
                  <p>Filters</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumPropertySearchBar;
