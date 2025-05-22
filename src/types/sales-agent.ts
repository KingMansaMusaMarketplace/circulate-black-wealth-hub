
export type SalesAgentApplication = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  test_score?: number;
  test_passed: boolean;
  application_status: 'pending' | 'approved' | 'rejected';
  application_date: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
};

export type SalesAgent = {
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
};

export type Referral = {
  id: string;
  sales_agent_id: string;
  referred_user_id: string;
  referred_user_type: 'customer' | 'business';
  referral_date: string;
  commission_amount?: number;
  commission_status: 'pending' | 'paid' | 'cancelled';
  payment_date?: string;
  subscription_amount?: number;
  referred_user?: {
    email?: string;
  };
};

export type AgentCommission = {
  id: string;
  sales_agent_id: string;
  referral_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'cancelled';
  due_date?: string;
  paid_date?: string;
  payment_reference?: string;
};

export type TestQuestion = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  is_active: boolean;
};

export type TestAttempt = {
  id: string;
  user_id: string;
  score: number;
  passed: boolean;
  attempt_date: string;
  completed_date?: string;
  answers?: {
    [questionId: string]: string;
  };
  application_id?: string; // Added for linking test attempts to applications
};
