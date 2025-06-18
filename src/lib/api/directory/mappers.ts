
import { Business } from '@/types/business';

/**
 * Maps a Supabase business record to our frontend Business type
 */
export function mapSupabaseBusinessToBusiness(supabaseRecord: any): Business {
  return {
    id: supabaseRecord.id,
    name: supabaseRecord.name || supabaseRecord.business_name || 'Unnamed Business',
    description: supabaseRecord.description || '',
    category: supabaseRecord.category || 'Other',
    address: supabaseRecord.address || '',
    city: supabaseRecord.city || '',
    state: supabaseRecord.state || '',
    zipCode: supabaseRecord.zip_code || '',
    phone: supabaseRecord.phone || '',
    email: supabaseRecord.email || '',
    website: supabaseRecord.website || '',
    logoUrl: supabaseRecord.logo_url || '',
    bannerUrl: supabaseRecord.banner_url || '',
    averageRating: Number(supabaseRecord.average_rating) || 0,
    reviewCount: supabaseRecord.review_count || 0,
    isVerified: supabaseRecord.is_verified || false,
    lat: 40.7128, // Default to NYC coordinates if not provided
    lng: -74.0060,
    distance: '',
    distanceValue: 0,
    ownerId: supabaseRecord.owner_id,
    createdAt: supabaseRecord.created_at,
    updatedAt: supabaseRecord.updated_at
  };
}
