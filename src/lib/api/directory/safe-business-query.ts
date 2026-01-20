/**
 * Safe Business Query Utilities
 * 
 * SECURITY: These functions ensure owner contact information (phone, email)
 * is never exposed to unauthorized users. All public directory queries should
 * use these safe wrappers instead of direct Supabase queries.
 */

import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';

// Fields that are safe for public viewing (no owner contact info)
const SAFE_BUSINESS_FIELDS = `
  id,
  business_name,
  name,
  description,
  category,
  address,
  city,
  state,
  zip_code,
  website,
  logo_url,
  banner_url,
  is_verified,
  average_rating,
  review_count,
  location_type,
  location_name,
  parent_business_id,
  created_at,
  updated_at
`.trim();

// Sensitive fields that should only be visible to owners/admins
const SENSITIVE_FIELDS = ['phone', 'email', 'owner_id'];

/**
 * Filter out sensitive fields from business data
 * Defense-in-depth: Even if backend leaks data, client filters it
 */
export function filterSensitiveBusinessFields<T extends Record<string, any>>(
  business: T
): Omit<T, 'phone' | 'email'> {
  const filtered = { ...business };
  SENSITIVE_FIELDS.forEach(field => {
    delete filtered[field];
  });
  return filtered as Omit<T, 'phone' | 'email'>;
}

/**
 * Fetch businesses safely for public directory
 * Uses RPC function that explicitly excludes owner contact info
 */
export async function fetchSafeBusinessDirectory(
  limit: number = 20,
  offset: number = 0
): Promise<Business[]> {
  try {
    // Use the secure businesses_public_safe view that excludes email/phone
    const { data, error } = await supabase
      .from('businesses_public_safe')
      .select('*')
      .or('is_verified.eq.true,listing_status.eq.live')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });
    
    if (error) {
      // Fallback to RPC if view is not available
      console.warn('businesses_public_safe view error, falling back to RPC:', error.message);
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_directory_businesses', {
          p_limit: limit,
          p_offset: offset
        });
      
      if (rpcError) {
        console.error('Error fetching safe business directory:', rpcError);
        return [];
      }
      
      // Additional client-side filtering as defense-in-depth
      return (rpcData || []).map(b => filterSensitiveBusinessFields(b) as unknown as Business);
    }
    
    // The view already excludes sensitive fields, but filter as defense-in-depth
    return (data || []).map(b => filterSensitiveBusinessFields(b) as unknown as Business);
  } catch (error) {
    console.error('Unexpected error in fetchSafeBusinessDirectory:', error);
    return [];
  }
}

/**
 * Fetch a single business safely
 * Returns full data only if user is owner/admin, otherwise returns safe fields
 */
export async function fetchSafeBusinessById(businessId: string): Promise<Business | null> {
  try {
    // Use the secure businesses_public_safe view that excludes email/phone
    const { data, error } = await supabase
      .from('businesses_public_safe')
      .select('*')
      .eq('id', businessId)
      .maybeSingle();
    
    if (error) {
      // Fallback to direct query with safe fields only
      console.warn('businesses_public_safe view error, falling back:', error.message);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('businesses')
        .select(SAFE_BUSINESS_FIELDS)
        .eq('id', businessId)
        .maybeSingle();
      
      if (fallbackError) {
        console.error('Error fetching safe business by ID:', fallbackError);
        return null;
      }
      
      if (!fallbackData) return null;
      
      const filtered = filterSensitiveBusinessFields(fallbackData);
      return filtered as unknown as Business;
    }
    
    if (!data) {
      return null;
    }
    
    // The view already excludes sensitive fields, but filter as defense-in-depth
    const filtered = filterSensitiveBusinessFields(data);
    return filtered as unknown as Business;
  } catch (error) {
    console.error('Unexpected error in fetchSafeBusinessById:', error);
    return null;
  }
}

/**
 * Check if current user is owner/admin and can see full business data
 * Use this before showing sensitive fields in UI
 */
export async function canViewSensitiveBusinessData(businessId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check if user is business owner or location manager
    const { data: business } = await supabase
      .from('businesses')
      .select('owner_id, location_manager_id')
      .eq('id', businessId)
      .maybeSingle();
    
    if (!business) return false;
    
    if (business.owner_id === user.id || business.location_manager_id === user.id) {
      return true;
    }
    
    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });
    
    return isAdmin === true;
  } catch (error) {
    console.error('Error checking business access:', error);
    return false;
  }
}

/**
 * Fetch full business data (including sensitive fields)
 * Only returns data if user has permission
 */
export async function fetchFullBusinessData(businessId: string): Promise<Business | null> {
  try {
    const canView = await canViewSensitiveBusinessData(businessId);
    
    if (!canView) {
      // User doesn't have permission, return safe data only
      return fetchSafeBusinessById(businessId);
    }
    
    // User has permission, return full data
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching full business data:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error in fetchFullBusinessData:', error);
    return null;
  }
}
