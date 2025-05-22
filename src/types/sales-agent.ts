
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
  
  // Adding the missing fields
  application_status?: 'pending' | 'approved' | 'rejected';
  reviewed_at?: string;
  notes?: string;
  test_passed?: boolean;
  test_score?: number;
  application_date?: string;
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

// Adding the TestQuestion type
export interface TestQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  is_active: boolean;
}

// Adding the Referral type
export interface Referral {
  id: string;
  sales_agent_id: string;
  referred_user_id: string;
  referred_user_type: 'customer' | 'business';
  referral_date: string;
  commission_status: 'pending' | 'paid' | 'cancelled';
  commission_amount: number;
  referred_user?: {
    email: string;
  };
}

// Adding the AgentCommission type
export interface AgentCommission {
  id: string;
  sales_agent_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'processing';
  due_date?: string;
  paid_date?: string;
  payment_reference?: string;
  referral?: {
    referral_date: string;
  };
}
