
export interface SalesAgent {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  referral_code: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
}

export interface SalesAgentApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  why_join: string;
  business_experience: string;
  marketing_ideas: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface SalesAgentReferral {
  id: string;
  agent_id: string;
  referred_user_id: string;
  user_type: 'customer' | 'business';
  status: 'pending' | 'completed';
  commission_amount: number;
  created_at: string;
}

export interface SalesAgentStats {
  total_referrals: number;
  successful_referrals: number;
  pending_referrals: number;
  total_earnings: number;
  pending_earnings: number;
}
