
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

export interface BusinessFilters {
  category?: string;
  minRating?: number;
  minDiscount?: number;
  searchTerm?: string;
  featured?: boolean;
  distance?: number; // Added distance property
  userLat?: number;  // Added user latitude
  userLng?: number;  // Added user longitude
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface BusinessQueryResult {
  businesses: Business[];
  totalCount: number;
  totalPages: number;
}

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
    const businesses = data.map(business => {
      // Extract coordinates safely with fallbacks
      const lat = parseFloat(business.lat as unknown as string) || 40.7128;
      const lng = parseFloat(business.lng as unknown as string) || -74.0060;
      
      return {
        id: business.id as unknown as number, 
        name: business.business_name,
        category: business.category || 'Uncategorized',
        rating: business.average_rating || 4.5,
        reviewCount: business.review_count || 10,
        discount: '10% Off', // Default discount
        discountValue: 10,
        distance: 'Nearby', // Default distance
        distanceValue: 0,
        address: business.address || '',
        lat, // Using parsed coordinates
        lng, // Using parsed coordinates
        imageUrl: business.logo_url || `/businesses/${business.id}.jpg`,
        isFeatured: business.is_verified || false
      };
    });
    
    return { businesses, totalCount, totalPages };
  } catch (error) {
    console.error('Unexpected error fetching businesses:', error);
    toast.error('Something went wrong while loading businesses');
    return { businesses: [], totalCount: 0, totalPages: 0 };
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
    
    // Extract coordinates safely with fallbacks
    const lat = parseFloat(data.lat as unknown as string) || 40.7128;
    const lng = parseFloat(data.lng as unknown as string) || -74.0060;
    
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
      lat, // Using parsed coordinates
      lng, // Using parsed coordinates
      imageUrl: data.logo_url || `/businesses/${data.id}.jpg`,
      isFeatured: data.is_verified || false
    };
  } catch (error) {
    console.error('Unexpected error fetching business:', error);
    return null;
  }
}

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
    return data.map(business => {
      // Extract coordinates safely with fallbacks
      const lat = parseFloat(business.lat as unknown as string) || 40.7128;
      const lng = parseFloat(business.lng as unknown as string) || -74.0060;
      
      return {
        id: business.id as unknown as number,
        name: business.business_name,
        category: business.category || 'Uncategorized',
        rating: business.average_rating || 4.5,
        reviewCount: business.review_count || 10,
        discount: '10% Off',
        discountValue: 10,
        distance: 'Nearby',
        distanceValue: 0,
        address: business.address || '',
        lat, // Using parsed coordinates
        lng, // Using parsed coordinates
        imageUrl: business.logo_url || `/businesses/${business.id}.jpg`,
        isFeatured: business.is_verified || false
      };
    });
  } catch (error) {
    console.error('Unexpected error searching businesses:', error);
    return [];
  }
}
