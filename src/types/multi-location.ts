export type LocationType = 'independent' | 'parent' | 'location';

export interface BusinessLocation {
  id: string;
  business_name: string;
  location_name: string | null;
  location_type: LocationType;
  parent_business_id: string | null;
  parent_business_name?: string;
  owner_id: string;
  location_manager_id: string | null;
  city: string | null;
  state: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface ParentBusinessAnalytics {
  total_locations: number;
  total_transactions: number;
  total_revenue: number;
  total_customers: number;
  total_qr_scans: number;
  locations_breakdown: LocationBreakdown[];
}

export interface LocationBreakdown {
  location_id: string;
  location_name: string | null;
  city: string | null;
  transaction_count: number;
  revenue: number;
}

export interface TenantConfiguration {
  id: string;
  business_id: string;
  subdomain: string | null;
  custom_domain: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string | null;
  favicon_url: string | null;
  custom_css: string | null;
  branding_enabled: boolean;
  api_key_hash: string | null;
  webhook_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralClick {
  id: string;
  sales_agent_id: string;
  referral_code: string;
  clicked_at: string;
  ip_address: string | null;
  user_agent: string | null;
  converted: boolean;
  converted_user_id: string | null;
  created_at: string;
}

export type AgentTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface EnhancedSalesAgent {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  referral_code: string;
  commission_rate: number;
  total_earned: number;
  total_pending: number;
  is_active: boolean;
  tier: AgentTier;
  lifetime_referrals: number;
  monthly_referrals: number;
  last_tier_update: string;
  created_at: string;
  updated_at: string;
}
