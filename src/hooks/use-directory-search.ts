
import { useState, useMemo } from 'react';
import { Business } from '@/types/business';
import { BusinessFilters } from '@/lib/api/directory/types';

export function useDirectorySearch(businesses: Business[]) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<BusinessFilters>({});

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(businesses.map(b => b.category)));
    return ['All', ...uniqueCategories];
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    let filtered = businesses;

    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterOptions.category && filterOptions.category !== 'All') {
      filtered = filtered.filter(business => business.category === filterOptions.category);
    }

    if (filterOptions.minRating) {
      filtered = filtered.filter(business => business.rating >= filterOptions.minRating!);
    }

    if (filterOptions.featured) {
      filtered = filtered.filter(business => business.isFeatured);
    }

    return filtered;
  }, [businesses, searchTerm, filterOptions]);

  const mapData = useMemo(() => {
    return filteredBusinesses.map(business => ({
      id: business.id,
      name: business.name,
      lat: business.lat,
      lng: business.lng,
      category: business.category,
      distanceValue: business.distanceValue,
      distance: business.distance
    }));
  }, [filteredBusinesses]);

  const handleFilterChange = (newFilters: Partial<BusinessFilters>) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
  };

  return {
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
    categories,
    filteredBusinesses,
    mapData
  };
}
