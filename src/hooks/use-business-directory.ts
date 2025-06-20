
import { useState, useEffect, useMemo } from 'react';
import { Business } from '@/types/business';
import { BusinessFilters } from '@/lib/api/directory/types';

interface UseBusinessDirectoryOptions {
  initialFilters?: BusinessFilters;
  pageSize?: number;
  autoFetch?: boolean;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export function useBusinessDirectory(options: UseBusinessDirectoryOptions = {}) {
  const { initialFilters = {}, pageSize = 16, autoFetch = true } = options;
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BusinessFilters>(initialFilters);
  const [page, setPage] = useState(1);

  // Mock data for now
  const mockBusinesses: Business[] = [
    {
      id: 1,
      name: "Soul Food Kitchen",
      description: "Authentic Southern cuisine served with love and tradition",
      category: "Restaurant",
      rating: 4.8,
      reviewCount: 124,
      discount: "15% off first order",
      discountValue: 15,
      distance: "0.3 mi",
      distanceValue: 0.3,
      address: "123 Main St",
      city: "Atlanta",
      state: "GA",
      zipCode: "30303",
      phone: "(404) 555-0101",
      email: "info@soulfoodkitchen.com",
      website: "https://soulfoodkitchen.com",
      lat: 33.7490,
      lng: -84.3880,
      imageUrl: "/lovable-uploads/150432cc-c354-44c5-8b52-771f74dfc018.png",
      imageAlt: "Soul Food Kitchen storefront",
      isFeatured: true
    }
  ];

  const categories = useMemo(() => {
    return ['All', 'Restaurant', 'Beauty', 'Grocery', 'Technology'];
  }, []);

  const pagination: Pagination = useMemo(() => {
    const totalCount = businesses.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      page,
      pageSize,
      totalPages,
      totalCount
    };
  }, [businesses.length, page, pageSize]);

  const updateFilters = (newFilters: Partial<BusinessFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const refetch = () => {
    setBusinesses(mockBusinesses);
  };

  useEffect(() => {
    if (autoFetch) {
      setLoading(true);
      setBusinesses(mockBusinesses);
      setLoading(false);
    }
  }, [autoFetch]);

  return {
    businesses,
    loading,
    error,
    categories,
    pagination,
    filters,
    updateFilters,
    setPage,
    refetch
  };
}
