
export interface SalesAgent {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  referral_code: string;
  commission_rate: number;
  total_earned: number;
  total_pending: number;
  is_active: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface SalesAgentApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  why_join: string;
  business_experience: string;
  marketing_ideas: string;
  application_status: string;
  status: 'pending' | 'approved' | 'rejected';
  test_score?: number;
  test_passed: boolean;
  application_date: string;
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  is_active: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  sales_agent_id: string;
  referred_user_id: string;
  referred_user_type: string;
  commission_status: string;
  commission_amount?: number;
  subscription_amount?: number;
  referral_date: string;
  payment_date?: string;
}

export interface AgentCommission {
  id: string;
  sales_agent_id: string;
  referral_id: string;
  amount: number;
  status: string;
  due_date?: string;
  paid_date?: string;
  payment_reference?: string;
}
