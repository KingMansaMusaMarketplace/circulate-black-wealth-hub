
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { mapSupabaseBusinessToBusiness } from './mappers';

// Function to search businesses by term (name, category, address)
export async function searchBusinesses(term: string): Promise<Business[]> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .or(`business_name.ilike.%${term}%,category.ilike.%${term}%,address.ilike.%${term}%`)
      .limit(20);
      
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
