
import { Business } from '@/types/business';
import { getBusinessImageUrl } from './utils';

// Default coordinates (NYC)
const DEFAULT_LAT = 40.7128;
const DEFAULT_LNG = -74.0060;

// Transform Supabase response to our frontend Business type
export function mapSupabaseBusinessToBusiness(business: any): Business {
  // Set up proper image URL with fallbacks
  const imageUrl = getBusinessImageUrl(business);
  
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
    lat: DEFAULT_LAT, // Using default coordinates for now
    lng: DEFAULT_LNG, // Using default coordinates for now
    imageUrl: imageUrl,
    imageAlt: business.business_name || 'Business image',
    isFeatured: business.is_verified || false
  };
}
