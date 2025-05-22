
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Business } from '@/types/business';
import { BusinessFilters, PaginationParams, BusinessQueryResult } from './types';
import { calculateDistance } from './utils';
import { mapSupabaseBusinessToBusiness } from './mappers';

export async function fetchBusinesses(
  filters?: BusinessFilters, 
  pagination?: PaginationParams
): Promise<BusinessQueryResult> {
  try {
    let query = supabase
      .from('businesses')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filters) {
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      if (filters.minRating && filters.minRating > 0) {
        query = query.gte('average_rating', filters.minRating);
      }
      
      if (filters.featured) {
        query = query.eq('is_verified', true);
      }
      
      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const searchTerm = filters.searchTerm.trim().toLowerCase();
        query = query.or(`business_name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`);
      }
    }
    
    // Apply pagination
    if (pagination) {
      const { page, pageSize } = pagination;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }
    
    // Add sorting
    query = query.order('is_verified', { ascending: false }).order('created_at', { ascending: false });
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
      return { businesses: [], totalCount: 0, totalPages: 0 };
    }
    
    // Calculate total pages
    const totalCount = count || 0;
    const totalPages = pagination ? Math.ceil(totalCount / pagination.pageSize) : 1;
    
    // Transform Supabase response to our frontend Business type
    const businesses = data.map(mapSupabaseBusinessToBusiness);
    
    // Calculate distances if user location is provided
    if (filters?.userLat && filters?.userLng) {
      const userLat = filters.userLat;
      const userLng = filters.userLng;
      
      // Calculate distance for each business
      businesses.forEach(business => {
        const distance = calculateDistance(
          userLat,
          userLng,
          business.lat,
          business.lng
        );
        business.distanceValue = distance;
        business.distance = distance.toFixed(1) + ' mi';
      });
      
      // Filter by distance if specified
      if (filters.distance && filters.distance > 0) {
        return {
          businesses: businesses.filter(b => b.distanceValue <= filters.distance!),
          totalCount,
          totalPages
        };
      }
    }
    
    return { businesses, totalCount, totalPages };
  } catch (error) {
    console.error('Unexpected error fetching businesses:', error);
    toast.error('Something went wrong while loading businesses');
    return { businesses: [], totalCount: 0, totalPages: 0 };
  }
}
