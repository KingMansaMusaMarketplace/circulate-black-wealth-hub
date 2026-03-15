
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { mapSupabaseBusinessToBusiness } from './mappers';

// Function to fetch a single business by ID
export async function fetchBusinessById(id: string): Promise<Business | null> {
  try {
    // Validate UUID format before making the query
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.log('fetchBusinessById: Invalid UUID format, skipping database query');
      return null;
    }
    
    // Use SECURITY DEFINER RPC to bypass RLS
    const { data, error } = await supabase
      .rpc('get_directory_business_by_id', { p_business_id: id });
    
    if (error) {
      console.error('Error fetching business:', error);
      return null;
    }
    
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return null;
    
    return mapSupabaseBusinessToBusiness(row);
  } catch (error) {
    console.error('Unexpected error fetching business:', error);
    return null;
  }
}
