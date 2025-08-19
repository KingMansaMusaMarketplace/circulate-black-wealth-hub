
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
    // Prepare parameters for the secure function
    const limit = pagination?.pageSize || 20;
    const offset = pagination ? (pagination.page - 1) * pagination.pageSize : 0;
    
    const { data, error } = await supabase
      .rpc('search_public_businesses', {
        p_search_term: filters?.searchTerm || null,
        p_category: filters?.category || null,
        p_min_rating: filters?.minRating || null,
        p_featured: filters?.featured || null,
        p_limit: limit,
        p_offset: offset
      });
    
    if (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
      return { businesses: [], totalCount: 0, totalPages: 0 };
    }
    
    // Get total count from the first row (all rows have same total_count)
    const totalCount = data.length > 0 ? Number(data[0].total_count) : 0;
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
