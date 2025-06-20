
import { useState, useEffect } from 'react';
import { 
  fetchBusinesses, 
  fetchBusinessCategories, 
  BusinessFilters, 
  PaginationParams, 
  BusinessQueryResult
} from '@/lib/api/directory';
import { Business } from '@/types/business';

export interface UseBusinessDirectoryOptions {
  initialFilters?: BusinessFilters;
  initialPage?: number;
  pageSize?: number;
  autoFetch?: boolean;
}

export function useBusinessDirectory(options: UseBusinessDirectoryOptions = {}) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<BusinessFilters>(options.initialFilters || {});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: options.initialPage || 1,
    pageSize: options.pageSize || 16
  });
  
  // Function to load businesses with current filters and pagination
  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const result: BusinessQueryResult = await fetchBusinesses(filters, pagination);
      setBusinesses(result.businesses);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error in useBusinessDirectory:', err);
      setError('Failed to load business directory');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to load categories
  const loadCategories = async () => {
    try {
      const categoryList = await fetchBusinessCategories();
      setCategories(categoryList);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };
  
  // Handle filter changes
  const updateFilters = (newFilters: Partial<BusinessFilters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Handle page changes
  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };
  
  // Handle page size changes
  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  };
  
  // Load businesses when filters or pagination changes
  useEffect(() => {
    if (options.autoFetch !== false) {
      loadBusinesses();
    }
  }, [filters, pagination.page, pagination.pageSize]);
  
  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  return {
    businesses,
    loading,
    error,
    categories,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages,
      totalCount
    },
    filters,
    updateFilters,
    setPage,
    setPageSize,
    refetch: loadBusinesses
  };
}
