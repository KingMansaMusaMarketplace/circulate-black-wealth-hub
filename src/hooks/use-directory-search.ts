import { useState, useEffect, useCallback } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { Business } from '@/types/business';
import { BusinessFilters } from '@/lib/api/directory/types';
import { calculateDistance } from '@/lib/api/directory/utils';

export type { BusinessFilters as FilterOptions };

export function useDirectorySearch(businesses: Business[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState<BusinessFilters>({
    category: 'all',
    distance: 0, // 0 means any distance
    minRating: 0,   // 0 means any rating
    minDiscount: 0  // 0 means any discount
  });
  
  // Pagination state - updated to show more items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16); // Show 16 items per page
  
  // User location state
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [businessesWithDistance, setBusinessesWithDistance] = useState<Business[]>([]);
  
  const location = useRouterLocation();
  
  useEffect(() => {
    // Check if there's a search parameter in the URL
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchTerm(search);
    }
    
    // Reset to page 1 when search params change
    setCurrentPage(1);
  }, [location]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleFilterChange = (newFilters: Partial<BusinessFilters>) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  const updateUserLocation = useCallback((latitude: number, longitude: number) => {
    setUserLocation({ lat: latitude, lng: longitude });
    
    // Update businesses with distance from user location
    const updatedBusinesses = businesses.map(business => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        business.lat, 
        business.lng
      );
      
      return {
        ...business,
        distanceValue: distance,
        distance: distance.toFixed(1) + ' mi'
      };
    });
    
    // Sort by distance
    updatedBusinesses.sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0));
    setBusinessesWithDistance(updatedBusinesses);
    
    // Reset to page 1 when location changes
    setCurrentPage(1);
  }, [businesses]);

  // Use effect to update business distances if user location changes or businesses change
  useEffect(() => {
    if (userLocation && businesses.length > 0) {
      updateUserLocation(userLocation.lat, userLocation.lng);
    }
  }, [businesses, userLocation, updateUserLocation]);

  // Extract unique categories from the businesses
  const categories = [...new Set(businesses.map(b => b.category))].sort();
  
  // Filter businesses based on search term and filters
  const filteredBusinesses = (userLocation ? businessesWithDistance : businesses).filter(business => {
    // Search term filter - more comprehensive search including name, category, and address
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      business.name.toLowerCase().includes(searchLower) || 
      business.category.toLowerCase().includes(searchLower) || 
      (business.address && business.address.toLowerCase().includes(searchLower));
    
    // Category filter
    const matchesCategory = filterOptions.category === 'all' || business.category === filterOptions.category;
    
    // Distance filter
    const matchesDistance = filterOptions.distance === 0 || 
                          (business.distanceValue !== undefined && business.distanceValue <= filterOptions.distance);
    
    // Rating filter
    const matchesRating = business.rating >= (filterOptions.minRating || 0);
    
    // Discount filter
    const matchesDiscount = business.discountValue >= (filterOptions.minDiscount || 0);
    
    return matchesSearch && matchesCategory && matchesDistance && matchesRating && matchesDiscount;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedBusinesses = filteredBusinesses.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create map data for MapView
  const mapData = (userLocation ? businessesWithDistance : businesses).map(b => ({
    id: b.id,
    name: b.name,
    lat: b.lat,
    lng: b.lng,
    category: b.category,
    distanceValue: b.distanceValue,
    distance: b.distance
  }));

  return {
    searchTerm,
    setSearchTerm,
    filterOptions,
    handleFilterChange,
    categories,
    filteredBusinesses,
    paginatedBusinesses,
    mapData,
    userLocation,
    updateUserLocation,
    pagination: {
      currentPage,
      totalPages,
      itemsPerPage,
      setItemsPerPage,
      handlePageChange
    }
  };
}
