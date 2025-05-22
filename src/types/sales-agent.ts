
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
  created_at: string;
  updated_at: string;
}

export interface SalesAgentApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  application_status: 'pending' | 'approved' | 'rejected';
  application_date: string;
  test_score: number | null;
  test_passed: boolean | null;
  notes?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  is_active: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  sales_agent_id: string;
  referred_user_id: string;
  referred_user_type: 'business' | 'customer';
  referral_date: string;
  commission_amount: number;
  subscription_amount: number;
  commission_status: 'pending' | 'paid';
  payment_date?: string;
}

export interface AgentCommission {
  id: string;
  sales_agent_id: string;
  referral_id: string;
  amount: number;
  status: 'pending' | 'paid';
  due_date?: string;
  paid_date?: string;
  payment_reference?: string;
}
