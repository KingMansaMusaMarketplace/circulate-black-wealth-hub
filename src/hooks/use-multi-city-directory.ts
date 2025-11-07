import { useState, useMemo } from 'react';
import { Business } from '@/types/business';
import { BusinessFilters } from '@/lib/api/directory/types';
import { cities } from '@/components/directory/CitySelector';

// Mock data for different cities - in production this would come from API
const generateCityBusinesses = (cityId: string, baseBusinesses: Business[]): Business[] => {
  if (cityId === 'all') return baseBusinesses;
  
  const cityData = cities.find(city => city.id === cityId);
  if (!cityData) return [];

  // Create city-specific variations of businesses
  return baseBusinesses.map((business, index) => ({
    ...business,
    id: `${cityId === 'chicago' ? '1' : cityId === 'houston' ? '2' : cityId === 'washington-dc' ? '3' : '4'}${index.toString().padStart(3, '0')}`,
    city: cityData.name,
    state: cityData.state,
    // Adjust coordinates based on city
    lat: getCityCoordinates(cityId).lat + (Math.random() - 0.5) * 0.1,
    lng: getCityCoordinates(cityId).lng + (Math.random() - 0.5) * 0.1,
  }));
};

const getCityCoordinates = (cityId: string) => {
  const coordinates = {
    'chicago': { lat: 41.8781, lng: -87.6298 },
    'atlanta': { lat: 33.7490, lng: -84.3880 },
    'houston': { lat: 29.7604, lng: -95.3698 },
    'washington-dc': { lat: 38.9072, lng: -77.0369 },
    'detroit': { lat: 42.3314, lng: -83.0458 },
  };
  return coordinates[cityId as keyof typeof coordinates] || coordinates.atlanta;
};

export const useMultiCityDirectory = (baseBusinesses: Business[]) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<BusinessFilters>({
    category: undefined,
    minRating: 0,
    minDiscount: 0,
    featured: false,
    distance: 0,
  });

  // Generate businesses for selected city
  const cityBusinesses = useMemo(() => {
    return generateCityBusinesses(selectedCity, baseBusinesses);
  }, [selectedCity, baseBusinesses]);

  // Filter businesses based on search and filters
  const filteredBusinesses = useMemo(() => {
    let filtered = cityBusinesses;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchLower) ||
        business.category.toLowerCase().includes(searchLower) ||
        business.description?.toLowerCase().includes(searchLower) ||
        business.address.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filterOptions.category && filterOptions.category !== 'all') {
      filtered = filtered.filter(business => business.category === filterOptions.category);
    }

    // Apply rating filter
    if (filterOptions.minRating && filterOptions.minRating > 0) {
      filtered = filtered.filter(business => business.rating >= filterOptions.minRating!);
    }

    // Apply discount filter
    if (filterOptions.minDiscount && filterOptions.minDiscount > 0) {
      filtered = filtered.filter(business => business.discountValue >= filterOptions.minDiscount!);
    }

    // Apply featured filter
    if (filterOptions.featured) {
      filtered = filtered.filter(business => business.isFeatured);
    }

    return filtered;
  }, [cityBusinesses, searchTerm, filterOptions]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(cityBusinesses.map(business => business.category))];
    return uniqueCategories.sort();
  }, [cityBusinesses]);

  // Convert businesses to map data format
  const mapData = useMemo(() => {
    return filteredBusinesses.map(business => ({
      id: business.id,
      name: business.name,
      lat: business.lat,
      lng: business.lng,
      category: business.category,
      rating: business.rating,
      discount: business.discount,
    }));
  }, [filteredBusinesses]);

  const handleFilterChange = (newFilters: Partial<BusinessFilters>) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    // Reset filters when changing cities
    setFilterOptions({
      category: undefined,
      minRating: 0,
      minDiscount: 0,
      featured: false,
      distance: 0,
    });
  };

  return {
    selectedCity,
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
    handleCityChange,
    categories,
    filteredBusinesses,
    mapData,
    totalBusinesses: cityBusinesses.length,
  };
};