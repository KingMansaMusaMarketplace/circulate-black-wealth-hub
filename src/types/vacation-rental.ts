
export type PropertyType = 'house' | 'apartment' | 'cabin' | 'villa' | 'cottage' | 'condo' | 'townhouse' | 'loft' | 'studio' | 'other';

export type VacationBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';

export type CancellationPolicyType = 'flexible' | 'moderate' | 'strict';

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
  security_deposit?: number;
  
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
  cancellation_policy?: CancellationPolicyType;
  
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
  min_nights_override?: number | null;
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
  
  // Cancellation
  cancellation_policy?: CancellationPolicyType;
  cancelled_at: string | null;
  cancelled_by?: string | null;
  cancellation_reason: string | null;
  refund_amount?: number | null;
  refund_status?: string | null;
  
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined data
  property?: VacationProperty;
}

export interface PropertyReview {
  id: string;
  property_id: string;
  booking_id: string;
  reviewer_id: string;
  reviewer_type: 'guest' | 'host';
  reviewee_id: string;
  
  overall_rating: number;
  cleanliness_rating?: number | null;
  accuracy_rating?: number | null;
  communication_rating?: number | null;
  location_rating?: number | null;
  checkin_rating?: number | null;
  value_rating?: number | null;
  
  review_text: string | null;
  host_response: string | null;
  host_response_at: string | null;
  
  is_public: boolean;
  is_flagged?: boolean;
  flag_reason?: string | null;
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  guest_name?: string;
  guest_avatar?: string;
}

export interface StaysConversation {
  id: string;
  property_id: string;
  guest_id: string;
  host_id: string;
  booking_id?: string | null;
  subject?: string | null;
  last_message_at: string;
  guest_unread_count: number;
  host_unread_count: number;
  is_archived_by_guest: boolean;
  is_archived_by_host: boolean;
  created_at: string;
  // Joined
  property?: VacationProperty;
  last_message?: StaysMessage;
}

export interface StaysMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  read_at?: string | null;
  attachments?: any[];
  message_type: 'text' | 'booking_request' | 'system';
  created_at: string;
}

export interface PropertyPricingRule {
  id: string;
  property_id: string;
  rule_type: 'weekend' | 'seasonal' | 'last_minute' | 'length_of_stay' | 'custom';
  name: string;
  adjustment_type: 'percent' | 'fixed';
  adjustment_value: number;
  start_date?: string | null;
  end_date?: string | null;
  days_of_week?: number[];
  min_days_before?: number | null;
  min_nights?: number | null;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface HostPayout {
  id: string;
  host_id: string;
  booking_id?: string | null;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  scheduled_date?: string | null;
  paid_at?: string | null;
  stripe_transfer_id?: string | null;
  description?: string | null;
  created_at: string;
  // Joined
  booking?: VacationBooking;
}

export interface PropertyAnalytics {
  property_id: string;
  total_views: number;
  detail_views: number;
  booking_started: number;
  bookings_completed: number;
  conversion_rate: number;
  total_revenue: number;
  average_rating: number;
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
  securityDeposit?: number;
  total: number;
  hostPayout: number;
}

export const CANCELLATION_POLICIES = {
  flexible: {
    label: 'Flexible',
    description: 'Full refund up to 24 hours before check-in',
    refund_cutoff_hours: 24,
    refund_percent: 100,
  },
  moderate: {
    label: 'Moderate', 
    description: 'Full refund up to 5 days before check-in',
    refund_cutoff_hours: 120,
    refund_percent: 100,
  },
  strict: {
    label: 'Strict',
    description: '50% refund up to 7 days before check-in',
    refund_cutoff_hours: 168,
    refund_percent: 50,
  },
} as const;

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
