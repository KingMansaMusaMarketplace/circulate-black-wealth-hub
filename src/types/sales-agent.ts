
export interface SalesAgent {
  id: string;
  name: string;
  full_name: string;
  email: string;
  referral_code: string;
  commission_rate?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
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
  application_status: 'pending' | 'approved' | 'rejected';
  status: 'pending' | 'approved' | 'rejected';
  test_score?: number;
  test_passed: boolean;
  application_date?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  is_active: boolean;
}

export interface Referral {
  id: string;
  sales_agent_id: string;
  referred_user_id: string;
  referral_code: string;
  created_at: string;
  status: 'pending' | 'completed';
}

export interface AgentCommission {
  id: string;
  sales_agent_id: string;
  referral_id: string;
  amount: number;
  status: 'pending' | 'paid';
  created_at: string;
  paid_at?: string;
}
