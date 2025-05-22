
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
  distance?: number; // Distance filter property
  userLat?: number;  // User latitude for distance calculation
  userLng?: number;  // User longitude for distance calculation
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
      // Set up proper image URL with fallbacks
      const logoUrl = business.logo_url || null;
      
      // Image URL options (in order of priority):
      // 1. business.logo_url if available
      // 2. Category-based placeholder images from Unsplash
      // 3. Default placeholder based on business name
      
      let imageUrl = logoUrl;
      
      if (!imageUrl) {
        // Select placeholder image based on category
        const categoryImageMap: Record<string, string> = {
          'Restaurant': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=500',
          'Beauty & Wellness': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500',
          'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500',
          'Fashion & Clothing': 'https://images.unsplash.com/photo-1595665593673-bf1ad72905c1?q=80&w=500',
          'Financial Services': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=500',
          'Health Services': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500',
          'Retail': 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=500'
        };
        
        imageUrl = categoryImageMap[business.category] || 
                  `https://placehold.co/500x300/e0e0e0/808080?text=${business.business_name.charAt(0).toUpperCase()}`;
      }
      
      // Default coordinates (NYC)
      const defaultLat = 40.7128;
      const defaultLng = -74.0060;
      
      // For now, use default coordinates or parse from string if available
      // This is a temporary solution until we have actual lat/lng columns
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
        lat: defaultLat, // Using default coordinates for now
        lng: defaultLng, // Using default coordinates for now
        imageUrl: imageUrl,
        imageAlt: business.business_name || 'Business image',
        isFeatured: business.is_verified || false
      };
    });
    
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

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
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
    
    // Set up proper image URL with fallbacks
    const logoUrl = data.logo_url || null;
    
    // Image URL options (in order of priority):
    // 1. business.logo_url if available
    // 2. Category-based placeholder images from Unsplash
    // 3. Default placeholder based on business name
    
    let imageUrl = logoUrl;
    
    if (!imageUrl) {
      // Select placeholder image based on category
      const categoryImageMap: Record<string, string> = {
        'Restaurant': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=500',
        'Beauty & Wellness': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500',
        'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500',
        'Fashion & Clothing': 'https://images.unsplash.com/photo-1595665593673-bf1ad72905c1?q=80&w=500',
        'Financial Services': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=500',
        'Health Services': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500',
        'Retail': 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=500'
      };
      
      imageUrl = categoryImageMap[data.category] || 
                `https://placehold.co/500x300/e0e0e0/808080?text=${data.business_name.charAt(0).toUpperCase()}`;
    }
    
    // Default coordinates (NYC)
    const defaultLat = 40.7128;
    const defaultLng = -74.0060;
    
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
      lat: defaultLat, // Using default coordinates for now
      lng: defaultLng, // Using default coordinates for now
      imageUrl: imageUrl,
      imageAlt: data.business_name || 'Business image',
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
    
    // Default coordinates (NYC)
    const defaultLat = 40.7128;
    const defaultLng = -74.0060;
    
    // Transform to Business type
    return data.map(business => {
      // Set up proper image URL with fallbacks
      const logoUrl = business.logo_url || null;
      
      // Image URL options (in order of priority):
      // 1. business.logo_url if available
      // 2. Category-based placeholder images from Unsplash
      // 3. Default placeholder based on business name
      
      let imageUrl = logoUrl;
      
      if (!imageUrl) {
        // Select placeholder image based on category
        const categoryImageMap: Record<string, string> = {
          'Restaurant': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=500',
          'Beauty & Wellness': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500',
          'Technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500',
          'Fashion & Clothing': 'https://images.unsplash.com/photo-1595665593673-bf1ad72905c1?q=80&w=500',
          'Financial Services': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=500',
          'Health Services': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=500',
          'Retail': 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=500'
        };
        
        imageUrl = categoryImageMap[business.category] || 
                 `https://placehold.co/500x300/e0e0e0/808080?text=${business.business_name.charAt(0).toUpperCase()}`;
      }
      
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
        lat: defaultLat, // Using default coordinates for now
        lng: defaultLng, // Using default coordinates for now
        imageUrl: imageUrl,
        imageAlt: business.business_name || 'Business image',
        isFeatured: business.is_verified || false
      };
    });
  } catch (error) {
    console.error('Unexpected error searching businesses:', error);
    return [];
  }
}
