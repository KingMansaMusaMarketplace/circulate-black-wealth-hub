import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { mapSupabaseBusinessToBusiness } from './mappers';

export interface SemanticSearchFilters {
  category?: string | null;
  minRating?: number | null;
  distance?: number | null;
  discount?: boolean;
}

// Function to search businesses by term (name, category, address)
export async function searchBusinesses(
  term: string, 
  semanticFilters?: SemanticSearchFilters
): Promise<Business[]> {
  try {
    // Check if user is authenticated - if not, use business_directory view
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Use business_directory view for non-authenticated users
      let query = supabase
        .from('business_directory')
        .select('*');
      
      // Apply semantic filters if provided
      if (semanticFilters) {
        if (semanticFilters.category) {
          query = query.ilike('category', `%${semanticFilters.category}%`);
        }
        if (semanticFilters.minRating) {
          query = query.gte('average_rating', semanticFilters.minRating);
        }
      }
      
      // Apply text search
      query = query.or(`business_name.ilike.%${term}%,category.ilike.%${term}%`);
      query = query.limit(20);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error searching businesses from directory:', error);
        return [];
      }
      
      return data.map(mapSupabaseBusinessToBusiness);
    }
    
    // Authenticated users can use the RPC function
    const { data, error } = await supabase
      .rpc('search_public_businesses', {
        p_search_term: term,
        p_limit: 20,
        p_offset: 0
      });
      
    if (error) {
      console.error('Error searching businesses:', error);
      return [];
    }
    
    // Transform to Business type
    return data.map(mapSupabaseBusinessToBusiness);
  } catch (error) {
    console.error('Unexpected error searching businesses:', error);
    return [];
  }
}
