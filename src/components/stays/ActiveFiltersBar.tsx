import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PropertySearchFilters, PROPERTY_TYPES, AMENITIES_LIST } from '@/types/vacation-rental';
import { cn } from '@/lib/utils';

interface ActiveFiltersBarProps {
  filters: PropertySearchFilters;
  onFilterChange: (filters: Partial<PropertySearchFilters>) => void;
  onClearAll: () => void;
  className?: string;
}

const ActiveFiltersBar: React.FC<ActiveFiltersBarProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  className,
}) => {
  const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];

  // Property Type
  if (filters.propertyType) {
    const typeLabel = PROPERTY_TYPES.find(t => t.value === filters.propertyType)?.label || filters.propertyType;
    activeFilters.push({
      key: 'propertyType',
      label: typeLabel,
      onRemove: () => onFilterChange({ propertyType: undefined }),
    });
  }

  // Price Range
  if (filters.minPrice || filters.maxPrice) {
    const priceLabel = filters.minPrice && filters.maxPrice
      ? `$${filters.minPrice} - $${filters.maxPrice}`
      : filters.minPrice
      ? `$${filters.minPrice}+`
      : `Up to $${filters.maxPrice}`;
    activeFilters.push({
      key: 'price',
      label: priceLabel,
      onRemove: () => onFilterChange({ minPrice: undefined, maxPrice: undefined }),
    });
  }

  // Bedrooms
  if (filters.bedrooms) {
    activeFilters.push({
      key: 'bedrooms',
      label: `${filters.bedrooms}+ beds`,
      onRemove: () => onFilterChange({ bedrooms: undefined }),
    });
  }

  // Bathrooms
  if (filters.bathrooms) {
    activeFilters.push({
      key: 'bathrooms',
      label: `${filters.bathrooms}+ baths`,
      onRemove: () => onFilterChange({ bathrooms: undefined }),
    });
  }

  // Pets Allowed
  if (filters.petsAllowed) {
    activeFilters.push({
      key: 'pets',
      label: 'Pets OK',
      onRemove: () => onFilterChange({ petsAllowed: undefined }),
    });
  }

  // Instant Book
  if (filters.instantBook) {
    activeFilters.push({
      key: 'instant',
      label: 'Instant Book',
      onRemove: () => onFilterChange({ instantBook: undefined }),
    });
  }

  // Verified Host
  if (filters.verifiedOnly) {
    activeFilters.push({
      key: 'verified',
      label: 'Verified Host',
      onRemove: () => onFilterChange({ verifiedOnly: undefined }),
    });
  }

  // Amenities
  if (filters.amenities && filters.amenities.length > 0) {
    filters.amenities.forEach(amenityId => {
      const amenityLabel = AMENITIES_LIST.find(a => a.id === amenityId)?.label || amenityId;
      activeFilters.push({
        key: `amenity-${amenityId}`,
        label: amenityLabel,
        onRemove: () => onFilterChange({ 
          amenities: filters.amenities?.filter(a => a !== amenityId) 
        }),
      });
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className="text-sm text-white/60 mr-1">Filters:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="outline"
          className="bg-mansagold/20 border-mansagold/40 text-mansagold gap-1 pr-1 hover:bg-mansagold/30 transition-colors"
        >
          {filter.label}
          <button
            onClick={filter.onRemove}
            className="ml-1 p-0.5 rounded-full hover:bg-mansagold/40 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-white/60 hover:text-white text-xs h-7 px-2"
        >
          Clear all
        </Button>
      )}
    </div>
  );
};

export default ActiveFiltersBar;
