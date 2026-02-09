import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { PropertySearchFilters } from '@/types/vacation-rental';

interface PremiumPropertySearchBarProps {
  filters: PropertySearchFilters;
  onFilterChange: (filters: Partial<PropertySearchFilters>) => void;
  onSearch: () => void;
}

const PremiumPropertySearchBar: React.FC<PremiumPropertySearchBarProps> = ({
  filters,
  onFilterChange,
  onSearch,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [locationInput, setLocationInput] = useState('');

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      onFilterChange({ checkIn: format(range.from, 'yyyy-MM-dd') });
    }
    if (range?.to) {
      onFilterChange({ checkOut: format(range.to, 'yyyy-MM-dd') });
    }
  };

  const handleLocationChange = (value: string) => {
    setLocationInput(value);
    // Parse city/state from input
    const parts = value.split(',').map(p => p.trim());
    if (parts.length >= 1) {
      onFilterChange({ city: parts[0] });
    }
    if (parts.length >= 2) {
      onFilterChange({ state: parts[1] });
    }
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
          {/* Location */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-white font-medium mb-1 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mansagold" />
              <Input
                placeholder="City, State..."
                value={locationInput}
                onChange={(e) => handleLocationChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-mansagold/50 h-11"
              />
            </div>
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
              <PopoverContent className="w-auto p-0 bg-slate-800 border-white/20" align="start">
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
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 border-white/10 hover:bg-white/10"
            >
              <SlidersHorizontal className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumPropertySearchBar;
