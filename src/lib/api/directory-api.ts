
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { toast } from 'sonner';

export interface BusinessResponse {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  discount: string;
  discountValue: number;
  address: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  imageAlt?: string;
  isFeatured?: boolean;
}

export async function fetchBusinesses(): Promise<Business[]> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
      return [];
    }
    
    // Transform Supabase response to our frontend Business type
    return data.map(business => ({
      id: business.id as unknown as number, // Convert UUID to number for frontend
      name: business.business_name,
      category: business.category || 'Uncategorized',
      rating: business.average_rating || 4.5,
      reviewCount: business.review_count || 10,
      discount: '10% Off', // Default discount
      discountValue: 10,
      distance: 'Nearby', // Default distance
      distanceValue: 0,
      address: business.address || '',
      lat: 40.7128, // Default latitude if not available
      lng: -74.0060, // Default longitude if not available
      imageUrl: business.logo_url || `/businesses/${business.id}.jpg`, // Try to use business ID for image naming
      isFeatured: business.is_verified || false
    }));
  } catch (error) {
    console.error('Unexpected error fetching businesses:', error);
    toast.error('Something went wrong while loading businesses');
    return [];
  }
}

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
    
    return {
      id: data.id as unknown as number,
      name: data.business_name,
      category: data.category || 'Uncategorized',
      rating: data.average_rating || 4.5,
      reviewCount: data.review_count || 10,
      discount: '10% Off',
      discountValue: 10,
      distance: 'Nearby',
      distanceValue: 0,
      address: data.address || '',
      lat: 40.7128,
      lng: -74.0060,
      imageUrl: data.logo_url || `/businesses/${data.id}.jpg`,
      isFeatured: data.is_verified || false
    };
  } catch (error) {
    console.error('Unexpected error fetching business:', error);
    return null;
  }
}
