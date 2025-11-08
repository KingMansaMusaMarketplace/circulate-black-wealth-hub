export interface AgentRecruitmentBonus {
  id: string;
  recruiter_agent_id: string;
  recruited_agent_id: string;
  bonus_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  earned_date: string;
  paid_date?: string;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface AgentTeamOverride {
  id: string;
  recruiter_agent_id: string;
  recruited_agent_id: string;
  referral_id: string;
  base_commission_amount: number;
  override_percentage: number;
  override_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  earned_date: string;
  paid_date?: string;
  payment_reference?: string;
  created_at: string;
}

export interface RecruitedAgent {
  id: string;
  full_name: string;
  email: string;
  referral_code: string;
  is_active: boolean;
  recruitment_date: string;
  team_override_end_date: string;
  total_referrals: number;
  total_earned: number;
}
