
import { supabase } from '@/integrations/supabase/client';

// Function to fetch all unique categories from the database
export async function fetchBusinessCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('category')
      .not('category', 'is', null);
      
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))].filter(Boolean);
    return categories.sort();
  } catch (error) {
    console.error('Unexpected error fetching categories:', error);
    return [];
  }
}
