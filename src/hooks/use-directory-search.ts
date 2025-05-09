
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Business, businessCategories } from '@/data/businessData';
import { FilterOptions } from '@/components/DirectoryFilter';

export function useDirectorySearch(businesses: Business[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: 'all',
    distance: 0, // 0 means any distance
    rating: 0,   // 0 means any rating
    discount: 0  // 0 means any discount
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  
  const location = useLocation();
  
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

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  // Get unique categories from our predefined list and any that appear in the data but aren't in our list
  const categories = [...businessCategories];
  
  // Filter businesses based on search term and filters
  const filteredBusinesses = businesses.filter(business => {
    // Search term filter
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = filterOptions.category === 'all' || business.category === filterOptions.category;
    
    // Distance filter
    const matchesDistance = filterOptions.distance === 0 || business.distanceValue <= filterOptions.distance;
    
    // Rating filter
    const matchesRating = business.rating >= filterOptions.rating;
    
    // Discount filter
    const matchesDiscount = business.discountValue >= filterOptions.discount;
    
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
  const mapData = businesses.map(b => ({
    id: b.id,
    name: b.name,
    lat: b.lat,
    lng: b.lng,
    category: b.category
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
    pagination: {
      currentPage,
      totalPages,
      itemsPerPage,
      setItemsPerPage,
      handlePageChange
    }
  };
}
