
export interface SalesAgent {
  id: string;
  name: string;
  email: string;
  referral_code: string;
  commission_rate?: number;
  created_at?: string;
  updated_at?: string;
}
