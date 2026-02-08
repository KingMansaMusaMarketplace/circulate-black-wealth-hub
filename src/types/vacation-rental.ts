
export type PropertyType = 'house' | 'apartment' | 'cabin' | 'villa' | 'cottage' | 'condo' | 'townhouse' | 'loft' | 'studio' | 'other';

export type VacationBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';

export interface VacationProperty {
  id: string;
  host_id: string;
  title: string;
  description: string | null;
  property_type: PropertyType;
  
  // Location
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  
  // Property details
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  
  // Pricing
  base_nightly_rate: number;
  cleaning_fee: number;
  service_fee_percent: number;
  
  // Amenities and rules
  amenities: string[];
  house_rules: string | null;
  photos: string[];
  
  // Settings
  is_active: boolean;
  is_instant_book: boolean;
  is_verified: boolean;
  min_nights: number;
  max_nights: number;
  check_in_time: string;
  check_out_time: string;
  
  // Pets
  pets_allowed: boolean;
  pet_fee: number;
  
  // Stats
  average_rating: number;
  review_count: number;
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  host_name?: string;
  host_avatar?: string;
}

export interface PropertyAvailability {
  id: string;
  property_id: string;
  date: string;
  is_available: boolean;
  custom_price: number | null;
  booking_id: string | null;
  notes: string | null;
}

export interface VacationBooking {
  id: string;
  property_id: string;
  guest_id: string;
  
  check_in_date: string;
  check_out_date: string;
  num_nights: number;
  num_guests: number;
  num_pets: number;
  
  // Pricing
  nightly_rate: number;
  cleaning_fee: number;
  pet_fee: number;
  subtotal: number;
  platform_fee: number;
  host_payout: number;
  total_amount: number;
  
  status: VacationBookingStatus;
  
  // Payment
  payment_intent_id: string | null;
  stripe_charge_id: string | null;
  payout_status: string;
  payout_date: string | null;
  
  // Guest info
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  special_requests: string | null;
  
  confirmed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined data
  property?: VacationProperty;
}

export interface PropertyReview {
  id: string;
  property_id: string;
  booking_id: string;
  guest_id: string;
  
  rating: number;
  cleanliness: number | null;
  accuracy: number | null;
  communication: number | null;
  location: number | null;
  check_in: number | null;
  value: number | null;
  
  review_text: string | null;
  host_response: string | null;
  host_response_at: string | null;
  
  is_public: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined data
  guest_name?: string;
  guest_avatar?: string;
}

export interface PropertySearchFilters {
  city?: string;
  state?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  amenities?: string[];
  petsAllowed?: boolean;
  instantBook?: boolean;
  bedrooms?: number;
  bathrooms?: number;
}

export interface PricingBreakdown {
  nights: number;
  nightlyRate: number;
  subtotal: number;
  cleaningFee: number;
  petFee: number;
  serviceFee: number;
  platformFee: number;
  total: number;
  hostPayout: number;
}

export const AMENITIES_LIST = [
  { id: 'wifi', label: 'WiFi', icon: 'Wifi' },
  { id: 'kitchen', label: 'Kitchen', icon: 'ChefHat' },
  { id: 'washer', label: 'Washer', icon: 'Shirt' },
  { id: 'dryer', label: 'Dryer', icon: 'Wind' },
  { id: 'ac', label: 'Air Conditioning', icon: 'Snowflake' },
  { id: 'heating', label: 'Heating', icon: 'Flame' },
  { id: 'pool', label: 'Pool', icon: 'Waves' },
  { id: 'hot_tub', label: 'Hot Tub', icon: 'Bath' },
  { id: 'parking', label: 'Free Parking', icon: 'Car' },
  { id: 'gym', label: 'Gym', icon: 'Dumbbell' },
  { id: 'bbq', label: 'BBQ Grill', icon: 'Utensils' },
  { id: 'fireplace', label: 'Fireplace', icon: 'Flame' },
  { id: 'tv', label: 'TV', icon: 'Tv' },
  { id: 'workspace', label: 'Dedicated Workspace', icon: 'Laptop' },
  { id: 'ev_charger', label: 'EV Charger', icon: 'Zap' },
  { id: 'beach_access', label: 'Beach Access', icon: 'Umbrella' },
  { id: 'lake_access', label: 'Lake Access', icon: 'Anchor' },
  { id: 'ski_access', label: 'Ski-in/Ski-out', icon: 'Mountain' },
  { id: 'patio', label: 'Patio/Balcony', icon: 'Sun' },
  { id: 'garden', label: 'Garden', icon: 'TreePine' },
] as const;

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'villa', label: 'Villa' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'loft', label: 'Loft' },
  { value: 'studio', label: 'Studio' },
  { value: 'other', label: 'Other' },
];
