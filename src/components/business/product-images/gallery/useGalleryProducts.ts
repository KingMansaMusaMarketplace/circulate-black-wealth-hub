
import { useState, useEffect, useMemo } from 'react';
import { ProductImage } from '@/lib/api/product-api';
import { SortOption, FilterOption } from './ProductFilters';
import { AdvancedFiltersState } from './AdvancedFilters';

export const useGalleryProducts = (products: ProductImage[], itemsPerPage: number) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState | null>(null);
  
  // Extract unique categories from products
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    products.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    return Array.from(categorySet);
  }, [products]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, filterBy, advancedFilters]);
  
  // Apply filtering
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Basic search term filter
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
                          
      // Status filter
      let matchesStatus = true;
      if (filterBy === 'active') matchesStatus = product.is_active;
      if (filterBy === 'inactive') matchesStatus = !product.is_active;
      
      // If no advanced filters are applied, return basic filtering result
      if (!advancedFilters) return matchesSearch && matchesStatus;
      
      // Advanced filters
      let matchesAdvancedFilters = true;
      
      // Category filter
      if (advancedFilters.category && product.category !== advancedFilters.category) {
        matchesAdvancedFilters = false;
      }
      
      // Tag filter - handle tags as string
      if (advancedFilters.hasTag) {
        const tagString = typeof product.tags === 'string' ? product.tags : '';
        if (!tagString.toLowerCase().includes(advancedFilters.hasTag.toLowerCase())) {
          matchesAdvancedFilters = false;
        }
      }
      
      // Price range filter (if price is available)
      if (product.price) {
        const numPrice = parseFloat(product.price);
        if (!isNaN(numPrice)) {
          if (numPrice < advancedFilters.priceRange.min || 
              numPrice > advancedFilters.priceRange.max) {
            matchesAdvancedFilters = false;
          }
        }
      }
      
      // Date range filter
      if (advancedFilters.dateAdded.from || advancedFilters.dateAdded.to) {
        const createdDate = new Date(product.created_at || '');
        
        if (advancedFilters.dateAdded.from) {
          const fromDate = new Date(advancedFilters.dateAdded.from);
          if (createdDate < fromDate) matchesAdvancedFilters = false;
        }
        
        if (advancedFilters.dateAdded.to) {
          const toDate = new Date(advancedFilters.dateAdded.to);
          toDate.setHours(23, 59, 59); // End of the day
          if (createdDate > toDate) matchesAdvancedFilters = false;
        }
      }
      
      return matchesSearch && matchesStatus && matchesAdvancedFilters;
    });
  }, [products, searchTerm, filterBy, advancedFilters]);
  
  // Apply sorting
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        case 'oldest':
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);
  
  // Apply pagination
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(
      (safeCurrentPage - 1) * itemsPerPage,
      safeCurrentPage * itemsPerPage
    );
  }, [sortedProducts, safeCurrentPage, itemsPerPage]);
  
  // Handle applying advanced filters
  const handleApplyAdvancedFilters = (filters: AdvancedFiltersState) => {
    setAdvancedFilters(filters);
  };
  
  return {
    filteredProducts,
    sortedProducts,
    paginatedProducts,
    totalPages,
    currentPage,
    safeCurrentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    categories,
    handleApplyAdvancedFilters
  };
};
