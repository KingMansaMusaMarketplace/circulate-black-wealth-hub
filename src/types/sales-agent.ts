
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
  lifetime_referrals?: number;
  tier?: string;
  last_tier_update?: string;
  recruited_by_agent_id?: string;
  recruitment_date?: string;
  team_override_end_date?: string;
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

// Secure version for users taking the test (without correct answers)
export interface SecureTestQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  created_at: string;
}

export interface TestValidationResult {
  total_questions: number;
  correct_answers: number;
  score: number;
  passed: boolean;
  passing_score: number;
}

export interface Referral {
  id: string;
  sales_agent_id: string;
  referred_user_id: string;
  referred_user_type: string;
  referral_date: string;
  commission_status: string;
  commission_amount?: number;
  subscription_amount?: number;
  payment_date?: string;
  tier?: number; // 1 for direct referrals, 2 for team bonus
  parent_referral_id?: string; // Links tier 2 referrals to their tier 1 parent
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
