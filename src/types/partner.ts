export type PartnerTier = 'founding' | 'premium' | 'standard';
export type PartnerStatus = 'pending' | 'active' | 'suspended' | 'inactive';

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
  created_at: string;
  updated_at: string;
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
  status: 'pending' | 'credited' | 'paid';
  credited_at: string | null;
  created_at: string;
  updated_at: string;
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
