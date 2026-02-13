
import { Business } from '@/types/business';

/**
 * Maps a Supabase business record to our frontend Business type
 */
export function mapSupabaseBusinessToBusiness(supabaseRecord: any): Business {
  // Handle both business_name and name columns (name takes precedence if both exist)
  const businessName = supabaseRecord.name || supabaseRecord.business_name || 'Unnamed Business';
  const logoUrl = supabaseRecord.logo_url || '';
  
  return {
    id: supabaseRecord.id,
    name: businessName,
    description: supabaseRecord.description || '',
    category: supabaseRecord.category || 'Other',
    address: supabaseRecord.address || '',
    city: supabaseRecord.city || '',
    state: supabaseRecord.state || '',
    zipCode: supabaseRecord.zip_code || '',
    phone: supabaseRecord.phone || '',
    email: supabaseRecord.email || '',
    website: supabaseRecord.website || '',
    logoUrl: logoUrl,
    bannerUrl: supabaseRecord.banner_url || '',
    averageRating: Number(supabaseRecord.average_rating) || 0,
    reviewCount: supabaseRecord.review_count || 0,
    // Backward compatibility properties
    rating: Number(supabaseRecord.average_rating) || 4.5,
    discount: supabaseRecord.discount || '',
    discountValue: 10,
    distance: '',
    distanceValue: 0,
    lat: supabaseRecord.latitude ? Number(supabaseRecord.latitude) : 0,
    lng: supabaseRecord.longitude ? Number(supabaseRecord.longitude) : 0,
    imageUrl: supabaseRecord.banner_url || logoUrl, // Prefer banner for card hero image, fall back to logo
    imageAlt: businessName,
    isFeatured: supabaseRecord.is_verified || false,
    isVerified: supabaseRecord.is_verified || false,
    ownerId: supabaseRecord.owner_id,
    createdAt: supabaseRecord.created_at,
    updatedAt: supabaseRecord.updated_at
  };
}
