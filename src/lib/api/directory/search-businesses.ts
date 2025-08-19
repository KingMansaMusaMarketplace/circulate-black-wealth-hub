
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { mapSupabaseBusinessToBusiness } from './mappers';

// Function to search businesses by term (name, category, address)
export async function searchBusinesses(term: string): Promise<Business[]> {
  try {
    // Check if user is authenticated - if not, use business_directory view
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Use business_directory view for non-authenticated users
      const { data, error } = await supabase
        .from('business_directory')
        .select('*')
        .or(`business_name.ilike.%${term}%,category.ilike.%${term}%`)
        .limit(20);
      
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
