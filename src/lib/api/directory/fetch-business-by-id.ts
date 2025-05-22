
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { mapSupabaseBusinessToBusiness } from './mappers';

// Function to fetch a single business by ID
export async function fetchBusinessById(id: number): Promise<Business | null> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id.toString()) // Convert number ID to string for Supabase query
      .single();
    
    if (error) {
      console.error('Error fetching business:', error);
      return null;
    }
    
    if (!data) return null;
    
    return mapSupabaseBusinessToBusiness(data);
  } catch (error) {
    console.error('Unexpected error fetching business:', error);
    return null;
  }
}
