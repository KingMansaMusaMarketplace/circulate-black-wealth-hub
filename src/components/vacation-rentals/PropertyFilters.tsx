
import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PropertySearchFilters, PROPERTY_TYPES, AMENITIES_LIST, LISTING_MODES } from '@/types/vacation-rental';
import { DateRange } from 'react-day-picker';

interface PropertyFiltersProps {
  filters: PropertySearchFilters;
  onFilterChange: (filters: Partial<PropertySearchFilters>) => void;
  onSearch: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (filters.checkIn && filters.checkOut) {
      return {
        from: new Date(filters.checkIn),
        to: new Date(filters.checkOut),
      };
    }
    return undefined;
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      onFilterChange({
        checkIn: format(range.from, 'yyyy-MM-dd'),
        checkOut: format(range.to, 'yyyy-MM-dd'),
      });
    }
  };

  const clearFilters = () => {
    onFilterChange({
      city: undefined,
      state: undefined,
      checkIn: undefined,
      checkOut: undefined,
      guests: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      propertyType: undefined,
      amenities: undefined,
      petsAllowed: undefined,
      instantBook: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      listingMode: undefined,
    });
    setDateRange(undefined);
  };

  const activeFilterCount = [
    filters.city,
    filters.checkIn,
    filters.guests,
    filters.minPrice || filters.maxPrice,
    filters.propertyType,
    filters.amenities?.length,
    filters.petsAllowed,
    filters.instantBook,
    filters.bedrooms,
    filters.bathrooms,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Location */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mansagold" />
          <Input
            placeholder="Where are you going?"
            value={filters.city || ''}
            onChange={(e) => onFilterChange({ city: e.target.value || undefined })}
            className="pl-10 bg-black/80 border-2 border-mansagold/50 text-white font-medium placeholder:text-white/70 focus:border-mansagold"
          />
        </div>

        {/* Date picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full md:w-[280px] justify-start text-left font-medium bg-black/80 border-2 border-mansagold/50 hover:bg-slate-800 hover:border-mansagold',
                !dateRange ? 'text-white/70' : 'text-white'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-mansagold" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
                  </>
                ) : (
                  format(dateRange.from, 'MMM d, yyyy')
                )
              ) : (
                <span>Check-in — Check-out</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-slate-900 border-white/20" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateChange}
              numberOfMonths={2}
              disabled={(date) => date < new Date()}
              className="pointer-events-auto bg-slate-900 text-white"
            />
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <div className="relative w-full md:w-[140px]">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mansagold z-10" />
          <Select
            value={filters.guests?.toString() || ''}
            onValueChange={(val) => onFilterChange({ guests: val ? parseInt(val) : undefined })}
          >
            <SelectTrigger className="pl-10 bg-black/80 border-2 border-mansagold/50 text-white font-medium hover:border-mansagold">
              <SelectValue placeholder="Guests" className="text-white/70" />
            </SelectTrigger>
            <SelectContent className="bg-black border-2 border-mansagold">
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((num) => (
                <SelectItem key={num} value={num.toString()} className="text-white font-medium hover:bg-mansagold/20">
                  {num}+ guest{num !== 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filters button */}
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative bg-black/80 border-2 border-mansagold/50 text-white font-medium hover:bg-slate-800 hover:border-mansagold">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-mansagold" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-mansagold text-black text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-slate-900 border-white/10">
            <SheetHeader>
              <SheetTitle className="text-white">Filters</SheetTitle>
              <SheetDescription className="text-white/60">
                Refine your search to find the perfect stay
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-6">
              {/* Property Type */}
              <div className="space-y-3">
                <Label className="text-white">Property Type</Label>
                <Select
                  value={filters.propertyType || ''}
                  onValueChange={(val) => onFilterChange({ propertyType: val as any || undefined })}
                >
                  <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20">
                    <SelectItem value="" className="text-white hover:bg-slate-800">Any type</SelectItem>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-800">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-white">Price Range (per night)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => onFilterChange({ minPrice: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-24 bg-slate-800 border-white/20 text-white placeholder:text-white/50"
                  />
                  <span className="text-white/60">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => onFilterChange({ maxPrice: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-24 bg-slate-800 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-3">
                <Label className="text-white">Bedrooms</Label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      variant={filters.bedrooms === num ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onFilterChange({ bedrooms: filters.bedrooms === num ? undefined : num })}
                      className={filters.bedrooms === num ? 'bg-mansagold text-black' : 'border-white/20 text-white hover:bg-slate-800'}
                    >
                      {num === 0 ? 'Any' : `${num}+`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="space-y-3">
                <Label className="text-white">Bathrooms</Label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <Button
                      key={num}
                      variant={filters.bathrooms === num ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onFilterChange({ bathrooms: filters.bathrooms === num ? undefined : num })}
                      className={filters.bathrooms === num ? 'bg-mansagold text-black' : 'border-white/20 text-white hover:bg-slate-800'}
                    >
                      {num === 0 ? 'Any' : `${num}+`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Booking Options */}
              <div className="space-y-3">
                <Label className="text-white">Booking Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="instant-book"
                      checked={filters.instantBook || false}
                      onCheckedChange={(checked) => 
                        onFilterChange({ instantBook: checked ? true : undefined })
                      }
                      className="border-white/30"
                    />
                    <label htmlFor="instant-book" className="text-sm cursor-pointer text-white">
                      Instant Book
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pets-allowed"
                      checked={filters.petsAllowed || false}
                      onCheckedChange={(checked) => 
                        onFilterChange({ petsAllowed: checked ? true : undefined })
                      }
                      className="border-white/30"
                    />
                    <label htmlFor="pets-allowed" className="text-sm cursor-pointer text-white">
                      Pets Allowed
                    </label>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <Label className="text-white">Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES_LIST.slice(0, 10).map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={filters.amenities?.includes(amenity.id) || false}
                        onCheckedChange={(checked) => {
                          const current = filters.amenities || [];
                          const updated = checked
                            ? [...current, amenity.id]
                            : current.filter((a) => a !== amenity.id);
                          onFilterChange({ 
                            amenities: updated.length > 0 ? updated : undefined 
                          });
                        }}
                        className="border-white/30"
                      />
                      <label htmlFor={amenity.id} className="text-sm cursor-pointer text-white">
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button variant="outline" onClick={clearFilters} className="flex-1 border-white/20 text-white hover:bg-slate-800">
                Clear All
              </Button>
              <Button onClick={() => { onSearch(); setIsFiltersOpen(false); }} className="flex-1 bg-mansagold text-black hover:bg-mansagold/90">
                Show Results
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Search button */}
        <Button onClick={onSearch} className="bg-mansagold text-black hover:bg-mansagold/90">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Active filter pills */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.city && (
            <FilterPill
              label={filters.city}
              onRemove={() => onFilterChange({ city: undefined })}
            />
          )}
          {dateRange?.from && dateRange?.to && (
            <FilterPill
              label={`${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`}
              onRemove={() => {
                setDateRange(undefined);
                onFilterChange({ checkIn: undefined, checkOut: undefined });
              }}
            />
          )}
          {filters.guests && (
            <FilterPill
              label={`${filters.guests}+ guests`}
              onRemove={() => onFilterChange({ guests: undefined })}
            />
          )}
          {filters.propertyType && (
            <FilterPill
              label={PROPERTY_TYPES.find(t => t.value === filters.propertyType)?.label || filters.propertyType}
              onRemove={() => onFilterChange({ propertyType: undefined })}
            />
          )}
          {filters.petsAllowed && (
            <FilterPill
              label="Pets allowed"
              onRemove={() => onFilterChange({ petsAllowed: undefined })}
            />
          )}
          {filters.instantBook && (
            <FilterPill
              label="Instant Book"
              onRemove={() => onFilterChange({ instantBook: undefined })}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-white/60 hover:text-white"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

const FilterPill: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <div className="flex items-center gap-1 px-3 py-1 bg-slate-800 border border-white/20 rounded-full text-sm text-white">
    <span>{label}</span>
    <button
      onClick={onRemove}
      className="ml-1 hover:text-mansagold transition-colors"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
);

export default PropertyFilters;
