
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
