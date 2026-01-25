export type PartnerTier = 'founding' | 'premium' | 'standard';
export type PartnerStatus = 'pending' | 'active' | 'suspended' | 'inactive';
export type CommissionTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface DirectoryPartner {
  id: string;
  user_id: string;
  directory_name: string;
  directory_url: string | null;
  contact_email: string;
  contact_phone: string | null;
  description: string | null;
  logo_url: string | null;
  status: PartnerStatus;
  tier: PartnerTier;
  referral_code: string;
  referral_link: string;
  flat_fee_per_signup: number;
  revenue_share_percent: number;
  total_referrals: number;
  total_conversions: number;
  total_earnings: number;
  pending_earnings: number;
  embed_token: string;
  embed_enabled: boolean;
  approved_at: string | null;
  approved_by: string | null;
  payout_frequency: 'weekly' | 'biweekly' | 'monthly' | 'net30';
  minimum_payout_threshold: number;
  last_payout_date: string | null;
  created_at: string;
  updated_at: string;
  // New enhanced fields
  commission_tier: CommissionTier;
  tier_updated_at: string | null;
  lifetime_referrals: number;
  monthly_bonus_earned: number;
  cookie_duration_days: number;
  email_notifications_enabled: boolean;
  leaderboard_opt_in: boolean;
}

export interface PartnerReferral {
  id: string;
  partner_id: string;
  referred_user_id: string | null;
  referred_business_id: string | null;
  referred_email: string;
  referred_business_name: string | null;
  referral_code: string;
  ip_address: string | null;
  user_agent: string | null;
  is_converted: boolean;
  converted_at: string | null;
  conversion_type: string | null;
  flat_fee_earned: number;
  revenue_share_earned: number;
  total_earned: number;
  status: 'pending' | 'credited' | 'paid' | 'blocked';
  credited_at: string | null;
  created_at: string;
  updated_at: string;
  // UTM tracking
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_page: string | null;
  cookie_expires_at: string | null;
}

export interface PartnerPayout {
  id: string;
  partner_id: string;
  amount: number;
  payout_method: string;
  payment_reference: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requested_at: string;
  processed_at: string | null;
  processed_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface PartnerStats {
  totalReferrals: number;
  totalConversions: number;
  conversionRate: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  thisMonthReferrals: number;
  thisMonthEarnings: number;
}

export interface PartnerLinkClick {
  id: string;
  partner_id: string;
  referral_code: string;
  ip_address: string | null;
  user_agent: string | null;
  referer_url: string | null;
  landing_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  country_code: string | null;
  device_type: string | null;
  converted_to_signup: boolean;
  referral_id: string | null;
  created_at: string;
}

export interface PartnerInvoice {
  id: string;
  partner_id: string;
  payout_id: string | null;
  invoice_number: string;
  invoice_date: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  partner_details: Record<string, unknown>;
  status: 'issued' | 'paid' | 'void';
  pdf_url: string | null;
  created_at: string;
}

export interface PartnerBonusMilestone {
  id: string;
  milestone_name: string;
  referrals_required: number;
  bonus_amount: number;
  is_active: boolean;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  directory_name: string;
  logo_url: string | null;
  commission_tier: CommissionTier;
  total_referrals: number;
  total_conversions: number;
  total_earnings: number;
  lifetime_referrals: number;
  conversion_rate: number;
  earnings_rank: number;
  referrals_rank: number;
  created_at: string;
}

export interface FunnelData {
  clicks: number;
  signups: number;
  conversions: number;
}

export interface UTMPerformance {
  source: string;
  medium: string;
  campaign: string;
  clicks: number;
  signups: number;
  conversions: number;
  earnings: number;
}
