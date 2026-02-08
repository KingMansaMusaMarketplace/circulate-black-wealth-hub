
import { supabase } from '@/integrations/supabase/client';
import { 
  VacationProperty, 
  VacationBooking, 
  PropertyAvailability, 
  PropertyReview,
  PropertySearchFilters,
  PricingBreakdown
} from '@/types/vacation-rental';

// Fetch all active properties
export async function fetchVacationProperties(
  filters?: PropertySearchFilters
): Promise<VacationProperty[]> {
  let query = supabase
    .from('vacation_properties')
    .select('*')
    .eq('is_active', true);

  if (filters?.city) {
    query = query.ilike('city', `%${filters.city}%`);
  }
  if (filters?.state) {
    query = query.eq('state', filters.state);
  }
  if (filters?.guests) {
    query = query.gte('max_guests', filters.guests);
  }
  if (filters?.minPrice) {
    query = query.gte('base_nightly_rate', filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte('base_nightly_rate', filters.maxPrice);
  }
  if (filters?.propertyType) {
    query = query.eq('property_type', filters.propertyType);
  }
  if (filters?.petsAllowed) {
    query = query.eq('pets_allowed', true);
  }
  if (filters?.instantBook) {
    query = query.eq('is_instant_book', true);
  }
  if (filters?.bedrooms) {
    query = query.gte('bedrooms', filters.bedrooms);
  }
  if (filters?.bathrooms) {
    query = query.gte('bathrooms', filters.bathrooms);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vacation properties:', error);
    throw error;
  }

  return (data || []).map(mapPropertyFromDB);
}

// Fetch single property by ID
export async function fetchPropertyById(id: string): Promise<VacationProperty | null> {
  const { data, error } = await supabase
    .from('vacation_properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }

  return mapPropertyFromDB(data);
}

// Fetch properties by host
export async function fetchHostProperties(hostId: string): Promise<VacationProperty[]> {
  const { data, error } = await supabase
    .from('vacation_properties')
    .select('*')
    .eq('host_id', hostId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching host properties:', error);
    throw error;
  }

  return (data || []).map(mapPropertyFromDB);
}

// Create new property
export async function createProperty(
  property: Partial<VacationProperty>
): Promise<VacationProperty> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('vacation_properties')
    .insert({
      host_id: userData.user.id,
      title: property.title,
      description: property.description,
      property_type: property.property_type || 'house',
      address: property.address,
      city: property.city,
      state: property.state,
      zip_code: property.zip_code,
      country: property.country || 'USA',
      latitude: property.latitude,
      longitude: property.longitude,
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      max_guests: property.max_guests || 2,
      base_nightly_rate: property.base_nightly_rate,
      cleaning_fee: property.cleaning_fee || 0,
      amenities: property.amenities || [],
      house_rules: property.house_rules,
      photos: property.photos || [],
      is_active: false, // Start inactive until reviewed
      is_instant_book: property.is_instant_book || false,
      min_nights: property.min_nights || 1,
      max_nights: property.max_nights || 30,
      check_in_time: property.check_in_time || '15:00',
      check_out_time: property.check_out_time || '11:00',
      pets_allowed: property.pets_allowed || false,
      pet_fee: property.pet_fee || 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating property:', error);
    throw error;
  }

  return mapPropertyFromDB(data);
}

// Update property
export async function updateProperty(
  id: string,
  updates: Partial<VacationProperty>
): Promise<VacationProperty> {
  const { data, error } = await supabase
    .from('vacation_properties')
    .update({
      title: updates.title,
      description: updates.description,
      property_type: updates.property_type,
      address: updates.address,
      city: updates.city,
      state: updates.state,
      zip_code: updates.zip_code,
      latitude: updates.latitude,
      longitude: updates.longitude,
      bedrooms: updates.bedrooms,
      bathrooms: updates.bathrooms,
      max_guests: updates.max_guests,
      base_nightly_rate: updates.base_nightly_rate,
      cleaning_fee: updates.cleaning_fee,
      amenities: updates.amenities,
      house_rules: updates.house_rules,
      photos: updates.photos,
      is_active: updates.is_active,
      is_instant_book: updates.is_instant_book,
      min_nights: updates.min_nights,
      max_nights: updates.max_nights,
      check_in_time: updates.check_in_time,
      check_out_time: updates.check_out_time,
      pets_allowed: updates.pets_allowed,
      pet_fee: updates.pet_fee,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating property:', error);
    throw error;
  }

  return mapPropertyFromDB(data);
}

// Fetch property availability for date range
export async function fetchPropertyAvailability(
  propertyId: string,
  startDate: string,
  endDate: string
): Promise<PropertyAvailability[]> {
  const { data, error } = await supabase
    .from('property_availability')
    .select('*')
    .eq('property_id', propertyId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date');

  if (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }

  return data || [];
}

// Check if dates are available
export async function checkAvailability(
  propertyId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('property_availability')
    .select('date')
    .eq('property_id', propertyId)
    .eq('is_available', false)
    .gte('date', checkIn)
    .lt('date', checkOut);

  if (error) {
    console.error('Error checking availability:', error);
    throw error;
  }

  return (data || []).length === 0;
}

// Calculate pricing for a stay
export function calculatePricing(
  property: VacationProperty,
  checkIn: Date,
  checkOut: Date,
  numPets: number = 0
): PricingBreakdown {
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const nightlyRate = property.base_nightly_rate;
  const subtotal = nights * nightlyRate;
  const cleaningFee = property.cleaning_fee;
  const petFee = property.pets_allowed && numPets > 0 ? property.pet_fee * numPets : 0;
  const serviceFee = 0; // We absorb this into platform fee
  const platformFeePercent = property.service_fee_percent / 100; // 7.5%
  const platformFee = (subtotal + cleaningFee + petFee) * platformFeePercent;
  const total = subtotal + cleaningFee + petFee + platformFee;
  const hostPayout = subtotal + cleaningFee + petFee; // Host gets full amount minus platform fee

  return {
    nights,
    nightlyRate,
    subtotal,
    cleaningFee,
    petFee,
    serviceFee,
    platformFee,
    total,
    hostPayout,
  };
}

// Fetch property reviews
export async function fetchPropertyReviews(propertyId: string): Promise<PropertyReview[]> {
  const { data, error } = await supabase
    .from('property_reviews')
    .select('*')
    .eq('property_id', propertyId)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  return data || [];
}

// Fetch guest bookings
export async function fetchGuestBookings(): Promise<VacationBooking[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from('vacation_bookings')
    .select(`
      *,
      vacation_properties (*)
    `)
    .eq('guest_id', userData.user.id)
    .order('check_in_date', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }

  return (data || []).map(booking => ({
    ...booking,
    property: booking.vacation_properties ? mapPropertyFromDB(booking.vacation_properties) : undefined,
  }));
}

// Fetch host bookings
export async function fetchHostBookings(hostId: string): Promise<VacationBooking[]> {
  const { data, error } = await supabase
    .from('vacation_bookings')
    .select(`
      *,
      vacation_properties!inner (*)
    `)
    .eq('vacation_properties.host_id', hostId)
    .order('check_in_date', { ascending: false });

  if (error) {
    console.error('Error fetching host bookings:', error);
    throw error;
  }

  return (data || []).map(booking => ({
    ...booking,
    property: booking.vacation_properties ? mapPropertyFromDB(booking.vacation_properties) : undefined,
  }));
}

// Helper to map DB record to TypeScript type
function mapPropertyFromDB(data: any): VacationProperty {
  return {
    id: data.id,
    host_id: data.host_id,
    title: data.title,
    description: data.description,
    property_type: data.property_type,
    address: data.address,
    city: data.city,
    state: data.state,
    zip_code: data.zip_code,
    country: data.country,
    latitude: data.latitude ? parseFloat(data.latitude) : null,
    longitude: data.longitude ? parseFloat(data.longitude) : null,
    bedrooms: data.bedrooms,
    bathrooms: parseFloat(data.bathrooms),
    max_guests: data.max_guests,
    base_nightly_rate: parseFloat(data.base_nightly_rate),
    cleaning_fee: parseFloat(data.cleaning_fee || 0),
    service_fee_percent: parseFloat(data.service_fee_percent || 7.5),
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    house_rules: data.house_rules,
    photos: Array.isArray(data.photos) ? data.photos : [],
    is_active: data.is_active,
    is_instant_book: data.is_instant_book,
    is_verified: data.is_verified,
    min_nights: data.min_nights,
    max_nights: data.max_nights,
    check_in_time: data.check_in_time,
    check_out_time: data.check_out_time,
    pets_allowed: data.pets_allowed,
    pet_fee: parseFloat(data.pet_fee || 0),
    average_rating: parseFloat(data.average_rating || 0),
    review_count: data.review_count || 0,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export const vacationRentalService = {
  fetchVacationProperties,
  fetchPropertyById,
  fetchHostProperties,
  createProperty,
  updateProperty,
  fetchPropertyAvailability,
  checkAvailability,
  calculatePricing,
  fetchPropertyReviews,
  fetchGuestBookings,
  fetchHostBookings,
};
